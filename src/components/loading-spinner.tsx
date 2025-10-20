import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.8-2.8" />
      <path d="M20 12h4" />
      <path d="m16.2 16.2 2.8 2.8" />
      <path d="M12 20v4" />
      <path d="m7.8 16.2-2.8 2.8" />
      <path d="M4 12H0" />
      <path d="m7.8 7.8-2.8-2.8" />
    </svg>
  );
}
