import { Building2, Home, Zap, Factory, TrendingUp, Wheat, Rocket } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  "real-estate-commercial": Building2,
  "real-estate-residential": Home,
  "infrastructure-energy": Zap,
  "infrastructure-logistics": Factory,
  "business-yield": TrendingUp,
  "commodities": Wheat,
  "pre-revenue": Rocket,
};

export default function CategoryIcon({ category, size = 12, className }: { category: string; size?: number; className?: string }) {
  const Icon = ICON_MAP[category];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
