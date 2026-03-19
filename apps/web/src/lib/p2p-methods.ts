export interface PaymentMethod {
  id: string;
  name: string;
  type: "bank" | "mobile_money" | "digital_wallet" | "cash";
}

export interface P2PCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  methods: PaymentMethod[];
  usdRate: number; // local currency per USD (approx)
}

export const P2P_COUNTRIES: P2PCountry[] = [
  {
    code: "NG", name: "Nigeria", flag: "NG", currency: "NGN", currencySymbol: "₦", usdRate: 1620,
    methods: [
      { id: "ng-gtb", name: "GTBank", type: "bank" },
      { id: "ng-access", name: "Access Bank", type: "bank" },
      { id: "ng-uba", name: "UBA", type: "bank" },
      { id: "ng-zenith", name: "Zenith Bank", type: "bank" },
      { id: "ng-opay", name: "OPay", type: "mobile_money" },
      { id: "ng-palmpay", name: "PalmPay", type: "mobile_money" },
      { id: "ng-momo", name: "MTN MoMo", type: "mobile_money" },
    ],
  },
  {
    code: "KE", name: "Kenya", flag: "KE", currency: "KES", currencySymbol: "KSh", usdRate: 130,
    methods: [
      { id: "ke-mpesa", name: "M-Pesa", type: "mobile_money" },
      { id: "ke-airtel", name: "Airtel Money", type: "mobile_money" },
      { id: "ke-kcb", name: "KCB Bank", type: "bank" },
      { id: "ke-equity", name: "Equity Bank", type: "bank" },
    ],
  },
  {
    code: "GH", name: "Ghana", flag: "GH", currency: "GHS", currencySymbol: "₵", usdRate: 15.5,
    methods: [
      { id: "gh-momo", name: "MTN MoMo", type: "mobile_money" },
      { id: "gh-vodafone", name: "Vodafone Cash", type: "mobile_money" },
      { id: "gh-gcb", name: "GCB Bank", type: "bank" },
    ],
  },
  {
    code: "ZA", name: "South Africa", flag: "ZA", currency: "ZAR", currencySymbol: "R", usdRate: 18.5,
    methods: [
      { id: "za-fnb", name: "FNB", type: "bank" },
      { id: "za-std", name: "Standard Bank", type: "bank" },
      { id: "za-capitec", name: "Capitec", type: "bank" },
      { id: "za-snapscan", name: "SnapScan", type: "digital_wallet" },
    ],
  },
  {
    code: "BR", name: "Brazil", flag: "BR", currency: "BRL", currencySymbol: "R$", usdRate: 5.1,
    methods: [
      { id: "br-pix", name: "PIX", type: "digital_wallet" },
      { id: "br-itau", name: "Itaú", type: "bank" },
      { id: "br-bradesco", name: "Bradesco", type: "bank" },
      { id: "br-nubank", name: "Nubank", type: "digital_wallet" },
    ],
  },
  {
    code: "PH", name: "Philippines", flag: "PH", currency: "PHP", currencySymbol: "₱", usdRate: 57,
    methods: [
      { id: "ph-gcash", name: "GCash", type: "mobile_money" },
      { id: "ph-maya", name: "Maya", type: "digital_wallet" },
      { id: "ph-bdo", name: "BDO Unibank", type: "bank" },
      { id: "ph-bpi", name: "BPI", type: "bank" },
    ],
  },
  {
    code: "ID", name: "Indonesia", flag: "ID", currency: "IDR", currencySymbol: "Rp", usdRate: 16200,
    methods: [
      { id: "id-gopay", name: "GoPay", type: "digital_wallet" },
      { id: "id-ovo", name: "OVO", type: "digital_wallet" },
      { id: "id-dana", name: "DANA", type: "digital_wallet" },
      { id: "id-bca", name: "BCA Bank", type: "bank" },
    ],
  },
  {
    code: "EG", name: "Egypt", flag: "EG", currency: "EGP", currencySymbol: "E£", usdRate: 48,
    methods: [
      { id: "eg-instapay", name: "InstaPay", type: "digital_wallet" },
      { id: "eg-fawry", name: "Fawry", type: "digital_wallet" },
      { id: "eg-cib", name: "CIB Bank", type: "bank" },
    ],
  },
  {
    code: "GB", name: "United Kingdom", flag: "GB", currency: "GBP", currencySymbol: "£", usdRate: 0.79,
    methods: [
      { id: "gb-faster", name: "Faster Payments", type: "bank" },
      { id: "gb-revolut", name: "Revolut", type: "digital_wallet" },
      { id: "gb-wise", name: "Wise", type: "digital_wallet" },
      { id: "gb-monzo", name: "Monzo", type: "bank" },
    ],
  },
  {
    code: "DE", name: "Germany", flag: "DE", currency: "EUR", currencySymbol: "€", usdRate: 0.92,
    methods: [
      { id: "eu-sepa", name: "SEPA Transfer", type: "bank" },
      { id: "eu-revolut", name: "Revolut", type: "digital_wallet" },
      { id: "eu-wise", name: "Wise", type: "digital_wallet" },
    ],
  },
  {
    code: "US", name: "United States", flag: "US", currency: "USD", currencySymbol: "$", usdRate: 1,
    methods: [
      { id: "us-ach", name: "ACH Transfer", type: "bank" },
      { id: "us-wise", name: "Wise", type: "digital_wallet" },
      { id: "us-zelle", name: "Zelle", type: "digital_wallet" },
    ],
  },
  {
    code: "IN", name: "India", flag: "IN", currency: "INR", currencySymbol: "₹", usdRate: 84,
    methods: [
      { id: "in-upi", name: "UPI", type: "digital_wallet" },
      { id: "in-imps", name: "IMPS Bank Transfer", type: "bank" },
      { id: "in-paytm", name: "Paytm", type: "digital_wallet" },
    ],
  },
  {
    code: "MA", name: "Morocco", flag: "MA", currency: "MAD", currencySymbol: "MAD", usdRate: 10.2,
    methods: [
      { id: "ma-cih", name: "CIH Bank", type: "bank" },
      { id: "ma-attijariwafa", name: "Attijariwafa Bank", type: "bank" },
      { id: "ma-cmi", name: "CMI", type: "digital_wallet" },
    ],
  },
  {
    code: "TH", name: "Thailand", flag: "TH", currency: "THB", currencySymbol: "฿", usdRate: 35,
    methods: [
      { id: "th-promptpay", name: "PromptPay", type: "digital_wallet" },
      { id: "th-kbank", name: "Kasikorn Bank", type: "bank" },
      { id: "th-scb", name: "SCB", type: "bank" },
    ],
  },
];

// Mock merchant bank details — in production these come from the matched merchant
export const MOCK_MERCHANT = {
  name: "Verified Merchant #4821",
  rating: 4.9,
  trades: 1247,
  bank: "GTBank",
  accountNumber: "0123456789",
  accountName: "Harvest P2P Merchant Ltd",
  reference: `HRV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  timeLimit: 30, // minutes
};
