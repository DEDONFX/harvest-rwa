export type AssetCategory =
  | "real-estate-commercial"
  | "real-estate-residential"
  | "infrastructure-energy"
  | "infrastructure-logistics"
  | "business-yield"
  | "commodities"
  | "pre-revenue";

export type AssetStatus =
  | "upcoming"
  | "live"
  | "raise_complete"
  | "yield_active"
  | "closed";

export type RiskLevel = "low" | "medium" | "high";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  chain: "mantle" | "solana";
  category: AssetCategory;
  location: string;
  country: string;
  flag: string;
  image: string;
  description: string;
  annualYieldPercent: number;
  riskScore: number;
  status: AssetStatus;
  totalSupply: number;
  pricePerToken: number;
  raiseTarget: number;
  raisedAmount: number;
  investorCount: number;
  minInvestment: number;
  launchDate: string;
  closeDate: string;
  nextPayout: string;
  assetType: "pre_revenue" | "active_revenue";
  ddReport: DDReport;
  trending?: boolean;
  featured?: boolean;
}

export interface DDReport {
  executiveSummary: string;
  assetDescription: string;
  yieldMechanism: string;
  operatingCostBreakdown: string;
  risks: Risk[];
  riskScore: number;
  riskScoreJustification: string;
  originatorSummary: string;
  suitableFor: ("conservative" | "balanced" | "growth")[];
}

export interface Risk {
  name: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface FeedItem {
  id: string;
  eventType:
    | "ASSET_LIVE"
    | "INVESTMENT_MADE"
    | "RAISE_MILESTONE"
    | "RAISE_COMPLETE"
    | "YIELD_DISTRIBUTED"
    | "SECONDARY_LISTING"
    | "UPCOMING_LAUNCH"
    | "NEW_INVESTOR_MILESTONE";
  assetId: string;
  assetName: string;
  metadata: Record<string, string | number>;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  balance: number;
  kycTier: 0 | 1 | 2 | 3;
  kycStatus: "none" | "pending" | "approved" | "rejected";
  investorProfile: InvestorProfile | null;
}

export interface InvestorProfile {
  investmentPreference: "real_estate" | "infrastructure" | "business_yield" | "mixed";
  holdDuration: "short" | "medium" | "long";
  riskAppetite: "conservative" | "balanced" | "growth";
}

export interface PortfolioHolding {
  assetId: string;
  assetName: string;
  assetImage: string;
  category: AssetCategory;
  tokens: number;
  currentValue: number;
  purchaseValue: number;
  yieldEarned: number;
  annualYieldPercent: number;
  nextPayout: string;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "investment" | "yield" | "secondary";
  description: string;
  amount: number;
  currency: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: Date;
  txHash?: string;
}

export interface ActivityItem {
  id: string;
  eventType: "LAUNCHED" | "INVESTED" | "YIELD" | "MILESTONE" | "COMPLETE";
  headline: string;
  subtitle: string;
  createdAt: Date;
  assetId?: string;
}
