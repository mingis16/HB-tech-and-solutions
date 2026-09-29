export function TerminalDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <span className="size-2.5 rounded-full bg-severity-critical/80" />
      <span className="size-2.5 rounded-full bg-severity-medium/80" />
      <span className="size-2.5 rounded-full bg-cyber/80" />
    </div>
  );
}
