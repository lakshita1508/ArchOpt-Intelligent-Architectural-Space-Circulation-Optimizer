"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Project, ProjectStatus } from "@/lib/types";
import { projects as seedProjects } from "@/lib/mock";
import { uid } from "@/lib/utils";

/**
 * Client-side project store seeded from mock data. Pages read and mutate
 * projects through this context so that creating a project on the
 * Projects page is reflected on the Dashboard, Optimization and other
 * pages within the session. Replace with API-backed data when available.
 */

export interface NewProjectInput {
  name: string;
  type: Project["type"];
  plotWidth: number;
  plotHeight: number;
  spaces: number;
  description?: string;
}

interface ProjectsContextValue {
  projects: Project[];
  createProject: (input: NewProjectInput) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  setStatus: (id: string, status: ProjectStatus) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects);

  const createProject = useCallback((input: NewProjectInput): Project => {
    const now = new Date().toISOString();
    const project: Project = {
      id: uid("prj"),
      name: input.name.trim(),
      type: input.type,
      status: "draft",
      plot: { width: input.plotWidth, height: input.plotHeight },
      spaces: input.spaces,
      updatedAt: now,
      createdAt: now,
      owner: "Lakshita Singh",
      description: input.description?.trim() || undefined,
      layoutIds: [],
      progress: 0,
    };
    setProjects((list) => [project, ...list]);
    return project;
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((list) =>
      list.map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
      ),
    );
  }, []);

  const setStatus = useCallback(
    (id: string, status: ProjectStatus) => updateProject(id, { status }),
    [updateProject],
  );

  const deleteProject = useCallback((id: string) => {
    setProjects((list) => list.filter((p) => p.id !== id));
  }, []);

  const duplicateProject = useCallback(
    (id: string) => {
      let copy: Project | undefined;
      setProjects((list) => {
        const src = list.find((p) => p.id === id);
        if (!src) return list;
        const now = new Date().toISOString();
        copy = {
          ...src,
          id: uid("prj"),
          name: `${src.name} (copy)`,
          status: "draft",
          createdAt: now,
          updatedAt: now,
          progress: 0,
        };
        return [copy, ...list];
      });
      return copy;
    },
    [],
  );

  const value = useMemo(
    () => ({ projects, createProject, updateProject, setStatus, deleteProject, duplicateProject }),
    [projects, createProject, updateProject, setStatus, deleteProject, duplicateProject],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used inside <ProjectsProvider>");
  return ctx;
}
