import { ArrowRight, Cpu, Server, MonitorSmartphone, Database, PenTool, Workflow, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Table, Th, Td, Tr } from "@/components/ui/Table";
import { Section, SectionHeading, CodeBlock } from "./Section";
import { ArchitectureStrip } from "./Pipeline";

const responsibilities = [
  { layer: "Core engine", tech: "C++20", purpose: "Geometry, graphs, constraints, optimization, parallel evaluation", icon: Cpu, status: "mvp" },
  { layer: "Backend", tech: "FastAPI", purpose: "API, validation and job orchestration", icon: Server, status: "mvp" },
  { layer: "Frontend", tech: "Next.js + TypeScript", purpose: "Interactive editor and floor-plan visualization", icon: MonitorSmartphone, status: "mvp" },
  { layer: "Visualization", tech: "SVG / Canvas", purpose: "Draw rooms, walls, circulation and candidates", icon: PenTool, status: "mvp" },
  { layer: "Database", tech: "PostgreSQL", purpose: "Projects, requirements, layouts and metrics", icon: Database, status: "mvp" },
  { layer: "Queue / cache", tech: "Redis", purpose: "Optional asynchronous optimization jobs and caching", icon: Workflow, status: "optional" },
] as const;

const engineModules = [
  { name: "Computational geometry", text: "Rectangle intersection, boundary checks, distances and geometric validity checks." },
  { name: "Graph algorithms", text: "Weighted room graph; A* or Dijkstra for circulation paths and walking distance." },
  { name: "Constraint checking", text: "Overlap, plot-boundary and minimum-dimension validation of every candidate." },
  { name: "Optimization", text: "Weighted cost function with configurable weights; constraint-based search in the MVP." },
  { name: "Parallel evaluation", text: "Concurrent candidate evaluation with C++ threads.", planned: true },
];

const roomStruct = `struct Room {
  std::string name;
  double requiredArea;
  double minWidth, minHeight;
  double x, y, width, height;
  // relationships are edges in the adjacency graph
};`;

const aiChain = ["Natural language brief", "LLM / parser", "JSON requirements", "C++ optimizer", "Candidate layouts"];

export function TechnologyPage() {
  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Technology"
          title="A deterministic C++20 engine behind a typed web stack"
          description="The optimization engine is kept independent from the UI so it can be tested, benchmarked and explained separately."
        />
        <div className="border border-line bg-surface p-4 shadow-card rounded-md lg:p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">System architecture</p>
          <ArchitectureStrip />
          <p className="mt-4 text-xs text-muted">
            Requests flow left to right: the frontend posts structured requirements over REST, FastAPI validates them and runs
            the C++ engine, and results are persisted in PostgreSQL. Redis is an optional queue for asynchronous jobs.
          </p>
        </div>
      </Section>

      <Section tone="surface">
        <h2 className="text-xl font-bold tracking-tight text-ink">Responsibilities by layer</h2>
        <p className="mb-4 mt-1 text-sm text-muted">The recommended stack from the project proposal.</p>
        <Table>
          <thead>
            <tr>
              <Th>Layer</Th>
              <Th>Technology</Th>
              <Th>Purpose</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {responsibilities.map((r) => (
              <Tr key={r.layer}>
                <Td className="font-medium">
                  <span className="inline-flex items-center gap-2">
                    <r.icon className="h-4 w-4 text-primary" aria-hidden />
                    {r.layer}
                  </span>
                </Td>
                <Td>{r.tech}</Td>
                <Td className="whitespace-normal text-muted">{r.purpose}</Td>
                <Td>
                  {r.status === "mvp" ? (
                    <Badge tone="success" size="sm">
                      <CheckCircle2 className="h-3 w-3" /> Core
                    </Badge>
                  ) : (
                    <Badge tone="warning" size="sm">
                      <Clock className="h-3 w-3" /> Optional
                    </Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">C++ core: where the technical depth lives</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              The engine owns the data structures, algorithms and performance work. Each module has a single, testable purpose.
            </p>
            <ul className="mt-4 flex list-none flex-col gap-2 p-0">
              {engineModules.map((m) => (
                <li key={m.name} className="flex items-start justify-between gap-3 border border-line bg-surface p-3 rounded-md">
                  <div>
                    <p className="text-sm font-semibold text-ink">{m.name}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted">{m.text}</p>
                  </div>
                  {"planned" in m && m.planned ? (
                    <Badge tone="warning" size="sm">
                      Planned
                    </Badge>
                  ) : (
                    <Badge tone="success" size="sm">
                      MVP
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">Data model</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Each room stores its name, required area, minimum dimensions, position and size. Relationships live in the weighted
              adjacency graph rather than on the room itself.
            </p>
            <CodeBlock className="mt-4" title="engine/room.hpp" code={roomStruct} />
            <div className="mt-4 border border-line bg-surface p-4 rounded-md">
              <p className="text-sm font-semibold text-ink">Visualization</p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Floor plans are rendered as SVG in the browser: rooms are rectangles in metres scaled through a viewBox, so the
                same component serves thumbnails, the editor canvas and version diffs without a drawing library.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <div className="border border-dashed border-line-strong bg-bg p-5 rounded-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
              Optional AI layer
            </h2>
            <Badge tone="warning" size="sm">
              <Clock className="h-3 w-3" /> Optional / planned
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            An LLM is used only as a requirement parser: a natural-language brief is converted into structured JSON that the
            deterministic C++ optimizer consumes. The core engineering stays deterministic and owned by the project.
          </p>
          <ol className="mt-4 flex list-none flex-col gap-1 p-0 sm:flex-row sm:items-center sm:gap-0">
            {aiChain.map((step, i) => (
              <li key={step} className="flex items-center sm:flex-1">
                <span className="w-full border border-line bg-surface px-3 py-2 text-center text-xs font-semibold text-ink rounded-sm">
                  {step}
                </span>
                {i < aiChain.length - 1 ? (
                  <ArrowRight className="mx-1 hidden h-4 w-4 shrink-0 text-line-strong sm:block" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}
