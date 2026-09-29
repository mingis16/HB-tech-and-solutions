import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRIMARY_CTA } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PrimaryCtaProps = {
  /** Where on the site the button sits; sent to analytics. */
  location: string;
  className?: string;
  onClick?: () => void;
};

/** The one primary call to action. Same label and destination everywhere. */
export function PrimaryCta({ location, className, onClick }: PrimaryCtaProps) {
  return (
    <Link
      href={PRIMARY_CTA.href}
      onClick={onClick}
      data-track="cta_click"
      data-track-location={location}
      className={cn("btn-primary", className)}
    >
      {PRIMARY_CTA.label}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}
