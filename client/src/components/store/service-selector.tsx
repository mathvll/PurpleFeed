import { Heart, Play, Users } from "lucide-react";
import type { CategoryId } from "@/lib/smm-catalog";
import { cn } from "@/lib/utils";

const services = [
  { id: "likes" as const, label: "Curtidas", Icon: Heart },
  { id: "followers" as const, label: "Seguidores", Icon: Users },
  { id: "reels" as const, label: "Views", Icon: Play },
];

type ServiceSelectorProps = {
  value: CategoryId;
  onChange: (service: CategoryId) => void;
};

export default function ServiceSelector({ value, onChange }: ServiceSelectorProps) {
  return (
    <section aria-labelledby="service-selector-title">
      <p id="service-selector-title" className="store-eyebrow">O que você precisa?</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {services.map(({ id, label, Icon }) => {
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={cn("store-service-tab", selected && "store-service-tab--selected")}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
