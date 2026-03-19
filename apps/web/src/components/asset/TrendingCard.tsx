import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";
import type { Asset } from "@/types";
import { countdown } from "@/lib/utils";

interface TrendingCardProps {
  asset: Asset;
  rank: number;
}

export default function TrendingCard({ asset, rank }: TrendingCardProps) {
  const raisedPercent = (asset.raisedAmount / asset.raiseTarget) * 100;

  return (
    <Link href={`/asset/${asset.id}`} className="block min-w-[200px]">
      <div className="bg-card border border-border rounded-card overflow-hidden card-hover group">
        {/* Image with rank watermark */}
        <div className="relative h-[70px] overflow-hidden">
          <Image
            src={asset.image}
            alt={asset.name}
            fill
            className="object-cover group-hover:scale-[1.06] transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-70" />
          <span className="absolute bottom-1.5 right-2 text-4xl font-black font-syne text-white/10 leading-none select-none">
            {rank}
          </span>
        </div>

        <div className="p-3 space-y-1.5">
          <div className="flex items-center gap-1 text-[10px] text-muted">
            <MapPin size={9} className="shrink-0" />
            <span>{asset.location}</span>
          </div>
          <p className="text-xs font-bold text-white font-syne line-clamp-1">{asset.name}</p>
          <span className="text-lg font-bold text-accent2 font-mono">
            {asset.annualYieldPercent.toFixed(1)}%
          </span>
          <ProgressBar value={raisedPercent} height={4} />
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span className="font-mono">{raisedPercent.toFixed(0)}% raised</span>
            <span className="text-gold font-mono">{countdown(new Date(asset.closeDate))}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
