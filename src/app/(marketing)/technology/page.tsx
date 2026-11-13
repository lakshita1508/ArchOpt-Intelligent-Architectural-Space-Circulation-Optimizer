import type { Metadata } from "next";
import { TechnologyPage } from "@/components/marketing/TechnologyPage";

export const metadata: Metadata = {
  title: "Technology",
  description: "Next.js + TypeScript, FastAPI, a C++20 optimization engine and PostgreSQL / Redis.",
};

export default function Page() {
  return <TechnologyPage />;
}
