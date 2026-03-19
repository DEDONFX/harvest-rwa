"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Search, Activity, TrendingUp, TrendingDown, ArrowUpRight, MapPin, RefreshCw,
  ChevronDown, Zap, AlertTriangle, CheckCircle2,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface OHLCPoint {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  category: string;
  country: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  raisedPct: number;
  ohlc: OHLCPoint[];
}

const TIMEFRAMES = ["1M", "5M", "15M", "1H", "4H", "1D"];
const SLIPPAGE_OPTIONS = ["0.1%", "0.5%", "1.0%"];

function generateOHLC(basePrice: number, count: number): OHLCPoint[] {
  const data: OHLCPoint[] = [];
  let price = basePrice;
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const vol = 0.006 + Math.random() * 0.014;
    const change = (Math.random() - 0.49) * vol;
    const open = price;
    const close = price * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.004);
    const low = Math.min(open, close) * (1 - Math.random() * 0.004);
    data.push({ time: now - (count - i) * 60000, open, close, high, low, volume: Math.floor(Math.random() * 80000 + 5000) });
    price = close;
  }
  return data;
}

function buildMarketAssets(): MarketAsset[] {
  return MOCK_ASSETS.map((a) => {
    const raisedPct = (a.raisedAmount / a.raiseTarget) * 100;
    const basePrice = 1 + (raisedPct / 100) * 0.18;
    const ohlc = generateOHLC(basePrice, 60);
    const last = ohlc[ohlc.length - 1];
    const first = ohlc[Math.max(0, ohlc.length - 24)];
    return {
      id: a.id, name: a.name, symbol: a.symbol, category: a.category, country: a.country,
      price: last.close,
      change24h: ((last.close - first.open) / first.open) * 100,
      volume24h: ohlc.slice(-24).reduce((s, c) => s + c.volume, 0),
      high24h: Math.max(...ohlc.slice(-24).map((c) => c.high)),
      low24h: Math.min(...ohlc.slice(-24).map((c) => c.low)),
      raisedPct, ohlc,
    };
  });
}

function CandlestickSVG({ data, width, height }: { data: OHLCPoint[]; width: number; height: number }) {
  if (!data.length || width < 10) return null;
  const chartH = Math.floor(height * 0.74);
  const volTop = Math.floor(height * 0.80);
  const volH = Math.floor(height * 0.18);
  const labelW = 52;
  const drawW = width - labelW;
  const prices = data.flatMap((d) => [d.high, d.low]);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const pad = (maxP - minP) * 0.06 || 0.001;
  const pRange = maxP - minP + pad * 2;
  const toY = (p: number) => chartH - ((p - (minP - pad)) / pRange) * chartH;
  const maxVol = Math.max(...data.map((d) => d.volume)) || 1;
  const spacing = drawW / data.length;
  const candleW = Math.max(2, spacing * 0.55);
  const gridPrices = Array.from({ length: 5 }, (_, i) => minP - pad + (pRange * i) / 4);
  const last = data[data.length - 1];
  const isLastUp = last.close >= last.open;
  return (
    <svg width={width} height={height}>
      {gridPrices.map((p, i) => (
        <g key={i}>
          <line x1={0} y1={toY(p)} x2={drawW} y2={toY(p)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
          <text x={drawW + 4} y={toY(p) + 3} fontSize={8} fill="rgba(255,255,255,0.25)" fontFamily="monospace">{p.toFixed(4)}</text>
        </g>
      ))}
      <line x1={0} y1={volTop - 4} x2={drawW} y2={volTop - 4} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      {data.map((d, i) => {
        const cx = i * spacing + spacing / 2;
        const openY = toY(d.open); const closeY = toY(d.close);
        const highY = toY(d.high); const lowY = toY(d.low);
        const up = d.close >= d.open;
        const clr = up ? "#00C896" : "#FF4757";
        const bodyY = Math.min(openY, closeY);
        const bodyH = Math.max(Math.abs(closeY - openY), 1);
        const vH = Math.max(1, (d.volume / maxVol) * volH);
        return (
          <g key={i}>
            <line x1={cx} y1={highY} x2={cx} y2={lowY} stroke={clr} strokeWidth={1} opacity={0.7} />
            <rect x={cx - candleW / 2} y={bodyY} width={candleW} height={bodyH} fill={up ? clr : "transparent"} stroke={clr} strokeWidth={1} />
            <rect x={i * spacing} y={volTop + volH - vH} width={Math.max(spacing - 1, 1)} height={vH} fill={up ? "rgba(0,200,150,0.25)" : "rgba(255,71,87,0.25)"} />
          </g>
        );
      })}
      <line x1={0} y1={toY(last.close)} x2={drawW} y2={toY(last.close)} stroke={isLastUp ? "#00C896" : "#FF4757"} strokeWidth={0.75} strokeDasharray="4 3" opacity={0.6} />
      <rect x={drawW} y={toY(last.close) - 7} width={labelW} height={13} fill={isLastUp ? "#00C896" : "#FF4757"} rx={2} />
      <text x={drawW + 4} y={toY(last.close) + 3} fontSize={8} fill="#000" fontFamily="monospace" fontWeight="bold">{last.close.toFixed(4)}</text>
    </svg>
  );
}

function OrderPanel({ asset }: { asset: MarketAsset }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5%");
  const [confirmed, setConfirmed] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const tokensOut = side === "buy" ? numAmount / asset.price : numAmount * asset.price;
  const priceImpact = numAmount > 0 ? Math.min((numAmount / 50000) * 100, 4.99) : 0;
  const fee = numAmount * 0.005;
  const isBig = priceImpact > 2;

  const handleConfirm = () => {
    if (!numAmount) return;
    setConfirmed(true);
    setTimeout(() => { setConfirmed(false); setAmount(""); }, 2500);
  };

  return (
    <div className="flex flex-col bg-surface h-full">
      {/* Buy / Sell tabs */}
      <div className="flex border-b border-border shrink-0">
        {(["buy", "sell"] as const).map((s) => (
          <button key={s} onClick={() => setSide(s)} className={cn(
            "flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-colors",
            side === s ? (s === "buy" ? "text-green border-b-2 border-green" : "text-red border-b-2 border-red") : "text-muted hover:text-offwhite"
          )}>{s}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-2.5">
        {/* You pay */}
        <div className="bg-card border border-border rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted">{side === "buy" ? "You pay" : "You sell"}</span>
            <span className="text-[10px] text-muted">Bal: <span className="text-offwhite font-mono">$2,450.00</span></span>
          </div>
          <div className="flex items-center gap-2">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
              className="flex-1 bg-transparent text-xl font-mono font-bold text-white outline-none placeholder:text-muted2 min-w-0" />
            <button className="flex items-center gap-1.5 bg-card2 border border-border rounded-lg px-2.5 py-1.5 shrink-0">
              <span className="text-xs font-bold text-offwhite font-mono">{side === "buy" ? "USDC" : asset.symbol}</span>
              <ChevronDown size={11} className="text-muted" />
            </button>
          </div>
          <div className="flex gap-1.5 pt-1">
            {["25%", "50%", "MAX"].map((p) => (
              <button key={p} onClick={() => {
                const bal = side === "buy" ? 2450 : 1200;
                const pct = p === "MAX" ? 1 : parseFloat(p) / 100;
                setAmount((bal * pct).toFixed(2));
              }} className="text-[9px] font-bold text-muted border border-border rounded px-1.5 py-0.5 hover:text-accent hover:border-accent transition-colors">{p}</button>
            ))}
          </div>
        </div>

        {/* Swap arrow */}
        <div className="flex justify-center">
          <div className="w-7 h-7 rounded-full bg-card2 border border-border flex items-center justify-center">
            <Zap size={12} className="text-accent" />
          </div>
        </div>

        {/* You receive */}
        <div className="bg-card border border-border rounded-xl p-3 space-y-1">
          <span className="text-[10px] text-muted">You receive</span>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-xl font-mono font-bold text-white">
              {numAmount > 0 ? tokensOut.toFixed(side === "buy" ? 2 : 4) : "0.00"}
            </span>
            <div className="flex items-center gap-1.5 bg-card2 border border-border rounded-lg px-2.5 py-1.5 shrink-0">
              <span className="text-xs font-bold text-offwhite font-mono">{side === "buy" ? asset.symbol : "USDC"}</span>
            </div>
          </div>
          {numAmount > 0 && <p className="text-[10px] text-muted font-mono">1 {asset.symbol} = ${asset.price.toFixed(4)} USDC</p>}
        </div>

        {/* Trade details */}
        {numAmount > 0 && (
          <div className="bg-card border border-border rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted">Price impact</span>
              <span className={cn("text-[10px] font-mono font-bold", isBig ? "text-red" : "text-green")}>
                {isBig && <AlertTriangle size={9} className="inline mr-0.5" />}{priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted">Platform fee (0.5%)</span>
              <span className="text-[10px] font-mono text-offwhite">${fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted">Slippage</span>
              <div className="flex gap-1">
                {SLIPPAGE_OPTIONS.map((s) => (
                  <button key={s} onClick={() => setSlippage(s)} className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors",
                    slippage === s ? "border-accent text-accent bg-accent/10" : "border-border text-muted"
                  )}>{s}</button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-2">
              <span className="text-[10px] text-muted">Network gas</span>
              <span className="text-[10px] text-green font-mono font-bold">FREE</span>
            </div>
          </div>
        )}

        <p className="text-[9px] text-muted text-center leading-relaxed">
          Settles on Mantle Network · KYC required · ERC-1400 compliant
        </p>
      </div>

      {/* CTA */}
      <div className="p-3 shrink-0 border-t border-border">
        {confirmed ? (
          <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green/10 border border-green/30 text-green text-sm font-bold">
            <CheckCircle2 size={16} /> Order submitted!
          </div>
        ) : (
          <button onClick={handleConfirm} disabled={!numAmount} className={cn(
            "w-full py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
            !numAmount ? "bg-card2 text-muted cursor-not-allowed border border-border"
              : side === "buy" ? "bg-green hover:bg-green/90 text-black hover:shadow-[0_0_20px_rgba(0,200,150,0.3)]"
              : "bg-red hover:bg-red/90 text-white hover:shadow-[0_0_20px_rgba(255,71,87,0.3)]"
          )}>
            {!numAmount ? "Enter amount" : side === "buy" ? `Buy ${asset.symbol}` : `Sell ${asset.symbol}`}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MarketPage() {
  const [assets] = useState<MarketAsset[]>(() => buildMarketAssets());
  const [live, setLive] = useState<Record<string, MarketAsset>>(() =>
    Object.fromEntries(assets.map((a) => [a.id, a]))
  );
  const [selectedId, setSelectedId] = useState(assets[0]?.id ?? "");
  const [timeframe, setTimeframe] = useState("1M");
  const [search, setSearch] = useState("");
  const [trades, setTrades] = useState<Record<string, any[]>>(() =>
    Object.fromEntries(assets.map((a) => [a.id, []]))
  );
  const chartRefDesktop = useRef<HTMLDivElement>(null);
  const chartRefMobile = useRef<HTMLDivElement>(null);
  const [chartWDesktop, setChartWDesktop] = useState(0);
  const [chartWMobile, setChartWMobile] = useState(0);

  const selected = live[selectedId];

  useEffect(() => {
    const el = chartRefDesktop.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setChartWDesktop(el.clientWidth));
    obs.observe(el);
    setChartWDesktop(el.clientWidth);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = chartRefMobile.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setChartWMobile(el.clientWidth));
    obs.observe(el);
    setChartWMobile(el.clientWidth);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setLive((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((assetId) => {
          const a = next[assetId];
          const last = a.ohlc[a.ohlc.length - 1];
          const change = (Math.random() - 0.49) * 0.004;
          const newClose = last.close * (1 + change);
          const newOhlc = [...a.ohlc.slice(-59), { ...last, close: newClose, high: Math.max(last.high, newClose), low: Math.min(last.low, newClose), volume: last.volume + Math.floor(Math.random() * 400) }];
          next[assetId] = { ...a, price: newClose, ohlc: newOhlc, change24h: a.change24h + (Math.random() - 0.5) * 0.05 };
        });
        return next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const id = setInterval(() => {
      const isBuy = Math.random() > 0.44;
      const price = selected.price * (1 + (Math.random() - 0.5) * 0.002);
      const qty = Math.floor(Math.random() * 8000 + 200);
      setTrades((prev) => ({
        ...prev,
        [selectedId]: [{ id: Date.now(), side: isBuy ? "BUY" : "SELL", price, qty, time: new Date() }, ...(prev[selectedId] ?? []).slice(0, 19)],
      }));
    }, 1800);
    return () => clearInterval(id);
  }, [selected, selectedId]);

  const filtered = useMemo(() =>
    Object.values(live).filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.symbol.toLowerCase().includes(search.toLowerCase())),
    [live, search]
  );

  if (!selected) return null;
  const isUp = selected.change24h >= 0;

  return (
    <AppShell showRightRail={false} showContextStrip={false}>
      {/* ── DESKTOP: 3-column layout ── */}
      <div className="hidden md:flex h-[calc(100vh-84px)] -mx-6 -my-6 overflow-hidden">

        {/* Left: Asset list */}
        <div className="shrink-0 w-[240px] border-r border-border flex flex-col bg-surface overflow-hidden">
          <div className="px-3 pt-3 pb-2 border-b border-border space-y-2">
            <div className="flex items-center gap-1.5">
              <Activity size={12} className="text-accent" />
              <span className="text-xs font-bold text-white font-syne">Secondary Market</span>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-green">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />Live
              </span>
            </div>
            <div className="relative">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tokens…"
                className="w-full bg-card border border-border rounded-lg pl-7 pr-3 py-1.5 text-xs text-offwhite placeholder:text-muted2 focus:border-accent focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 py-1.5 border-b border-border/60">
            <span className="text-[9px] text-muted uppercase tracking-widest">Token</span>
            <span className="text-[9px] text-muted uppercase tracking-widest text-right">Price</span>
            <span className="text-[9px] text-muted uppercase tracking-widest text-right w-12">24h</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-none">
            {filtered.map((a) => {
              const up = a.change24h >= 0;
              return (
                <button key={a.id} onClick={() => setSelectedId(a.id)} className={cn(
                  "w-full grid grid-cols-[1fr_auto_auto] gap-2 items-center px-3 py-2.5 border-b border-border/30 text-left transition-colors",
                  selectedId === a.id ? "bg-accent/10 border-l-2 border-l-accent" : "hover:bg-card/60"
                )}>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white font-mono">{a.symbol}</p>
                    <p className="text-[9px] text-muted truncate">{a.name}</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-offwhite">${a.price.toFixed(4)}</span>
                  <span className={cn("text-[10px] font-mono font-bold text-right w-12", up ? "text-green" : "text-red")}>
                    {up ? "+" : ""}{a.change24h.toFixed(2)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Chart */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Asset header */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-border shrink-0 flex-wrap gap-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-card2 border border-border flex items-center justify-center shrink-0">
                <CategoryIcon category={selected.category} size={15} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-syne font-black text-white text-base">{selected.symbol}</span>
                  <span className="text-xs text-muted">{selected.name}</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-muted"><MapPin size={9} />{selected.country}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-black text-2xl text-white">${selected.price.toFixed(4)}</span>
              <span className={cn("flex items-center gap-0.5 text-sm font-mono font-bold", isUp ? "text-green" : "text-red")}>
                {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {isUp ? "+" : ""}{selected.change24h.toFixed(2)}%
              </span>
            </div>
            <div className="ml-auto flex items-center gap-5">
              {[
                { label: "24h Vol", value: `$${(selected.volume24h / 1000).toFixed(1)}K` },
                { label: "24h High", value: `$${selected.high24h.toFixed(4)}` },
                { label: "24h Low", value: `$${selected.low24h.toFixed(4)}` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-[9px] text-muted uppercase tracking-widest">{label}</p>
                  <p className="text-xs font-mono font-bold text-offwhite">{value}</p>
                </div>
              ))}
              <Link href={`/asset/${selected.id}`} className="flex items-center gap-1 text-xs text-accent hover:text-white transition-colors font-medium shrink-0">
                View Asset <ArrowUpRight size={11} />
              </Link>
            </div>
          </div>

          {/* Chart */}
          <div className="flex flex-col flex-1 min-h-0 p-4 gap-3">
            <div className="flex items-center gap-1">
              {TIMEFRAMES.map((tf) => (
                <button key={tf} onClick={() => setTimeframe(tf)} className={cn(
                  "px-3 py-2 rounded text-xs font-mono font-bold transition-all min-h-[36px]",
                  timeframe === tf ? "bg-accent/15 text-accent border border-accent/30" : "text-muted hover:text-offwhite"
                )}>{tf}</button>
              ))}
              <div className="ml-auto flex items-center gap-1.5 text-[10px] text-green">
                <RefreshCw size={9} className="animate-spin" style={{ animationDuration: "3s" }} />Live
              </div>
            </div>
            <div ref={chartRefDesktop} className="flex-1 min-h-0 bg-card rounded-xl border border-border p-3 overflow-hidden">
              {chartWDesktop > 0 && (
                <CandlestickSVG data={selected.ohlc} width={chartWDesktop - 24} height={Math.max(200, (chartRefDesktop.current?.clientHeight ?? 300) - 24)} />
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Panel + Recent Trades */}
        <div className="shrink-0 w-[260px] border-l border-border flex flex-col overflow-hidden">
          {/* Order panel */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <OrderPanel asset={selected} />
          </div>
          {/* Recent trades */}
          <div className="shrink-0 border-t border-border flex flex-col" style={{ height: 200 }}>
            <div className="px-3 py-2 border-b border-border shrink-0">
              <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Recent Trades</p>
            </div>
            <div className="grid grid-cols-3 px-3 py-1 border-b border-border/50 shrink-0">
              <span className="text-[9px] text-muted">Price</span>
              <span className="text-[9px] text-muted text-right">Qty</span>
              <span className="text-[9px] text-muted text-right">Time</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-none">
              {(trades[selectedId] ?? []).map((t) => (
                <div key={t.id} className="grid grid-cols-3 px-3 py-[3px] border-b border-border/20 items-center">
                  <span className={cn("text-[10px] font-mono font-bold", t.side === "BUY" ? "text-green" : "text-red")}>{t.price.toFixed(4)}</span>
                  <span className="text-[9px] font-mono text-muted text-right">{t.qty.toLocaleString()}</span>
                  <span className="text-[9px] text-muted2 text-right">{t.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: single scrollable column ── */}
      <div className="md:hidden -mx-3 -my-6">

        {/* Horizontal token strip */}
        <div className="flex items-center gap-2 overflow-x-auto px-3 py-2 border-b border-border bg-surface scrollbar-none">
          <div className="flex items-center gap-1 shrink-0 mr-1">
            <Activity size={10} className="text-accent" />
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Market</span>
          </div>
          {filtered.map((a) => {
            const up = a.change24h >= 0;
            return (
              <button key={a.id} onClick={() => setSelectedId(a.id)} className={cn(
                "shrink-0 flex flex-col items-start px-2.5 py-1.5 rounded-xl border transition-all",
                selectedId === a.id ? "bg-accent/10 border-accent" : "bg-card border-border"
              )}>
                <span className="text-[10px] font-mono font-bold text-white">{a.symbol}</span>
                <span className={cn("text-[9px] font-mono", up ? "text-green" : "text-red")}>
                  {up ? "+" : ""}{a.change24h.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Asset header */}
        <div className="flex items-center gap-3 px-3 py-3 border-b border-border bg-surface">
          <div className="w-8 h-8 rounded-xl bg-card2 border border-border flex items-center justify-center shrink-0">
            <CategoryIcon category={selected.category} size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-syne font-black text-white text-sm">{selected.symbol}</span>
              <span className="text-[10px] text-muted truncate">{selected.name}</span>
            </div>
            <span className="flex items-center gap-1 text-[9px] text-muted"><MapPin size={8} />{selected.country}</span>
          </div>
          <div className="text-right shrink-0">
            <p className="font-mono font-black text-white text-base">${selected.price.toFixed(4)}</p>
            <p className={cn("text-[10px] font-mono font-bold flex items-center justify-end gap-0.5", isUp ? "text-green" : "text-red")}>
              {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isUp ? "+" : ""}{selected.change24h.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-around px-3 py-2 border-b border-border bg-surface">
          {[
            { label: "24h Vol", value: `$${(selected.volume24h / 1000).toFixed(1)}K` },
            { label: "High", value: `$${selected.high24h.toFixed(4)}` },
            { label: "Low", value: `$${selected.low24h.toFixed(4)}` },
            { label: "Raise", value: `${selected.raisedPct.toFixed(0)}%` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-[9px] text-muted uppercase tracking-widest">{label}</p>
              <p className="text-[10px] font-mono font-bold text-offwhite">{value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="px-3 py-3 border-b border-border">
          <div className="flex items-center gap-1 mb-2 overflow-x-auto scrollbar-none">
            {TIMEFRAMES.map((tf) => (
              <button key={tf} onClick={() => setTimeframe(tf)} className={cn(
                "shrink-0 px-2.5 py-1.5 rounded text-xs font-mono font-bold transition-all",
                timeframe === tf ? "bg-accent/15 text-accent border border-accent/30" : "text-muted"
              )}>{tf}</button>
            ))}
            <div className="ml-auto flex items-center gap-1 text-[10px] text-green shrink-0">
              <RefreshCw size={8} className="animate-spin" style={{ animationDuration: "3s" }} />Live
            </div>
          </div>
          <div ref={chartRefMobile} className="bg-card rounded-xl border border-border p-2 overflow-hidden" style={{ height: 220 }}>
            {chartWMobile > 0 && <CandlestickSVG data={selected.ohlc} width={chartWMobile - 16} height={200} />}
          </div>
        </div>

        {/* Order panel */}
        <div className="border-b border-border" style={{ minHeight: 420 }}>
          <OrderPanel asset={selected} />
        </div>

        {/* Recent trades */}
        <div className="px-3 py-3">
          <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">Recent Trades</p>
          <div className="grid grid-cols-3 py-1 border-b border-border/50 mb-1">
            <span className="text-[9px] text-muted">Price</span>
            <span className="text-[9px] text-muted text-right">Qty</span>
            <span className="text-[9px] text-muted text-right">Time</span>
          </div>
          {(trades[selectedId] ?? []).slice(0, 8).map((t) => (
            <div key={t.id} className="grid grid-cols-3 py-1.5 border-b border-border/20 items-center">
              <span className={cn("text-[10px] font-mono font-bold", t.side === "BUY" ? "text-green" : "text-red")}>{t.price.toFixed(4)}</span>
              <span className="text-[9px] font-mono text-muted text-right">{t.qty.toLocaleString()}</span>
              <span className="text-[9px] text-muted2 text-right">{t.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
