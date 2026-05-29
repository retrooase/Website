import type { AnkaufStatus } from "@/types";
import { clsx } from "clsx";

const STATUS_STYLES: Record<AnkaufStatus, string> = {
  Eingegangen: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "In Bewertung": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Angebot gesendet": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Angenommen: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Abgelehnt: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const STATUS_DOT: Record<AnkaufStatus, string> = {
  Eingegangen: "bg-yellow-500",
  "In Bewertung": "bg-orange-500",
  "Angebot gesendet": "bg-blue-500",
  Angenommen: "bg-green-500",
  Abgelehnt: "bg-red-500",
};

type Props = {
  status: AnkaufStatus;
  size?: "sm" | "md";
};

export function StatusBadge({ status, size = "md" }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-sans font-medium rounded-sm",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1",
        STATUS_STYLES[status]
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", STATUS_DOT[status])} />
      {status}
    </span>
  );
}
