import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { SiTiktok, SiInstagram } from "react-icons/si";

interface CategoryFilterProps {
  selected: "all" | "tiktok" | "instagram";
  onSelect: (category: "all" | "tiktok" | "instagram") => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const categories = [
    { 
      id: "all" as const, 
      label: "Todos", 
      icon: <TrendingUp className="w-4 h-4" />,
      color: "from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))]"
    },
    { 
      id: "tiktok" as const, 
      label: "TikTok", 
      icon: <SiTiktok className="w-4 h-4" />,
      color: "from-[#FF0050] to-[#00F2EA]"
    },
    { 
      id: "instagram" as const, 
      label: "Instagram", 
      icon: <SiInstagram className="w-4 h-4" />,
      color: "from-[#833AB4] via-[#FD1D1D] to-[#F77737]"
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selected === category.id ? "default" : "outline"}
          className={`gap-2 ${
            selected === category.id 
              ? `bg-gradient-to-r ${category.color} text-white border-0` 
              : ''
          }`}
          onClick={() => onSelect(category.id)}
          data-testid={`button-filter-${category.id}`}
        >
          {category.icon}
          {category.label}
        </Button>
      ))}
    </div>
  );
}
