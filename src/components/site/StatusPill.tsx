import { STATUSES } from "@/lib/format";
import { cn } from "@/lib/utils";

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const tone =
    status === "available"
      ? "border-success/40 text-success"
      : status === "reserved"
        ? "border-warning/40 text-warning"
        : "border-border text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border bg-background/70 px-3 py-1 text-xs backdrop-blur",
        tone,
        className,
      )}
    >
      {STATUSES[status] ?? status}
    </span>
  );
}
