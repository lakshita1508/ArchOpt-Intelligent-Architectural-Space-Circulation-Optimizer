"use client";

import { Suspense, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { UpgradeDialog } from "./UpgradeDialog";

/** Fixed sidebar + sticky top bar; page content scrolls in <main>. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <Suspense fallback={<aside className="hidden w-[232px] border-r border-line bg-surface lg:block" aria-hidden />}>
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onUpgrade={() => setUpgradeOpen(true)} />
      </Suspense>
      <div className="flex min-h-screen flex-col lg:pl-[232px]">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main id="main" className="flex-1 px-4 py-5 lg:px-6 lg:py-6">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
      <UpgradeDialog open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, actions, children }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-ink md:text-[28px] md:leading-9">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        {children}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div> : null}
    </div>
  );
}
