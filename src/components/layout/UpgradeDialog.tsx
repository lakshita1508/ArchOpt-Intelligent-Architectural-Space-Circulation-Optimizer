"use client";

import { Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["3 projects", "Constraint-based generation", "4 candidate layouts per run", "SVG floor-plan export"],
    current: true,
  },
  {
    name: "Pro",
    price: "₹1,499",
    period: "per user / month",
    features: ["Unlimited projects", "Simulated annealing search", "Team collaboration & versions", "Priority optimization queue", "Cloud sync"],
    highlighted: true,
  },
];

/** Plan comparison dialog opened from the sidebar "Upgrade" card. */
export function UpgradeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  return (
    <Modal open={open} onClose={onClose} title="Upgrade to Pro" description="Plans shown for demonstration — billing is not connected." size="lg">
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((p) => (
          <div key={p.name} className={`flex flex-col border p-4 rounded-md ${p.highlighted ? "border-primary bg-highlight/40" : "border-line bg-surface"}`}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-semibold text-ink">{p.name}</h3>
              {p.current ? <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Current plan</span> : null}
            </div>
            <p className="mt-2 text-2xl font-bold text-ink">
              {p.price} <span className="text-xs font-normal text-muted">{p.period}</span>
            </p>
            <ul className="mt-3 flex flex-1 list-none flex-col gap-1.5 p-0">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full"
              variant={p.highlighted ? "primary" : "outline"}
              disabled={p.current}
              onClick={() => {
                toast({ kind: "info", title: "Checkout not connected", description: "This is a frontend demo; no payment provider is configured." });
                onClose();
              }}
            >
              {p.current ? "Your plan" : "Choose Pro"}
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
