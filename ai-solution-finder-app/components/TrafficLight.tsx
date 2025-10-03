// components/TrafficLight.tsx
import clsx from "clsx";

type GdprStatus = "green" | "yellow" | "red";
type AiActStatus = "ok" | "warning" | "violation";
type Status = GdprStatus | AiActStatus;

const COLOR: Record<Status, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-400",
  red: "bg-red-500",
  ok: "bg-emerald-500",
  warning: "bg-amber-400",
  violation: "bg-red-500",
};

const LABEL: Record<Status, string> = {
  green: "Green",
  yellow: "Yellow",
  red: "Red",
  ok: "OK",
  warning: "Warning",
  violation: "Violation",
};

export default function TrafficLight({
  status,
  label,
  size = 12,
}: {
  status: Status;
  label?: string;
  size?: number; // dot size in px
}) {
  const color = COLOR[status] ?? "bg-gray-300";
  const dim = `${size}px`;

  return (
    <div className="flex items-center gap-2">
      <span
        className={clsx(
          "inline-block rounded-full ring-2 ring-black/10",
          color
        )}
        style={{ width: dim, height: dim }}
        aria-label={label ?? LABEL[status]}
      />
      <span className="text-sm font-medium">
        {label ?? LABEL[status]}
      </span>
    </div>
  );
}
