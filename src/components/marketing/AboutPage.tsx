import { CheckCircle2, XCircle, Target, Ruler, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Table, Th, Td, Tr } from "@/components/ui/Table";
import { Section, SectionHeading } from "./Section";

const principles = [
  {
    icon: Target,
    title: "Purpose",
    text: "Make architectural space planning more systematic: turn a brief into structured requirements, search for feasible layouts and show the trade-offs between them.",
  },
  {
    icon: Code2,
    title: "Engineering approach",
    text: "A deterministic C++20 engine for geometry, graphs, constraints and optimization; FastAPI for orchestration; Next.js + TypeScript for an interactive, testable frontend.",
  },
  {
    icon: Ruler,
    title: "Scope discipline",
    text: "Rectangular rooms on a rectangular plot, explicit adjacency weights and measurable circulation — not a CAD or BIM platform.",
  },
];

const mvp = [
  "Rectangular rooms and a rectangular plot",
  "Adjacency preferences as a weighted graph",
  "Overlap and plot-boundary constraints",
  "Circulation graph with shortest-path analysis",
  "One optimization algorithm",
  "3–5 candidate layouts with metrics",
];

const advanced = [
  "Parallel candidate evaluation",
  "Redis-backed asynchronous jobs",
  "PostgreSQL persistence",
  "Optional LLM requirement parser",
  "Accessibility and daylight modules",
  "Benchmarking and performance documentation",
];

const roadmap = [
  { week: "1", milestone: "Define room, plot, constraint and layout data structures; build geometry primitives." },
  { week: "2", milestone: "Implement rectangle intersection, boundary validation and candidate generation." },
  { week: "3", milestone: "Add adjacency graph and shortest-path circulation analysis." },
  { week: "4", milestone: "Implement scoring / cost function and a basic optimizer." },
  { week: "5", milestone: "Build FastAPI interface to the C++ engine." },
  { week: "6", milestone: "Create Next.js editor and SVG floor-plan renderer." },
  { week: "7", milestone: "Generate and compare multiple layouts; add database persistence." },
  { week: "8", milestone: "Parallelize candidate evaluation, benchmark performance and document results." },
  { week: "9+", milestone: "Optional LLM parser, accessibility module, daylight scoring and advanced optimization." },
];

const does = [
  "Every page, dialog, filter, tab and form in this interface",
  "Client-side validation and immediate constraint feedback in the editor",
  "SVG floor-plan rendering, comparison views and version diffs",
  "Realistic sample data, clearly labelled as illustrative",
];

const doesNot = [
  "Run the C++ optimization engine or the FastAPI backend",
  "Authenticate against a real identity service",
  "Persist projects beyond the current browser session",
  "Measure the example metrics shown (they come from the proposal)",
];

export function AboutPage() {
  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="About"
          title="Architecture is the domain. Algorithms and software engineering are the product."
          description="ArchOpt is a software-focused project: roughly 70% software engineering and algorithms, 30% architecture. The architectural component is deliberately narrow so the computational one can be deep."
        />
        <ul className="grid list-none gap-4 p-0 md:grid-cols-3">
          {principles.map((p) => (
            <li key={p.title} className="border border-line bg-surface p-5 shadow-card rounded-md">
              <span className="inline-flex h-10 w-10 items-center justify-center border border-line bg-highlight text-primary rounded-sm">
                <p.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-base font-semibold text-ink">{p.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface">
        <h2 className="text-xl font-bold tracking-tight text-ink">Scope</h2>
        <p className="mb-5 mt-1 text-sm text-muted">The MVP is intentionally small; the advanced scope follows once the core engine is benchmarked.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-line bg-bg p-5 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-ink">Recommended MVP</h3>
              <Badge tone="success" size="sm">
                Current focus
              </Badge>
            </div>
            <ul className="mt-3 flex list-none flex-col gap-2 p-0">
              {mvp.map((m) => (
                <li key={m} className="flex items-start gap-2 text-sm text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 font-mono text-xs text-muted">
              C++ geometry + graph + optimizer → FastAPI → Next.js/SVG → 3–5 candidates → metrics
            </p>
          </div>
          <div className="border border-dashed border-line-strong bg-bg p-5 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-ink">Advanced</h3>
              <Badge tone="warning" size="sm">
                Planned
              </Badge>
            </div>
            <ul className="mt-3 flex list-none flex-col gap-2 p-0">
              {advanced.map((m) => (
                <li key={m} className="flex items-start gap-2 text-sm text-ink">
                  <span className="mt-1.5 h-2 w-2 shrink-0 border border-warning bg-warning-bg" aria-hidden />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">Development roadmap</h2>
            <p className="mb-4 mt-1 text-sm text-muted">Milestones in build order, engine first.</p>
            <Table>
              <thead>
                <tr>
                  <Th className="w-16">Week</Th>
                  <Th>Milestone</Th>
                </tr>
              </thead>
              <tbody>
                {roadmap.map((r) => (
                  <Tr key={r.week}>
                    <Td className="font-mono font-semibold text-primary">{r.week}</Td>
                    <Td className="whitespace-normal">{r.milestone}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="h-fit border border-line bg-surface p-5 shadow-card rounded-md">
            <h2 className="text-base font-semibold text-ink">What this frontend does — and does not — do</h2>
            <p className="mt-1 text-xs text-muted">An honest summary of the current build.</p>
            <ul className="mt-4 flex list-none flex-col gap-2 p-0">
              {does.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
            <hr className="my-4 border-line" />
            <ul className="flex list-none flex-col gap-2 p-0">
              {doesNot.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-muted">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
