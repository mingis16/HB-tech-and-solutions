import {
  Briefcase,
  Building2,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Hotel,
  Landmark,
  Pickaxe,
  Plus,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import type { Industry } from "@/lib/constants";
import { SectionHeading } from "./SectionHeading";

const SECTORS: { name: Exclude<Industry, "Other">; icon: LucideIcon }[] = [
  { name: "Banking / Finance", icon: Landmark },
  { name: "Hospital / Healthcare", icon: HeartPulse },
  { name: "Government", icon: Building2 },
  { name: "Mining / Resources", icon: Pickaxe },
  { name: "NGO / Development", icon: HandHeart },
  { name: "School / Education", icon: GraduationCap },
  { name: "Hotel / Tourism", icon: Hotel },
  { name: "Professional Services", icon: Briefcase },
  { name: "Restaurant / Salon", icon: UtensilsCrossed },
  { name: "Agriculture", icon: Wheat },
];

export function Sectors() {
  return (
    <section id="sectors" className="scroll-mt-20 border-t border-edge/60 py-20 sm:py-24">
      <div className="container">
        <SectionHeading
          index="02"
          label="sectors"
          title="Built for the organisations that keep things running."
          description="Regulated, high-stakes and fast-moving sectors each get solutions shaped around their compliance needs, customers and budgets."
        />

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {SECTORS.map(({ name, icon: Icon }) => (
            <li
              key={name}
              className="group flex items-center gap-3 rounded-xl border border-edge bg-surface/50 px-4 py-3.5 transition hover:border-cyber/40 hover:bg-surface"
            >
              <Icon className="size-5 shrink-0 text-fg-subtle transition group-hover:text-cyber" aria-hidden="true" />
              <span className="text-sm font-medium leading-tight text-fg-muted transition group-hover:text-fg">
                {name}
              </span>
            </li>
          ))}
          <li>
            <a
              href="#inquiry"
              className="flex h-full items-center gap-3 rounded-xl border border-dashed border-edge-strong px-4 py-3.5 text-sm font-medium text-fg-muted transition hover:border-cyber/50 hover:text-cyber"
            >
              <Plus className="size-5 shrink-0" aria-hidden="true" />
              Your sector
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
