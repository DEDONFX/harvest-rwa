import type {
  Asset,
  FeedItem,
  ActivityItem,
  PortfolioHolding,
  Transaction,
  User,
} from "@/types";

export const MOCK_ASSETS: Asset[] = [
  {
    id: "asset-001",
    name: "Lisbon Commercial Property",
    symbol: "HVST-LCP",
    chain: "mantle" as const,
    category: "real-estate-commercial",
    location: "Lisbon, Portugal",
    country: "Portugal",
    flag: "PT",
    image:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=300&fit=crop&q=80",
    description:
      "Premium commercial office space in central Lisbon, fully occupied by 3 corporate tenants on 5-year leases. Generates stable rental income with annual rent reviews.",
    annualYieldPercent: 7.2,
    riskScore: 3,
    status: "live",
    totalSupply: 500000,
    pricePerToken: 1.0,
    raiseTarget: 500000,
    raisedAmount: 341000,
    investorCount: 847,
    minInvestment: 1,
    launchDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    closeDate: new Date(Date.now() + 4 * 86400000 + 12 * 3600000).toISOString(),
    nextPayout: new Date(Date.now() + 18 * 86400000).toISOString(),
    assetType: "active_revenue",
    trending: true,
    featured: true,
    ddReport: {
      executiveSummary:
        "Lisbon Commercial Property is a Grade-A office building in central Lisbon generating stable rental income from three corporate tenants. The asset has a strong occupancy history of 97% over 5 years and benefits from Portugal's growing tech and financial services sector.",
      assetDescription:
        "A 4,200m² office complex in Marquês de Pombal, Lisbon's prime business district. Built in 2015, fully renovated in 2021. Currently occupied by a fintech firm, a law practice, and a consulting group, all on 5-year leases with inflation-linked rent reviews.",
      yieldMechanism:
        "Monthly rental income from three corporate tenants is collected by the property management company. After deducting all operating costs, net income is distributed quarterly to token holders in USDC.",
      operatingCostBreakdown:
        "Management fees (8%), maintenance reserve (4%), property insurance (2%), municipal taxes (3%), total deductions: 17% of gross rental income. Net yield to investors: 7.2% annually.",
      risks: [
        {
          name: "Tenant Vacancy Risk",
          description:
            "If a tenant vacates, rental income drops. Mitigated by 5-year lease terms and strong Lisbon office demand.",
          severity: "low",
        },
        {
          name: "Currency Risk",
          description:
            "Rents collected in EUR, distributions in USDC. EUR/USD fluctuation may affect yield in dollar terms.",
          severity: "low",
        },
        {
          name: "Regulatory Risk",
          description:
            "Changes to Portuguese property law or EU regulations could affect operations. Low probability given stable legal environment.",
          severity: "low",
        },
      ],
      riskScore: 3,
      riskScoreJustification:
        "Established revenue stream, blue-chip tenants, stable EU jurisdiction, and strong occupancy history result in a low risk score of 3/10.",
      originatorSummary:
        "PortaVerde Capital, a licensed Portuguese property fund manager with 12 years of operation and €180M AUM across 23 properties.",
      suitableFor: ["conservative", "balanced"],
    },
  },
  {
    id: "asset-002",
    name: "Brazil Solar Energy Fund",
    symbol: "HVST-BSF",
    chain: "mantle" as const,
    category: "infrastructure-energy",
    location: "Minas Gerais, Brazil",
    country: "Brazil",
    flag: "BR",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=300&fit=crop&q=80",
    description:
      "Three utility-scale solar farms totalling 48MW capacity in one of Brazil's sunniest regions. Long-term power purchase agreements with state utility.",
    annualYieldPercent: 11.4,
    riskScore: 5,
    status: "live",
    totalSupply: 1000000,
    pricePerToken: 1.0,
    raiseTarget: 1000000,
    raisedAmount: 788000,
    investorCount: 1342,
    minInvestment: 1,
    launchDate: new Date(Date.now() - 12 * 86400000).toISOString(),
    closeDate: new Date(Date.now() + 2 * 86400000 + 6 * 3600000).toISOString(),
    nextPayout: new Date(Date.now() + 7 * 86400000).toISOString(),
    assetType: "active_revenue",
    trending: true,
    ddReport: {
      executiveSummary:
        "Brazil Solar Energy Fund offers exposure to three operating solar farms with guaranteed revenue via 20-year PPAs. The fund is currently producing 12% above projection due to exceptional solar irradiance this quarter.",
      assetDescription:
        "Three ground-mounted solar PV farms (16MW, 18MW, 14MW) located in Minas Gerais, Brazil. All farms fully operational since 2022. Power sold exclusively to CEMIG under 20-year fixed-price contracts.",
      yieldMechanism:
        "Revenue from electricity sales under PPA contracts. Fixed price per MWh means revenue is predictable regardless of spot market prices.",
      operatingCostBreakdown:
        "O&M contracts (12%), insurance (3%), land lease (2%), management fees (5%), grid connection fees (3%). Total: 25% of gross revenue. Net yield: 11.4% annually.",
      risks: [
        {
          name: "Counterparty Risk (CEMIG)",
          description:
            "Revenue depends on CEMIG honouring PPA contracts. CEMIG is state-owned with strong government backing.",
          severity: "low",
        },
        {
          name: "Technical/Equipment Risk",
          description:
            "Solar panel degradation and inverter failures can reduce output. Fully covered by O&M contracts with performance guarantees.",
          severity: "medium",
        },
        {
          name: "Brazil Political Risk",
          description:
            "Policy changes in Brazil could affect energy sector. Mitigated by long-term fixed contracts.",
          severity: "medium",
        },
        {
          name: "Currency Risk",
          description:
            "Revenue in BRL, distributions in USDC. BRL volatility could affect dollar returns.",
          severity: "medium",
        },
      ],
      riskScore: 5,
      riskScoreJustification:
        "Solid fundamentals with guaranteed revenue, but emerging market currency exposure and political risk in Brazil elevate the score to a medium 5/10.",
      originatorSummary:
        "SolarBridge Renewables, a Brazilian renewable energy developer with 340MW of projects across Latin America.",
      suitableFor: ["balanced", "growth"],
    },
  },
  {
    id: "asset-003",
    name: "Lagos Invoice Finance Pool",
    symbol: "HVST-LIF",
    chain: "solana" as const,
    category: "business-yield",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    flag: "NG",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop&q=80",
    description:
      "A revolving pool of short-duration trade invoices from verified Nigerian SMEs. Invoices are pre-screened, insured, and typically mature in 30–90 days.",
    annualYieldPercent: 16.8,
    riskScore: 7,
    status: "live",
    totalSupply: 250000,
    pricePerToken: 1.0,
    raiseTarget: 250000,
    raisedAmount: 201000,
    investorCount: 523,
    minInvestment: 1,
    launchDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    closeDate: new Date(Date.now() + 8 * 86400000).toISOString(),
    nextPayout: new Date(Date.now() + 32 * 86400000).toISOString(),
    assetType: "active_revenue",
    trending: true,
    ddReport: {
      executiveSummary:
        "The Lagos Invoice Finance Pool provides high-yield exposure to Nigerian trade finance. High returns reflect frontier market risk premium. Pool is insured and diversified across 50+ SME debtors.",
      assetDescription:
        "A managed pool of 30–90 day trade finance invoices from pre-vetted Nigerian SMEs in FMCG, construction, and logistics sectors. Pool size: $250,000, revolving structure.",
      yieldMechanism:
        "Invoices purchased at discount, collected at face value. Discount rate averages 14% annualized. Gross yield includes FX premium.",
      operatingCostBreakdown:
        "Credit insurance (4%), management fees (5%), collections costs (2%). Net yield: 16.8% annually.",
      risks: [
        {
          name: "Credit Default Risk",
          description: "SMEs may default on invoices. Pool is insured up to 80% of face value per default.",
          severity: "high",
        },
        {
          name: "Concentration Risk",
          description: "Single-country exposure to Nigeria. Political or economic instability could affect collections.",
          severity: "high",
        },
        {
          name: "Currency Risk", description: "Invoices in NGN, distributions in USDC. NGN is a high-volatility currency.",
          severity: "high",
        },
      ],
      riskScore: 7,
      riskScoreJustification:
        "High yield reflects high risk. Frontier market, currency volatility, and SME credit risk all contribute to a 7/10 risk score. Suitable only for growth investors who understand the risk.",
      originatorSummary:
        "TradeLink Capital, a Lagos-based trade finance platform with $45M in invoices processed since 2020.",
      suitableFor: ["growth"],
    },
  },
  {
    id: "asset-004",
    name: "Dubai Logistics Hub",
    symbol: "HVST-DLH",
    chain: "mantle" as const,
    category: "infrastructure-logistics",
    location: "Dubai, UAE",
    country: "UAE",
    flag: "AE",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=300&fit=crop&q=80",
    description:
      "Modern 12,000m² logistics warehouse near Al Maktoum Airport in Dubai South. Fully leased to two e-commerce fulfilment operators on 7-year terms.",
    annualYieldPercent: 8.9,
    riskScore: 2,
    status: "live",
    totalSupply: 800000,
    pricePerToken: 1.0,
    raiseTarget: 800000,
    raisedAmount: 234000,
    investorCount: 412,
    minInvestment: 1,
    launchDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    closeDate: new Date(Date.now() + 11 * 86400000).toISOString(),
    nextPayout: new Date(Date.now() + 28 * 86400000).toISOString(),
    assetType: "active_revenue",
    featured: true,
    ddReport: {
      executiveSummary:
        "Dubai Logistics Hub is a Grade-A warehouse facility in Dubai's fastest-growing logistics corridor. Near-zero vacancy risk given strong e-commerce growth in the MENA region.",
      assetDescription:
        "12,000m² modern warehouse with 12m clear height, full automation capability, and direct freezone access. Tenants: Noon.com (9,000m²) and a regional 3PL operator (3,000m²).",
      yieldMechanism:
        "Fixed annual rent under 7-year NNN leases. Tenants responsible for all maintenance and insurance. Net to investors: 8.9% annually.",
      operatingCostBreakdown:
        "Management fees (5%), freezone fees (3%), structural insurance (2%). Total: 10% of gross. All other costs tenant-responsible under NNN leases.",
      risks: [
        {
          name: "Geopolitical Risk", description: "UAE is a stable jurisdiction but regional tensions could affect logistics flows.", severity: "low"
        },
        {
          name: "E-commerce Slowdown", description: "If regional e-commerce growth slows, tenant demand could soften at renewal.", severity: "low"
        },
      ],
      riskScore: 2,
      riskScoreJustification:
        "NNN leases with blue-chip tenants, strong UAE legal framework, and booming logistics demand result in a very low risk score of 2/10.",
      originatorSummary:
        "Emirates Industrial REIT, a licensed Dubai real estate investment manager with AED 2.4B in managed assets.",
      suitableFor: ["conservative", "balanced"],
    },
  },
  {
    id: "asset-005",
    name: "Nairobi Student Housing",
    symbol: "HVST-NSH",
    chain: "solana" as const,
    category: "real-estate-residential",
    location: "Nairobi, Kenya",
    country: "Kenya",
    flag: "KE",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=300&fit=crop&q=80",
    description:
      "Purpose-built 200-bed student accommodation adjacent to University of Nairobi. Historically 96% occupied with month-by-month leases.",
    annualYieldPercent: 9.4,
    riskScore: 4,
    status: "upcoming",
    totalSupply: 350000,
    pricePerToken: 1.0,
    raiseTarget: 350000,
    raisedAmount: 0,
    investorCount: 0,
    minInvestment: 1,
    launchDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    closeDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    nextPayout: new Date(Date.now() + 45 * 86400000).toISOString(),
    assetType: "active_revenue",
    ddReport: {
      executiveSummary:
        "Nairobi Student Housing offers stable yield from a fully operational student accommodation block with near-full occupancy. Benefits from Kenya's growing university enrollment trend.",
      assetDescription:
        "200 single-occupancy rooms across 4 floors, with shared kitchens, study rooms, and security. Walking distance from University of Nairobi main campus.",
      yieldMechanism:
        "Monthly rent from student tenants. Historically 96% occupied. Rents rise ~8% annually in line with Kenyan CPI.",
      operatingCostBreakdown:
        "Property management (10%), security (5%), utilities (8%), maintenance (5%). Total: 28%. Net yield: 9.4% annually.",
      risks: [
        { name: "Occupancy Risk", description: "Depends on university enrollment levels. Risk is very low given 96% historical occupancy.", severity: "low" },
        { name: "Kenyan Political Risk", description: "Kenya has a history of election-related disruptions which can temporarily affect operations.", severity: "medium" },
      ],
      riskScore: 4,
      riskScoreJustification: "Strong fundamentals with minor emerging-market risk factors resulting in a 4/10 score.",
      originatorSummary: "Savanna Property Fund, a Nairobi-based real estate developer with 15 years of student housing experience.",
      suitableFor: ["balanced", "growth"],
    },
  },
  {
    id: "asset-006",
    name: "Manila Data Centre",
    symbol: "HVST-MDC",
    chain: "solana" as const,
    category: "infrastructure-logistics",
    location: "Manila, Philippines",
    country: "Philippines",
    flag: "PH",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop&q=80",
    description:
      "Tier III data centre in Manila serving regional cloud providers and enterprise clients. 8MW capacity, 92% utilisation, long-term contracts.",
    annualYieldPercent: 13.2,
    riskScore: 5,
    status: "live",
    totalSupply: 600000,
    pricePerToken: 1.0,
    raiseTarget: 600000,
    raisedAmount: 389000,
    investorCount: 678,
    minInvestment: 1,
    launchDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    closeDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    nextPayout: new Date(Date.now() + 22 * 86400000).toISOString(),
    assetType: "active_revenue",
    ddReport: {
      executiveSummary:
        "Manila Data Centre provides high-yield infrastructure exposure to Southeast Asia's fastest-growing digital economy. 92% utilisation and long-term contracts provide revenue stability.",
      assetDescription:
        "8MW Tier III colocation data centre in Pasay City, Manila. Clients include two regional cloud providers and 12 enterprise tenants. Average contract term: 4.2 years.",
      yieldMechanism:
        "Revenue from colocation fees (power + space). Contracts are take-or-pay, providing guaranteed minimum revenue.",
      operatingCostBreakdown:
        "Power costs (35%), maintenance (8%), security (5%), management (5%). Total: 53% of gross. Net yield: 13.2% annually.",
      risks: [
        { name: "Power Cost Inflation", description: "Manila power rates can spike. Some contracts have power pass-through clauses mitigating this risk.", severity: "medium" },
        { name: "Technology Obsolescence", description: "Data centre technology evolves quickly. Capex required for upgrades factored into reserves.", severity: "medium" },
      ],
      riskScore: 5,
      riskScoreJustification: "High yield from growing sector balanced by power cost exposure and Southeast Asian market risk at 5/10.",
      originatorSummary: "PhilDigital Infrastructure, a Manila-based data centre operator with 3 facilities across the Philippines.",
      suitableFor: ["balanced", "growth"],
    },
  },
  {
    id: "asset-007",
    name: "Casablanca Mixed-Use Tower",
    symbol: "HVST-CMT",
    chain: "mantle" as const,
    category: "pre-revenue",
    location: "Casablanca, Morocco",
    country: "Morocco",
    flag: "MA",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=300&fit=crop&q=80",
    description:
      "Pre-revenue development stage. A 28-floor mixed-use tower under construction in Casablanca's new financial district. Expected completion Q3 2026.",
    annualYieldPercent: 18.5,
    riskScore: 8,
    status: "upcoming",
    totalSupply: 1500000,
    pricePerToken: 0.65,
    raiseTarget: 975000,
    raisedAmount: 0,
    investorCount: 0,
    minInvestment: 1,
    launchDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    closeDate: new Date(Date.now() + 21 * 86400000).toISOString(),
    nextPayout: new Date(Date.now() + 180 * 86400000).toISOString(),
    assetType: "pre_revenue",
    ddReport: {
      executiveSummary:
        "Casablanca Mixed-Use Tower is a high-upside development play in Morocco's fastest-growing commercial district. High projected returns reflect development-stage risk. Not suitable for conservative investors.",
      assetDescription:
        "28-floor tower with 60% commercial, 30% residential, 10% retail. Located in Casa-Finance City. Full planning permission obtained. Construction 18% complete as of listing.",
      yieldMechanism:
        "Post-completion rental income from commercial and residential tenants. Development profit from pre-sold units also flows to token holders.",
      operatingCostBreakdown:
        "Construction cost overrun reserve (10%), management fees (5%), finance costs (8%). Net projected yield post-completion: 18.5% annually.",
      risks: [
        { name: "Construction Risk", description: "Delays or cost overruns could defer yield and erode returns.", severity: "high" },
        { name: "Pre-Revenue Risk", description: "No income until construction completes. Investors wait 12–18 months for first payout.", severity: "high" },
        { name: "Morocco Market Risk", description: "Commercial real estate demand in Casablanca is growing but less established than European markets.", severity: "high" },
      ],
      riskScore: 8,
      riskScoreJustification: "Development-stage asset with construction, pre-revenue, and emerging market risks combines for a high 8/10 score. High upside for growth investors.",
      originatorSummary: "Maghreb Capital Development, a Casablanca-based property developer with 8 completed commercial projects.",
      suitableFor: ["growth"],
    },
  },
  {
    id: "asset-008",
    name: "UK Private Credit Fund",
    symbol: "HVST-UPC",
    chain: "mantle" as const,
    category: "business-yield",
    location: "London, UK",
    country: "United Kingdom",
    flag: "GB",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=300&fit=crop&q=80",
    description:
      "A diversified pool of senior-secured private credit loans to UK SMEs. FCA-compliant originator, quarterly distributions.",
    annualYieldPercent: 8.1,
    riskScore: 3,
    status: "raise_complete",
    totalSupply: 2000000,
    pricePerToken: 1.0,
    raiseTarget: 2000000,
    raisedAmount: 2000000,
    investorCount: 2341,
    minInvestment: 1,
    launchDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    closeDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    nextPayout: new Date(Date.now() + 5 * 86400000).toISOString(),
    assetType: "active_revenue",
    ddReport: {
      executiveSummary:
        "UK Private Credit Fund is a fully subscribed senior-secured lending pool generating consistent 8.1% annual yield. FCA-regulated originator and diversified loan book make this a low-risk income asset.",
      assetDescription:
        "100 senior-secured loans averaging £20,000 each to UK SMEs in manufacturing, logistics, and professional services. Average loan term: 18 months.",
      yieldMechanism:
        "Interest income from SME loans. Senior secured means assets can be seized in default. Historical default rate: 0.8%.",
      operatingCostBreakdown:
        "Credit management (4%), loan origination (3%), insurance (2%). Net yield: 8.1%.",
      risks: [
        { name: "UK Recession Risk", description: "Economic downturn could increase SME defaults. Mitigated by senior security and diversification.", severity: "low" },
        { name: "Interest Rate Risk", description: "Fixed-rate loans lose relative value if market rates rise significantly.", severity: "low" },
      ],
      riskScore: 3,
      riskScoreJustification: "Senior-secured, FCA-regulated, diversified UK credit at 3/10 risk.",
      originatorSummary: "Meridian Credit Partners, an FCA-authorised UK SME lender with £340M in originations since 2018.",
      suitableFor: ["conservative", "balanced"],
    },
  },
];

export const MOCK_TICKER_ITEMS = [
  { id: "t1", color: "green", address: "0x4f2a...8b1c", type: "BOUGHT", asset: "Lisbon Property", amount: "$250" },
  { id: "t2", color: "amber", address: "0x7c3d...2e9f", type: "LAUNCHED", asset: "Nairobi Housing", amount: "LIVE" },
  { id: "t3", color: "green", address: "0x1a8b...5d4e", type: "BOUGHT", asset: "Brazil Solar", amount: "$1,200" },
  { id: "t4", color: "blue", address: "0x9e2f...7a3c", type: "YIELD", asset: "UK Credit Fund", amount: "$34.20" },
  { id: "t5", color: "green", address: "0x3b7c...1f8a", type: "BOUGHT", asset: "Dubai Logistics", amount: "$500" },
  { id: "t6", color: "green", address: "0x5d1e...9c2b", type: "BOUGHT", asset: "Lagos Invoice", amount: "$100" },
  { id: "t7", color: "amber", address: "0x8f4a...6d1e", type: "MILESTONE", asset: "Brazil Solar", amount: "75% raised" },
  { id: "t8", color: "green", address: "0x2c9b...3a7f", type: "BOUGHT", asset: "Manila Data Centre", amount: "$300" },
  { id: "t9", color: "blue", address: "0x6e3d...4b2c", type: "YIELD", asset: "Brazil Solar", amount: "$128.40" },
  { id: "t10", color: "green", address: "0x4a1f...8e3d", type: "BOUGHT", asset: "Lisbon Property", amount: "$750" },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    eventType: "LAUNCHED",
    headline: "Dubai Logistics Hub just went LIVE",
    subtitle: "8.9% APY · UAE · $800K raise",
    createdAt: new Date(Date.now() - 2 * 60000),
    assetId: "asset-004",
  },
  {
    id: "a2",
    eventType: "INVESTED",
    headline: "Someone invested $1,200 in Brazil Solar",
    subtitle: "78.8% raised · 2d 6h left",
    createdAt: new Date(Date.now() - 4 * 60000),
    assetId: "asset-002",
  },
  {
    id: "a3",
    eventType: "YIELD",
    headline: "UK Credit Fund distributed $4,280",
    subtitle: "$0.041/token · 2,341 holders",
    createdAt: new Date(Date.now() - 8 * 60000),
    assetId: "asset-008",
  },
  {
    id: "a4",
    eventType: "MILESTONE",
    headline: "Brazil Solar hit 75% subscribed",
    subtitle: "$750,000 raised of $1,000,000",
    createdAt: new Date(Date.now() - 15 * 60000),
    assetId: "asset-002",
  },
  {
    id: "a5",
    eventType: "INVESTED",
    headline: "Someone invested $500 in Lisbon Property",
    subtitle: "68.2% raised · 4d 12h left",
    createdAt: new Date(Date.now() - 22 * 60000),
    assetId: "asset-001",
  },
  {
    id: "a6",
    eventType: "INVESTED",
    headline: "Someone invested $300 in Manila Data",
    subtitle: "64.8% raised · 6d left",
    createdAt: new Date(Date.now() - 35 * 60000),
    assetId: "asset-006",
  },
  {
    id: "a7",
    eventType: "COMPLETE",
    headline: "UK Private Credit Fund FULLY SUBSCRIBED",
    subtitle: "$2,000,000 raised · 2,341 investors",
    createdAt: new Date(Date.now() - 2 * 86400000),
    assetId: "asset-008",
  },
  {
    id: "a8",
    eventType: "INVESTED",
    headline: "Someone invested $100 in Lagos Invoice",
    subtitle: "80.4% raised · 8d left",
    createdAt: new Date(Date.now() - 48 * 60000),
    assetId: "asset-003",
  },
];

export const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: "f1",
    eventType: "ASSET_LIVE",
    assetId: "asset-004",
    assetName: "Dubai Logistics Hub",
    metadata: { yieldPercent: 8.9, raisedPercent: 29.2, daysLeft: 11 },
    createdAt: new Date(Date.now() - 2 * 60000),
  },
  {
    id: "f2",
    eventType: "INVESTMENT_MADE",
    assetId: "asset-002",
    assetName: "Brazil Solar Energy Fund",
    metadata: { amount: 1200, raisedPercent: 78.8 },
    createdAt: new Date(Date.now() - 4 * 60000),
  },
  {
    id: "f3",
    eventType: "RAISE_MILESTONE",
    assetId: "asset-002",
    assetName: "Brazil Solar Energy Fund",
    metadata: { milestone: 75, raised: 750000, target: 1000000 },
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: "f4",
    eventType: "YIELD_DISTRIBUTED",
    assetId: "asset-008",
    assetName: "UK Private Credit Fund",
    metadata: { totalYield: 4280, holderCount: 2341, perToken: 0.041 },
    createdAt: new Date(Date.now() - 8 * 60000),
  },
  {
    id: "f5",
    eventType: "UPCOMING_LAUNCH",
    assetId: "asset-005",
    assetName: "Nairobi Student Housing",
    metadata: { daysToLaunch: 2, waitlistCount: 412, yieldPercent: 9.4 },
    createdAt: new Date(Date.now() - 30 * 60000),
  },
];

export const MOCK_PORTFOLIO: PortfolioHolding[] = [
  {
    assetId: "asset-001",
    assetName: "Lisbon Commercial Property",
    assetImage: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=200&fit=crop&q=80",
    category: "real-estate-commercial",
    tokens: 2500,
    currentValue: 2500,
    purchaseValue: 2500,
    yieldEarned: 180.00,
    annualYieldPercent: 7.2,
    nextPayout: new Date(Date.now() + 18 * 86400000).toISOString(),
  },
  {
    assetId: "asset-002",
    assetName: "Brazil Solar Energy Fund",
    assetImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop&q=80",
    category: "infrastructure-energy",
    tokens: 5000,
    currentValue: 5120,
    purchaseValue: 5000,
    yieldEarned: 570.00,
    annualYieldPercent: 11.4,
    nextPayout: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
  {
    assetId: "asset-008",
    assetName: "UK Private Credit Fund",
    assetImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=200&fit=crop&q=80",
    category: "business-yield",
    tokens: 1500,
    currentValue: 1500,
    purchaseValue: 1500,
    yieldEarned: 121.50,
    annualYieldPercent: 8.1,
    nextPayout: new Date(Date.now() + 5 * 86400000).toISOString(),
  },
  {
    assetId: "asset-004",
    assetName: "Dubai Logistics Hub",
    assetImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop&q=80",
    category: "infrastructure-logistics",
    tokens: 1000,
    currentValue: 1000,
    purchaseValue: 1000,
    yieldEarned: 44.50,
    annualYieldPercent: 8.9,
    nextPayout: new Date(Date.now() + 28 * 86400000).toISOString(),
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    type: "investment",
    description: "Invested in Brazil Solar Energy Fund",
    amount: -500,
    currency: "USDC",
    status: "confirmed",
    createdAt: new Date(Date.now() - 12 * 86400000),
    txHash: "0x4f2a8b1c3e5d7f9a2c4e6b8d0f1a3c5e7b9d",
  },
  {
    id: "tx2",
    type: "yield",
    description: "Yield from UK Private Credit Fund",
    amount: 5.60,
    currency: "USDC",
    status: "confirmed",
    createdAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    id: "tx3",
    type: "deposit",
    description: "P2P deposit via M-Pesa",
    amount: 200,
    currency: "USDC",
    status: "confirmed",
    createdAt: new Date(Date.now() - 14 * 86400000),
  },
  {
    id: "tx4",
    type: "investment",
    description: "Invested in Lisbon Commercial Property",
    amount: -250,
    currency: "USDC",
    status: "confirmed",
    createdAt: new Date(Date.now() - 10 * 86400000),
  },
  {
    id: "tx5",
    type: "yield",
    description: "Yield from Brazil Solar Energy Fund",
    amount: 34.20,
    currency: "USDC",
    status: "confirmed",
    createdAt: new Date(Date.now() - 3 * 86400000),
  },
];

export const MOCK_USER: User = {
  id: "user-001",
  name: "Alex Johnson",
  email: "alex@example.com",
  walletAddress: "0x4f2a8b1c3e5d7f9a2c4e6b8d0f1a3c5e",
  balance: 487.50,
  kycTier: 1,
  kycStatus: "approved",
  investorProfile: {
    investmentPreference: "mixed",
    holdDuration: "medium",
    riskAppetite: "balanced",
  },
};

export const CATEGORY_LABELS: Record<string, string> = {
  "real-estate-commercial": "Real Estate · Commercial",
  "real-estate-residential": "Real Estate · Residential",
  "infrastructure-energy": "Infrastructure · Energy",
  "infrastructure-logistics": "Infrastructure · Logistics",
  "business-yield": "Business Yield",
  "commodities": "Commodities",
  "pre-revenue": "Pre-Revenue",
};

// CATEGORY_ICONS is kept for legacy reference; use CategoryIcon component for rendering
export const CATEGORY_ICONS: Record<string, string> = {
  "real-estate-commercial": "Building2",
  "real-estate-residential": "Home",
  "infrastructure-energy": "Zap",
  "infrastructure-logistics": "Factory",
  "business-yield": "TrendingUp",
  "commodities": "Wheat",
  "pre-revenue": "Rocket",
};
