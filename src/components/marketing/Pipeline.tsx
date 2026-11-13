import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PipelineStage {
  id: string;
  index: number;
  title: string;
  summary: string;
  detail: string;
}

/** The seven-stage pipeline from the project proposal. */
export const pipelineStages: PipelineStage[] = [
  {
    id: "requirements",
    index: 1,
    title: "Requirements",
    summary: "Plot, spaces, areas, relationships and constraints.",
    detail:
      "The user enters the plot dimensions, the required spaces with target areas and minimum dimensions, the desired spatial relationships and design constraints such as corridor widths. This structured brief is the only input the engine needs.",
  },
  {
    id: "graph",
    index: 2,
    title: "Graph Model",
    summary: "Rooms become nodes; preferences become weighted edges.",
    detail:
      "Each room becomes a node in a weighted adjacency graph. Adjacency preferences such as “reception close to entrance” or “classrooms close to each other” become weighted edges, so the strength of each relationship is explicit and comparable.",
  },
  {
    id: "candidates",
    index: 3,
    title: "Candidate Generation",
    summary: "The C++ engine proposes room positions and dimensions.",
    detail:
      "The C++20 engine generates possible positions and dimensions for every room inside the plot. Rectangle primitives keep the geometry simple and fast so many candidates can be produced per run.",
  },
  {
    id: "constraints",
    index: 4,
    title: "Constraint Checking",
    summary: "Overlaps, boundary violations and invalid dimensions are rejected.",
    detail:
      "Every candidate is checked with rectangle-intersection and boundary tests. Rooms that overlap, cross the plot boundary or fall below their minimum width, depth or area are discarded or penalised before any scoring takes place.",
  },
  {
    id: "optimization",
    index: 5,
    title: "Optimization",
    summary: "Search for lower-cost layouts with a weighted cost function.",
    detail:
      "Feasible layouts are scored with a weighted cost function and the search looks for lower-cost arrangements. The MVP uses constraint-based generation with one optimizer; simulated annealing and a genetic algorithm are the planned next phases.",
  },
  {
    id: "evaluation",
    index: 6,
    title: "Evaluation",
    summary: "Circulation, adjacency, efficiency and accessibility metrics.",
    detail:
      "Shortest-path analysis on the circulation graph (A* or Dijkstra) measures walking distance between the entrance and important rooms. Adjacency satisfaction, usable-area efficiency and basic accessibility checks complete the metric set.",
  },
  {
    id: "visualization",
    index: 7,
    title: "Visualization",
    summary: "Several candidate layouts are presented for comparison.",
    detail:
      "The Next.js frontend renders candidates as SVG floor plans with their metrics side by side, so the designer inspects trade-offs between alternatives rather than receiving a single supposedly correct answer.",
  },
];

/** Compact horizontal stepper used on the landing page. */
export function PipelineStrip({ className }: { className?: string }) {
  return (
    <ol className={cn("grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-7", className)}>
      {pipelineStages.map((s) => (
        <li key={s.id} className="relative flex items-start gap-3 border border-line bg-surface p-3 rounded-md lg:flex-col lg:gap-2">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center border border-primary bg-highlight font-mono text-xs font-semibold text-primary rounded-xs">
            {s.index}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{s.title}</p>
            <p className="mt-0.5 text-xs leading-4 text-muted">{s.summary}</p>
          </div>
          {s.index < 7 ? (
            <ArrowRight className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 bg-bg text-line-strong lg:block" aria-hidden />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export interface StackLayer {
  id: string;
  name: string;
  tech: string;
  purpose: string;
  optional?: boolean;
}

export const stackLayers: StackLayer[] = [
  { id: "frontend", name: "Frontend", tech: "Next.js + TypeScript", purpose: "Interactive editor and floor-plan visualization (SVG / Canvas)." },
  { id: "api", name: "REST API", tech: "HTTP / JSON", purpose: "Contract between the UI and the backend: requirements in, layouts and metrics out." },
  { id: "backend", name: "Backend", tech: "FastAPI", purpose: "API endpoints, request validation and job orchestration." },
  { id: "engine", name: "Core engine", tech: "C++20", purpose: "Geometry, graph algorithms, constraint checking, optimization and parallel evaluation." },
  { id: "storage", name: "Storage", tech: "PostgreSQL / Redis", purpose: "Projects, requirements, layouts and metrics; Redis as an optional job queue and cache.", optional: true },
];

/** Boxes-and-arrows architecture strip (vertical on mobile, horizontal on desktop). */
export function ArchitectureStrip({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <ol className={cn("flex list-none flex-col gap-0 p-0 lg:flex-row lg:items-stretch", className)}>
      {stackLayers.map((l, i) => (
        <li key={l.id} className="flex flex-col items-center lg:flex-1 lg:flex-row">
          <div
            className={cn(
              "w-full border bg-surface p-3 rounded-md lg:flex-1",
              l.id === "engine" ? "border-primary" : "border-line",
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{l.name}</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">{l.tech}</p>
            {!compact ? <p className="mt-1 text-xs leading-4 text-muted">{l.purpose}</p> : null}
          </div>
          {i < stackLayers.length - 1 ? (
            <span className="flex items-center justify-center py-1 text-line-strong lg:px-1 lg:py-0" aria-hidden>
              <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function LinkArrow({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
