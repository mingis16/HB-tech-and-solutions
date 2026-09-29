import { cn } from "@/lib/utils";

export function Logo({ className, showCommand = true }: { className?: string; showCommand?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className="grid size-8 place-items-center rounded-lg border border-cyber/40 bg-cyber/10 font-mono text-sm font-bold text-cyber"
        aria-hidden="true"
      >
        &gt;_
      </span>
      <span className="font-semibold tracking-tight text-fg">
        HB Tech Solutions
        {showCommand && (
          <span className="ml-1.5 hidden font-mono text-xs font-normal text-fg-subtle lg:inline">/ initialize</span>
        )}
      </span>
    </span>
  );
}
