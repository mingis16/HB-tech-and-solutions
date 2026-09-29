import { whatsappLink } from "@/lib/constants";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with HB Tech Solutions on WhatsApp"
      className="group fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-40 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-6px_rgb(37_211_102/0.55)] transition hover:scale-105 active:scale-95"
    >
      <span aria-hidden="true" className="absolute inset-0 animate-ping-slow rounded-full bg-[#25D366]/50" />
      <WhatsAppIcon className="relative size-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border border-edge bg-surface px-3 py-1.5 text-xs font-medium text-fg opacity-0 shadow-panel transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
