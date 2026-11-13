"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, ArrowRight, Layers, Footprints, LayoutGrid, Clock, Target, TrendingUp, Check, XCircle, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox, RadioGroup } from "@/components/ui/Checkbox";
import { SelectMenu } from "@/components/ui/Dropdown";
import { Badge, Delta } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/Modal";
import { ProgressBar, SampleDataNote, EmptyState } from "@/components/ui/Misc";
import { DonutChart } from "@/components/charts";
import { FloorPlan } from "@/components/floorplan/FloorPlan";
import { useProjects } from "@/components/providers/ProjectsProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { layouts, currentLayout, communityCentrePlot, costWeights, spaceDistribution, optimizationJobs } from "@/lib/mock";
import type { OptimizationJob } from "@/lib/types";
import { cn, formatEta } from "@/lib/utils";

type Algorithm = "constraint" | "annealing" | "genetic";

const stages = ["Requirements", "Graph model", "Candidate generation", "Constraint checking", "Optimization", "Evaluation"];
const RUN_MS = 6000;
const TICK_MS = 100;

export function OptimizationPage() {
  const { projects } = useProjects();
  const { toast } = useToast();
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [goals, setGoals] = useState({ utilization: true, circulation: true, walking: false });
  const [weights, setWeights] = useState(() => Object.fromEntries(costWeights.map((w) => [w.key, w.weight])) as Record<string, number>);
  const [algorithm, setAlgorithm] = useState<Algorithm>("constraint");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasResults, setHasResults] = useState(true);
  const [jobs, setJobs] = useState<OptimizationJob[]>(optimizationJobs);
  const [cancelJob, setCancelJob] = useState<OptimizationJob | null>(null);
  const timerRef = useRef<number | null>(null);

  const stop = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // Clear the interval if the page unmounts mid-run.
  useEffect(() => stop, []);

  const run = () => {
    if (running) return;
    setRunning(true);
    setHasResults(false);
    setProgress(0);
    const startedAt = Date.now();
    timerRef.current = window.setInterval(() => {
      const next = Math.min(100, ((Date.now() - startedAt) / RUN_MS) * 100);
      setProgress(next);
      if (next >= 100) {
        stop();
        setRunning(false);
        setHasResults(true);
        toast({ kind: "success", title: "Optimization complete (simulated)", description: "4 candidate layouts evaluated. Results use sample data." });
      }
    }, TICK_MS);
  };

  const cancel = () => {
    stop();
    setRunning(false);
    setProgress(0);
    setHasResults(true);
    toast({ kind: "info", title: "Optimization cancelled" });
  };

  const stageIndex = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
  const projectName = projects.find((p) => p.id === projectId)?.name ?? "Project";

  const formula = costWeights.map((w, i) => `w${i + 1}(${w.key === "boundary" ? "boundary violations" : w.key === "adjacency" ? "bad adjacency" : w.key === "corridor" ? "excess corridor" : w.key === "circulation" ? "poor circulation" : w.key === "unused" ? "unused area" : w.key})`).join(" + ");

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Optimization"
        description="Improve space use, circulation and overall layout performance."
        actions={
          <>
            <SelectMenu
              ariaLabel="Select project"
              value={projectId}
              onChange={setProjectId}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              className="w-[220px]"
            />
            {running ? (
              <Button variant="danger" leftIcon={<Square className="h-4 w-4" />} onClick={cancel}>
                Cancel
              </Button>
            ) : (
              <Button leftIcon={<Play className="h-4 w-4" />} onClick={run}>
                Run Optimization
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]">
        {/* Goals */}
        <Card className="flex flex-col gap-4">
          <CardHeader title="Optimization Goals" className="mb-0" />
          <div className="flex flex-col gap-2">
            <Checkbox checked={goals.utilization} onChange={(v) => setGoals((g) => ({ ...g, utilization: v }))} label="Maximize Space Utilization" />
            <Checkbox checked={goals.circulation} onChange={(v) => setGoals((g) => ({ ...g, circulation: v }))} label="Improve Circulation" />
            <Checkbox checked={goals.walking} onChange={(v) => setGoals((g) => ({ ...g, walking: v }))} label="Minimize Walking Distance" />
          </div>

          <div className="border-t border-line pt-4">
            <p className="text-xs font-semibold text-ink">Cost weights</p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap border border-line bg-bg p-2 font-mono text-[11px] leading-4 text-ink rounded-xs">
              Cost = {formula}
            </pre>
            <ul className="mt-3 m-0 flex list-none flex-col gap-2 p-0">
              {costWeights.map((w, i) => (
                <li key={w.key}>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor={`weight-${w.key}`} className="text-ink">
                      <span className="font-mono text-muted">w{i + 1}</span> {w.label}
                    </label>
                    <span className="font-semibold text-primary">{weights[w.key]}</span>
                  </div>
                  <input
                    id={`weight-${w.key}`}
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={weights[w.key]}
                    onChange={(e) => setWeights((x) => ({ ...x, [w.key]: Number(e.target.value) }))}
                    className="mt-1 h-1 w-full cursor-pointer accent-primary"
                    title={w.description}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-line pt-4">
            <p className="mb-2 text-xs font-semibold text-ink">Algorithm</p>
            <RadioGroup<Algorithm>
              name="algorithm"
              value={algorithm}
              onChange={setAlgorithm}
              options={[
                { value: "constraint", label: "Constraint-based generation", description: "MVP — available" },
                { value: "annealing", label: "Simulated annealing", description: "Planned (Phase B) — not yet implemented" },
                { value: "genetic", label: "Genetic algorithm", description: "Planned (Phase C) — not yet implemented" },
              ]}
            />
            {algorithm !== "constraint" ? (
              <p className="mt-2 border border-warning/40 bg-warning-bg px-2 py-1.5 text-[11px] text-warning rounded-xs">
                This algorithm is not implemented in the current engine build. Runs fall back to constraint-based generation.
              </p>
            ) : null}
          </div>
        </Card>

        {/* Results */}
        <div className="flex min-w-0 flex-col gap-5">
          {running ? (
            <Card aria-live="polite" aria-busy>
              <CardHeader
                title={
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Optimizing {projectName}
                  </span>
                }
                subtitle="Simulated run — the FastAPI/C++ engine is not connected in this build."
                action={
                  <Button variant="outline" size="sm" onClick={cancel} leftIcon={<Square className="h-3.5 w-3.5" />}>
                    Cancel
                  </Button>
                }
              />
              <ProgressBar value={progress} label="Optimization progress" />
              <ol className="mt-4 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 lg:grid-cols-6">
                {stages.map((s, i) => {
                  const state = i < stageIndex ? "done" : i === stageIndex ? "active" : "todo";
                  return (
                    <li
                      key={s}
                      aria-current={state === "active" ? "step" : undefined}
                      className={cn(
                        "flex items-center gap-2 border px-2 py-1.5 text-[11px] font-medium rounded-xs",
                        state === "done" && "border-[#bbf7d0] bg-success-bg text-success",
                        state === "active" && "border-primary bg-highlight text-primary",
                        state === "todo" && "border-line bg-bg text-muted",
                      )}
                    >
                      {state === "done" ? <Check className="h-3.5 w-3.5" /> : <span className="font-mono">{i + 1}</span>}
                      {s}
                    </li>
                  );
                })}
              </ol>
            </Card>
          ) : null}

          {hasResults ? (
            <>
              <Card>
                <CardHeader title="Optimization Results" subtitle={`${projectName} · Layout A vs current layout`} />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { icon: Layers, value: "86%", label: "Area Efficiency", delta: <Delta value={5.2} /> },
                    { icon: Footprints, value: "1.26", label: "Circulation Ratio", delta: <Delta value={-18} invert /> },
                    { icon: LayoutGrid, value: "553 m²", label: "Usable Area", delta: <Delta value={32} suffix=" m²" /> },
                    { icon: Clock, value: "12 min", label: "Avg. Travel Time", delta: <Delta value={-24} invert /> },
                  ].map((t) => (
                    <div key={t.label} className="border border-line bg-surface p-3 rounded-sm">
                      <div className="flex items-start justify-between">
                        <t.icon className="h-5 w-5 text-primary" aria-hidden />
                        {t.delta}
                      </div>
                      <p className="mt-2 text-xl font-bold text-ink">{t.value}</p>
                      <p className="text-xs text-muted">{t.label}</p>
                    </div>
                  ))}
                </div>
                <SampleDataNote className="mt-3" />
              </Card>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_260px]">
                <Card className="flex flex-col">
                  <CardHeader title="Current Layout" />
                  <div className="flex-1 border border-line bg-bg p-2 rounded-sm">
                    <FloorPlan plot={communityCentrePlot} rooms={currentLayout.rooms} showLabels={false} showDimensions={false} ariaLabel="Current layout" />
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-3 border-t border-line pt-3 text-xs text-muted">
                    <span>Efficiency: <strong className="text-ink">{currentLayout.metrics.areaEfficiency}%</strong></span>
                    <span className="h-3 w-px bg-line" aria-hidden />
                    <span>Circulation Ratio: <strong className="text-ink">{currentLayout.metrics.circulationRatio}</strong></span>
                  </p>
                </Card>
                <div className="hidden items-center justify-center lg:flex" aria-hidden>
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <Card selected className="flex flex-col">
                  <CardHeader title="Optimized Layout" action={<Badge tone="success" size="sm">Recommended</Badge>} />
                  <div className="flex-1 border border-line bg-bg p-2 rounded-sm">
                    <FloorPlan plot={communityCentrePlot} rooms={layouts[0].rooms} showLabels={false} showDimensions={false} ariaLabel="Optimized layout" />
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-3 border-t border-line pt-3 text-xs text-muted">
                    <span>Efficiency: <strong className="text-ink">{layouts[0].metrics.areaEfficiency}%</strong></span>
                    <span className="h-3 w-px bg-line" aria-hidden />
                    <span>Circulation Ratio: <strong className="text-ink">{layouts[0].metrics.circulationRatio}</strong></span>
                  </p>
                </Card>
                <Card className="lg:col-span-3 xl:col-span-1">
                  <CardHeader title="Space Allocation" />
                  <DonutChart
                    data={spaceDistribution.map((s) => ({ key: s.key, label: s.label, value: s.value }))}
                    centerLabel="553 m²"
                    centerSub="Total Area"
                    size={130}
                    ariaLabel="Space allocation of the optimized layout"
                  />
                </Card>
              </div>

              <Card className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex items-center gap-2 md:w-[200px]">
                  <Target className="h-5 w-5 text-primary" aria-hidden />
                  <span className="text-sm font-semibold text-ink">Optimization Insights</span>
                </div>
                <ul className="m-0 grid flex-1 list-none gap-3 p-0 sm:grid-cols-3">
                  {[
                    { icon: TrendingUp, value: "+5.2%", label: "Higher area efficiency" },
                    { icon: Footprints, value: "−18%", label: "Shorter circulation" },
                    { icon: Layers, value: "+32 m²", label: "More usable space" },
                  ].map((i, idx) => (
                    <li key={i.label} className={cn("flex items-center gap-3", idx > 0 && "sm:border-l sm:border-line sm:pl-3")}>
                      <i.icon className="h-5 w-5 text-primary" aria-hidden />
                      <div>
                        <p className="text-base font-bold text-ink">{i.value}</p>
                        <p className="text-xs text-muted">{i.label}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          ) : !running ? (
            <EmptyState title="No results yet" description="Run an optimization to compare the current layout with generated candidates." action={<Button onClick={run}>Run Optimization</Button>} />
          ) : null}

          {/* Active jobs */}
          <Card>
            <CardHeader title={`Active Jobs (${jobs.filter((j) => j.status === "running").length})`} subtitle="Queued and running optimization jobs across projects." />
            {jobs.length === 0 ? (
              <EmptyState title="No active jobs" description="Jobs you start will appear here." />
            ) : (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {jobs.map((job) => (
                  <li key={job.id} className="flex flex-col gap-2 border border-line bg-bg p-3 rounded-sm sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-ink">
                          {job.projectName} <span className="text-muted">— {job.stage}</span>
                        </p>
                        <Badge tone={job.status === "running" ? "primary" : job.status === "completed" ? "success" : job.status === "failed" ? "danger" : "neutral"} size="sm">
                          {job.status}
                        </Badge>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3">
                        <ProgressBar value={job.progress} className="flex-1" label={`${job.projectName} progress`} tone={job.status === "completed" ? "success" : "primary"} />
                        <span className="w-20 shrink-0 text-right text-xs text-muted">{job.status === "running" ? `${formatEta(job.etaSeconds)} left` : `${job.progress}%`}</span>
                      </div>
                    </div>
                    {job.status === "running" ? (
                      <Button variant="outline" size="sm" leftIcon={<XCircle className="h-3.5 w-3.5" />} onClick={() => setCancelJob(job)}>
                        Cancel
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={cancelJob !== null}
        onClose={() => setCancelJob(null)}
        title="Cancel optimization job?"
        destructive
        confirmLabel="Cancel job"
        message={
          <>
            The job for <strong className="text-ink">{cancelJob?.projectName}</strong> will stop at {cancelJob?.progress}% and partial candidates will be discarded.
          </>
        }
        onConfirm={() => {
          if (cancelJob) {
            setJobs((list) => list.map((j) => (j.id === cancelJob.id ? { ...j, status: "failed", stage: "Cancelled" } : j)));
            toast({ kind: "info", title: "Job cancelled", description: cancelJob.projectName });
          }
          setCancelJob(null);
        }}
      />
    </div>
  );
}
