import { useState, useEffect } from "react";
import {
  Users, Package, IndianRupee, Tag, Megaphone, Settings,
  LayoutDashboard, Search, Bell, ChevronDown, TrendingUp,
  ArrowUpRight, ArrowDownRight, Eye, Edit2, Trash2, Plus,
  Filter, Star, ShoppingBag, CreditCard,
  BarChart2, ChevronRight, LogOut, UserCheck, UserX,
  AlertCircle, ImageIcon, Globe, Lock, RefreshCw,
  ChevronLeft, Activity, Coins, CheckCircle, XCircle,
  MapPin, Phone
} from "lucide-react";

const MENU_BG = "#332C5A";
const ACCENT = "#3845AB";
const ORANGE = "#EEA86C";
const SCREEN_BG = "#FEF4EE";

// ─── API ─────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE;
const getToken = () => localStorage.getItem("vyapar_token");
const setToken = (t: string) => localStorage.setItem("vyapar_token", t);
const clearToken = () => localStorage.removeItem("vyapar_token");
const authHeaders = (): Record<string, string> => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

type AppUser = {
  id: number;
  name: string;
  phone: string;
  status: string;
  subscription: string;
  is_verified: boolean;
  joined: string;
  listings: number;
  business_name?: string;
  city?: string;
  category?: string;
};


const revenueData = [
  { month: "Aug", revenue: 3200000, expenses: 1100000 },
  { month: "Sep", revenue: 4500000, expenses: 1600000 },
  { month: "Oct", revenue: 3900000, expenses: 1400000 },
  { month: "Nov", revenue: 5800000, expenses: 2100000 },
  { month: "Dec", revenue: 7100000, expenses: 2600000 },
  { month: "Jan", revenue: 6200000, expenses: 2200000 },
  { month: "Feb", revenue: 8400000, expenses: 3000000 },
  { month: "Mar", revenue: 9100000, expenses: 3300000 },
];

const financialBarData = [
  { month: "Aug", rev: 3200000, exp: 1100000 },
  { month: "Sep", rev: 4500000, exp: 1600000 },
  { month: "Oct", rev: 3900000, exp: 1400000 },
  { month: "Nov", rev: 5800000, exp: 2100000 },
  { month: "Dec", rev: 7100000, exp: 2600000 },
  { month: "Jan", rev: 6200000, exp: 2200000 },
  { month: "Feb", rev: 8400000, exp: 3000000 },
  { month: "Mar", rev: 9100000, exp: 3300000 },
];

const categoryData = [
  { name: "Electronics", value: 32, color: ACCENT },
  { name: "Fashion & Apparel", value: 26, color: ORANGE },
  { name: "Home & Kitchen", value: 18, color: "#7B6FBE" },
  { name: "Health & Beauty", value: 14, color: "#E07B5A" },
  { name: "Other", value: 10, color: "#B0A8D0" },
];

const users = [
  { id: 1, name: "Arjun Sharma", email: "arjun.sharma@gmail.com", city: "Mumbai", role: "Seller", status: "Active", joined: "12 Mar 2024", listings: 24, spend: "₹1,84,200", subscription: "Annual" },
  { id: 2, name: "Priya Venkatesh", email: "priya.v@outlook.com", city: "Bengaluru", role: "Buyer", status: "Active", joined: "5 Jan 2024", listings: 0, spend: "₹62,400", subscription: "—" },
  { id: 3, name: "Rahul Gupta", email: "rahulg@rediffmail.com", city: "Delhi", role: "Seller", status: "Suspended", joined: "3 Nov 2023", listings: 6, spend: "₹9,800", subscription: "Monthly" },
  { id: 4, name: "Sneha Iyer", email: "sneha.iyer@gmail.com", city: "Chennai", role: "Admin", status: "Active", joined: "18 Jun 2023", listings: 0, spend: "—", subscription: "—" },
  { id: 5, name: "Vikram Patel", email: "vikram.p@gmail.com", city: "Ahmedabad", role: "Seller", status: "Active", joined: "22 Apr 2024", listings: 51, spend: "₹3,41,200", subscription: "Annual" },
  { id: 6, name: "Ananya Reddy", email: "ananya.r@gmail.com", city: "Hyderabad", role: "Buyer", status: "Pending", joined: "1 May 2024", listings: 0, spend: "₹4,900", subscription: "—" },
  { id: 7, name: "Deepak Nair", email: "deepak.nair@yahoo.in", city: "Kochi", role: "Seller", status: "Active", joined: "14 Feb 2024", listings: 18, spend: "₹98,700", subscription: "Monthly" },
  { id: 8, name: "Kavya Mishra", email: "kavya.m@gmail.com", city: "Lucknow", role: "Buyer", status: "Active", joined: "9 Mar 2024", listings: 0, spend: "₹21,300", subscription: "—" },
];

const publishedProducts = [
  {
    id: 1,
    name: "boAt Rockerz 450 Pro Bluetooth Headphones",
    category: "Electronics",
    price: "₹1,299",
    seller: "Arjun Sharma",
    sellerCity: "Mumbai",
    subscriptionPlan: "Annual",
    publishedOn: "24 May 2026",
    status: "Active",
    rating: 4.6,
    views: 2841,
    orders: 184,
  },
  {
    id: 2,
    name: "Fabindia Pure Cotton Kurta Set (Men)",
    category: "Fashion & Apparel",
    price: "₹1,890",
    seller: "Vikram Patel",
    sellerCity: "Ahmedabad",
    subscriptionPlan: "Annual",
    publishedOn: "22 May 2026",
    status: "Active",
    rating: 4.4,
    views: 1203,
    orders: 97,
  },
  {
    id: 3,
    name: "Prestige Iris 750W Mixer Grinder",
    category: "Home & Kitchen",
    price: "₹2,499",
    seller: "Deepak Nair",
    sellerCity: "Kochi",
    subscriptionPlan: "Annual",
    publishedOn: "20 May 2026",
    status: "Active",
    rating: 4.7,
    views: 3512,
    orders: 261,
  },
  {
    id: 4,
    name: "Himalaya Herbals Complete Care Kit",
    category: "Health & Beauty",
    price: "₹649",
    seller: "Arjun Sharma",
    sellerCity: "Mumbai",
    subscriptionPlan: "Annual",
    publishedOn: "18 May 2026",
    status: "Under Review",
    rating: 0,
    views: 89,
    orders: 0,
  },
  {
    id: 5,
    name: "Wildcraft 45L Trekking Backpack",
    category: "Sports & Outdoors",
    price: "₹2,199",
    seller: "Vikram Patel",
    sellerCity: "Ahmedabad",
    subscriptionPlan: "Annual",
    publishedOn: "15 May 2026",
    status: "Active",
    rating: 4.5,
    views: 1890,
    orders: 143,
  },
  {
    id: 6,
    name: "Noise ColorFit Pro 4 Smartwatch",
    category: "Electronics",
    price: "₹3,499",
    seller: "Rahul Gupta",
    sellerCity: "Delhi",
    subscriptionPlan: "Annual",
    publishedOn: "10 May 2026",
    status: "Rejected",
    rating: 0,
    views: 214,
    orders: 0,
  },
  {
    id: 7,
    name: "IKEA KALLAX Shelf Unit (White)",
    category: "Home & Kitchen",
    price: "₹7,990",
    seller: "Deepak Nair",
    sellerCity: "Kochi",
    subscriptionPlan: "Annual",
    publishedOn: "8 May 2026",
    status: "Active",
    rating: 4.8,
    views: 4201,
    orders: 312,
  },
  {
    id: 8,
    name: "Mamaearth Vitamin C Face Serum",
    category: "Health & Beauty",
    price: "₹549",
    seller: "Vikram Patel",
    sellerCity: "Ahmedabad",
    subscriptionPlan: "Annual",
    publishedOn: "5 May 2026",
    status: "Active",
    rating: 4.3,
    views: 2670,
    orders: 198,
  },
];

const transactions = [
  { id: "SUB-4421", user: "Arjun Sharma", city: "Mumbai", plan: "Annual", amount: "₹4,999", method: "Razorpay", status: "Completed", date: "27 May 2026", renewsOn: "27 May 2027" },
  { id: "SUB-4420", user: "Vikram Patel", city: "Ahmedabad", plan: "Annual", amount: "₹4,999", method: "UPI (GPay)", status: "Completed", date: "26 May 2026", renewsOn: "26 May 2027" },
  { id: "SUB-4419", user: "Deepak Nair", city: "Kochi", plan: "Monthly", amount: "₹499", method: "UPI (PhonePe)", status: "Completed", date: "25 May 2026", renewsOn: "25 Jun 2026" },
  { id: "SUB-4418", user: "Rahul Gupta", city: "Delhi", plan: "Monthly", amount: "₹499", method: "Razorpay", status: "Failed", date: "24 May 2026", renewsOn: "—" },
  { id: "SUB-4417", user: "Sneha Iyer", city: "Chennai", plan: "Annual", amount: "₹4,999", method: "Net Banking", status: "Completed", date: "22 May 2026", renewsOn: "22 May 2027" },
  { id: "SUB-4416", user: "Ananya Reddy", city: "Hyderabad", plan: "Monthly", amount: "₹499", method: "UPI (Paytm)", status: "Pending", date: "20 May 2026", renewsOn: "—" },
  { id: "SUB-4415", user: "Kavya Mishra", city: "Lucknow", plan: "Monthly", amount: "₹499", method: "Debit Card", status: "Completed", date: "18 May 2026", renewsOn: "18 Jun 2026" },
  { id: "SUB-4414", user: "Arjun Sharma", city: "Mumbai", plan: "Annual", amount: "₹4,999", method: "Razorpay", status: "Completed", date: "12 May 2026", renewsOn: "12 May 2027" },
];

const coupons = [
  { code: "WELCOME20", discount: "20% off", type: "Percentage", usage: "8,472 / 10,000", expires: "30 Jun 2026", status: "Active" },
  { code: "FLAT200", discount: "₹200 off", type: "Fixed", usage: "3,021 / 5,000", expires: "31 May 2026", status: "Active" },
  { code: "DIWALI30", discount: "30% off", type: "Percentage", usage: "10,000 / 10,000", expires: "5 Nov 2025", status: "Exhausted" },
  { code: "NAVUSER15", discount: "15% off", type: "Percentage", usage: "0 / 20,000", expires: "31 Dec 2026", status: "Scheduled" },
  { code: "HOLI50", discount: "50% off", type: "Percentage", usage: "500 / 500", expires: "26 Mar 2026", status: "Expired" },
];

const promotions = [
  { id: 1, title: "Monsoon Mega Sale Banner", type: "Banner", placement: "Home", status: "Live", impressions: "2,48,120", clicks: "32,914", startDate: "1 Jun 2026", endDate: "31 Aug 2026" },
  { id: 2, title: "New Arrivals Carousel", type: "Carousel", placement: "Category", status: "Live", impressions: "1,12,040", clicks: "18,503", startDate: "15 May 2026", endDate: "15 Jul 2026" },
  { id: 3, title: "App-Only Deal Pop-up", type: "Pop-up", placement: "Checkout", status: "Paused", impressions: "74,300", clicks: "8,921", startDate: "20 Apr 2026", endDate: "20 Jun 2026" },
  { id: 4, title: "Subscription Renewal Reminder", type: "Notification", placement: "Global", status: "Draft", impressions: "—", clicks: "—", startDate: "1 Jun 2026", endDate: "31 Aug 2026" },
];


const Badge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Suspended: "bg-red-50 text-red-600 border border-red-200",
    Pending: "bg-amber-50 text-amber-700 border border-amber-200",
    Completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Processing: "bg-blue-50 text-blue-700 border border-blue-200",
    Failed: "bg-red-50 text-red-600 border border-red-200",
    Refund: "bg-purple-50 text-purple-700 border border-purple-200",
    "Under Review": "bg-amber-50 text-amber-700 border border-amber-200",
    Rejected: "bg-red-50 text-red-600 border border-red-200",
    Live: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Paused: "bg-amber-50 text-amber-700 border border-amber-200",
    Draft: "bg-gray-100 text-gray-600 border border-gray-200",
    Exhausted: "bg-gray-100 text-gray-500 border border-gray-200",
    Scheduled: "bg-blue-50 text-blue-700 border border-blue-200",
    Expired: "bg-red-50 text-red-400 border border-red-100",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const StatCard = ({ icon, label, value, change, positive }: {
  icon: React.ReactNode; label: string; value: string; change: string; positive: boolean;
}) => (
  <div className="bg-white rounded-2xl p-5 border border-[rgba(51,44,90,0.08)] hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="p-2.5 rounded-xl" style={{ background: "#F0F2FF" }}>{icon}</div>
      <span className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-red-500"}`}>
        {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{change}
      </span>
    </div>
    <p className="text-2xl font-bold text-[#1a1530] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
    <p className="text-sm text-[#7a6e8a]">{label}</p>
  </div>
);

function CustomAreaChart({ data }: { data: typeof revenueData }) {
  const W = 600; const H = 200; const PL = 48; const PR = 16; const PT = 10; const PB = 28;
  const cW = W - PL - PR; const cH = H - PT - PB;
  const maxVal = Math.max(...data.map(d => d.revenue));
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(maxVal * t / 100000) * 100000);
  const xScale = (i: number) => PL + (i / (data.length - 1)) * cW;
  const yScale = (v: number) => PT + cH - (v / maxVal) * cH;
  const makePath = (key: "revenue" | "expenses") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${xScale(i).toFixed(1)},${yScale(d[key]).toFixed(1)}`).join(" ");
  const makeArea = (key: "revenue" | "expenses") => {
    const line = makePath(key);
    return `${line} L${xScale(data.length - 1).toFixed(1)},${(PT + cH).toFixed(1)} L${PL.toFixed(1)},${(PT + cH).toFixed(1)} Z`;
  };
  const [tooltip, setTooltip] = useState<{ x: number; y: number; idx: number } | null>(null);
  return (
    <div className="relative select-none">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}
        onMouseLeave={() => setTooltip(null)}
        onMouseMove={e => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const mx = ((e.clientX - rect.left) / rect.width) * W;
          const idx = Math.min(data.length - 1, Math.max(0, Math.round((mx - PL) / (cW / (data.length - 1)))));
          setTooltip({ x: xScale(idx), y: yScale(data[idx].revenue), idx });
        }}>
        {yTicks.map(t => (
          <g key={t}>
            <line x1={PL} x2={PL + cW} y1={yScale(t)} y2={yScale(t)} stroke="rgba(51,44,90,0.07)" strokeDasharray="3 3" />
            <text x={PL - 6} y={yScale(t) + 4} textAnchor="end" fontSize={10} fill="#7a6e8a">₹{(t / 100000).toFixed(0)}L</text>
          </g>
        ))}

        {data.map((d, i) => (
          <text key={d.month} x={xScale(i)} y={H - 6} textAnchor="middle" fontSize={10} fill="#7a6e8a">{d.month}</text>
        ))}
        <path d={makeArea("expenses")} fill={ORANGE} fillOpacity={0.1} />
        <path d={makeArea("revenue")} fill={ACCENT} fillOpacity={0.12} />
        <path d={makePath("expenses")} fill="none" stroke={ORANGE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={makePath("revenue")} fill="none" stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {tooltip && (
          <>
            <line x1={tooltip.x} x2={tooltip.x} y1={PT} y2={PT + cH} stroke="rgba(51,44,90,0.15)" strokeWidth={1} strokeDasharray="4 2" />
            <circle cx={tooltip.x} cy={yScale(data[tooltip.idx].revenue)} r={4} fill={ACCENT} stroke="white" strokeWidth={2} />
            <circle cx={tooltip.x} cy={yScale(data[tooltip.idx].expenses)} r={4} fill={ORANGE} stroke="white" strokeWidth={2} />
            <rect x={Math.min(tooltip.x + 8, W - 130)} y={yScale(data[tooltip.idx].revenue) - 36} width={118} height={48} rx={8} fill="white" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.12))" />
            <text x={Math.min(tooltip.x + 17, W - 121)} y={yScale(data[tooltip.idx].revenue) - 20} fontSize={10} fill="#7a6e8a">{data[tooltip.idx].month}</text>
            <text x={Math.min(tooltip.x + 17, W - 121)} y={yScale(data[tooltip.idx].revenue) - 6} fontSize={10} fill={ACCENT}>Rev: ₹{(data[tooltip.idx].revenue / 100000).toFixed(1)}L</text>
            <text x={Math.min(tooltip.x + 17, W - 121)} y={yScale(data[tooltip.idx].revenue) + 8} fontSize={10} fill={ORANGE}>Exp: ₹{(data[tooltip.idx].expenses / 100000).toFixed(1)}L</text>
          </>
        )}
      </svg>
    </div>
  );
}

function CustomBarChart({ data }: { data: typeof financialBarData }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; idx: number } | null>(null);
  const W = 560; const H = 220; const PL = 52; const PR = 12; const PT = 10; const PB = 28;
  const cW = W - PL - PR; const cH = H - PT - PB;
  const maxVal = Math.max(...data.map(d => Math.max(d.rev, d.exp)));
  const groupW = cW / data.length;
  const barW = Math.min(groupW * 0.32, 18);
  const gap = barW * 0.4;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({ val: maxVal * f, y: PT + cH - f * cH }));
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {yTicks.map(t => (
          <g key={t.val}>
            <line x1={PL} x2={W - PR} y1={t.y} y2={t.y} stroke="rgba(51,44,90,0.07)" strokeDasharray="3 3" />
            <text x={PL - 6} y={t.y + 4} fontSize={10} fill="#7a6e8a" textAnchor="end">₹{(t.val / 100000).toFixed(0)}L</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = PL + i * groupW + groupW / 2;
          const revH = (d.rev / maxVal) * cH;
          const revX = cx - barW / 2;
          return (
            <g key={d.month} onMouseEnter={() => setTooltip({ x: cx, y: PT + cH - revH, idx: i })} onMouseLeave={() => setTooltip(null)} style={{ cursor: "pointer" }}>
              <rect x={revX} y={PT + cH - revH} width={barW} height={revH} fill={ACCENT} rx={4} />
              <text x={cx} y={H - 6} fontSize={10} fill="#7a6e8a" textAnchor="middle">{d.month}</text>
            </g>
          );
        })}
        {tooltip && (
          <>
            <rect x={Math.min(tooltip.x + 8, W - 120)} y={tooltip.y - 4} width={108} height={28} rx={8} fill="white" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.12))" />
            <text x={Math.min(tooltip.x + 17, W - 111)} y={tooltip.y + 14} fontSize={10} fill={ACCENT}>Rev: ₹{(data[tooltip.idx].rev / 100000).toFixed(1)}L</text>
          </>
        )}
      </svg>
      <div className="flex gap-5 mt-2">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: ACCENT }} /><span className="text-xs text-[#7a6e8a]">Revenue</span></div>
      </div>
    </div>
  );
}

function CustomDonutChart({ data }: { data: typeof categoryData }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = 80; const cy = 80; const R = 60; const r = 38;
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const gap = 0.04;
    const sa = startAngle + gap; const ea = endAngle - gap;
    const outerR = hovered === i ? R + 5 : R;
    const x1 = cx + outerR * Math.cos(sa); const y1 = cy + outerR * Math.sin(sa);
    const x2 = cx + outerR * Math.cos(ea); const y2 = cy + outerR * Math.sin(ea);
    const x3 = cx + r * Math.cos(ea); const y3 = cy + r * Math.sin(ea);
    const x4 = cx + r * Math.cos(sa); const y4 = cy + r * Math.sin(sa);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    return { ...d, path, index: i };
  });
  return (
    <div className="flex justify-center">
      <svg width={160} height={160} viewBox="0 0 160 160">
        {slices.map((s) => (
          <path key={s.name} d={s.path} fill={s.color} opacity={hovered === null || hovered === s.index ? 1 : 0.5}
            style={{ cursor: "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={() => setHovered(s.index)} onMouseLeave={() => setHovered(null)} />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={13} fontWeight={600} fill="#1a1530">
          {hovered !== null ? `${data[hovered].value}%` : `${total}%`}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill="#7a6e8a">
          {hovered !== null ? data[hovered].name.split(" ")[0] : "Total"}
        </text>
      </svg>
    </div>
  );
}


function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Dashboard Overview</h1>
          <p className="text-sm text-[#7a6e8a] mt-0.5">Wednesday, 27 May 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<IndianRupee size={18} color={ACCENT} />} label="Total Revenue" value="₹91.2L" change="+14.2%" positive />
        <StatCard icon={<Users size={18} color={ACCENT} />} label="Total Users" value="1,28,470" change="+8.1%" positive />
        <StatCard icon={<Package size={18} color={ACCENT} />} label="Active Listings" value="5,084" change="+6.2%" positive />
        <StatCard icon={<Coins size={18} color={ACCENT} />} label="Subscriptions (Today)" value="4,950" change="+21.3%" positive />
      </div>


      <div className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(51,44,90,0.07)]">
          <h3 className="font-bold text-[#1a1530]">Recent Subscription Transactions</h3>
          <button className="text-xs font-semibold" style={{ color: ACCENT }}>View all →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[#7a6e8a] uppercase tracking-wide bg-[#faf6f2]">
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Txn ID</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Seller</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Plan</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Amount</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Method</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Status</th>
                <th className="px-5 py-3 text-left font-medium whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(tx => (
                <tr key={tx.id} className="border-t border-[rgba(51,44,90,0.05)] hover:bg-[#faf6f2] transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-[#7a6e8a]">{tx.id}</td>
                  <td className="px-5 py-3 font-medium text-[#1a1530] whitespace-nowrap">{tx.user}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                      style={{ background: tx.plan === "Annual" ? "#F0F2FF" : "#FFF5EC", color: tx.plan === "Annual" ? ACCENT : ORANGE }}>
                      {tx.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-[#1a1530]">{tx.amount}</td>
                  <td className="px-5 py-3 text-[#7a6e8a] text-xs whitespace-nowrap">{tx.method}</td>
                  <td className="px-5 py-3"><Badge status={tx.status} /></td>
                  <td className="px-5 py-3 text-[#7a6e8a] text-xs whitespace-nowrap">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [usersData, setUsersData] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [viewingUser, setViewingUser] = useState<AppUser | null>(null);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editDraft, setEditDraft] = useState({ status: "", subscription: "" });
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  const [addDraft, setAddDraft] = useState({ name: "", phone: "", city: "", status: "Active" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingUsers(true);
      fetch(`${API_BASE}/admin/users?search=${encodeURIComponent(search)}&limit=50`, {
        headers: authHeaders(),
      })
        .then(r => r.json())
        .then(d => setUsersData(d.users ?? []))
        .catch(console.error)
        .finally(() => setLoadingUsers(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>User Management</h1>
          <p className="text-sm text-[#7a6e8a] mt-0.5">{usersData.length} registered users</p>
        </div>
        <button onClick={() => { setAddDraft({ name: "", email: "", city: "", status: "Active", subscription: "—" }); setAddingUser(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: ORANGE }}>
          <Plus size={15} /> Add User
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Users", value: usersData.filter(u => u.status === "Active").length, icon: <UserCheck size={16} color={ACCENT} /> },
          { label: "Suspended", value: usersData.filter(u => u.status === "Suspended").length, icon: <UserX size={16} color="#d4183d" /> },
          { label: "Pending Verification", value: usersData.filter(u => u.status === "Pending").length, icon: <AlertCircle size={16} color={ORANGE} /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-[rgba(51,44,90,0.08)] flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-[#F0F2FF]">{s.icon}</div>
            <div>
              <p className="text-xl font-bold text-[#1a1530]">{s.value}</p>
              <p className="text-xs text-[#7a6e8a]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)]">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(51,44,90,0.07)]">
          <div className="flex items-center gap-2 flex-1 bg-[#f5ebe2] rounded-xl px-3 py-2.5">
            <Search size={15} className="text-[#7a6e8a]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or city…" className="bg-transparent text-sm outline-none flex-1 text-[#1a1530] placeholder-[#7a6e8a]" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.12)] text-sm text-[#7a6e8a] hover:bg-[#f5ebe2]">
            <Filter size={14} /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[#7a6e8a] uppercase tracking-wide bg-[#faf6f2]">
                {["User", "City", "Status", "Joined", "Listings", "Subscription", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-[#7a6e8a]">Loading users…</td></tr>
              ) : usersData.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-[#7a6e8a]">No users found</td></tr>
              ) : usersData.map(u => (
                <tr key={u.id} className="border-t border-[rgba(51,44,90,0.05)] hover:bg-[#faf6f2] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: ACCENT }}>
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1530] whitespace-nowrap">{u.business_name || u.name}</p>
                        <p className="text-xs text-[#7a6e8a]">{u.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-[#7a6e8a]">
                      <MapPin size={11} /><span className="text-xs">{u.city || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><Badge status={u.status} /></td>
                  <td className="px-5 py-3.5 text-[#7a6e8a] text-xs whitespace-nowrap">{u.joined}</td>
                  <td className="px-5 py-3.5 font-medium text-[#1a1530]">{u.listings}</td>
                  <td className="px-5 py-3.5">
                    {u.subscription !== "none" ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: u.subscription === "Annual" ? "#F0F2FF" : "rgba(238,168,108,0.12)", color: u.subscription === "Annual" ? ACCENT : ORANGE }}>{u.subscription}</span>
                    ) : <span className="text-xs text-[#7a6e8a]">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-[#F0F2FF]" onClick={() => setViewingUser(u)}><Eye size={14} color={ACCENT} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-[#F0F2FF]" onClick={() => { setEditingUser(u); setEditDraft({ status: u.status, subscription: u.subscription }); }}><Edit2 size={14} color={ACCENT} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50" onClick={() => setDeletingUser(u)}><Trash2 size={14} color="#d4183d" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {addingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(51,44,90,0.08)]" style={{ background: "rgba(238,168,108,0.08)" }}>
              <h3 className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add New User</h3>
              <button onClick={() => setAddingUser(false)} className="p-1.5 rounded-lg hover:bg-[rgba(51,44,90,0.06)]"><XCircle size={18} color="#7a6e8a" /></button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "e.g. Ravi Kumar" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "e.g. 9876543210" },
                { label: "City", key: "city", type: "text", placeholder: "e.g. Pune" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={addDraft[f.key as keyof typeof addDraft]}
                    onChange={e => setAddDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Status</label>
                <select value={addDraft.status} onChange={e => setAddDraft(d => ({ ...d, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none">
                  {["Active", "Suspended", "Pending"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setAddingUser(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2]">Cancel</button>
              <button disabled={!addDraft.name || !addDraft.phone} onClick={async () => {
                const res = await fetch(`${API_BASE}/app/auth/register`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: addDraft.name, phone: addDraft.phone, password: "Temp@1234" }),
                });
                const data = await res.json();
                if (res.ok || res.status === 409) {
                  const refresh = await fetch(`${API_BASE}/admin/users?limit=50`, { headers: authHeaders() });
                  const d = await refresh.json();
                  setUsersData(d.users ?? []);
                } else {
                  alert(data.error || "Failed to add user");
                }
                setAddingUser(false);
              }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40" style={{ background: ORANGE }}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(51,44,90,0.08)]" style={{ background: "#F0F2FF" }}>
              <h3 className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>User Profile</h3>
              <button onClick={() => setViewingUser(null)} className="p-1.5 rounded-lg hover:bg-[rgba(51,44,90,0.06)]"><XCircle size={18} color="#7a6e8a" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ background: ACCENT }}>
                  {viewingUser.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-bold text-[#1a1530]">{viewingUser.business_name || viewingUser.name}</p>
                  <p className="text-xs text-[#7a6e8a]">{viewingUser.phone}</p>
                </div>
              </div>
              {[
                { label: "City", value: viewingUser.city || "—" },
                { label: "Category", value: viewingUser.category || "—" },
                { label: "Status", value: viewingUser.status },
                { label: "Joined", value: viewingUser.joined },
                { label: "Listings", value: String(viewingUser.listings) },
                { label: "Subscription", value: viewingUser.subscription === "none" ? "—" : viewingUser.subscription },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-[rgba(51,44,90,0.06)]">
                  <span className="text-xs text-[#7a6e8a]">{row.label}</span>
                  <span className="text-sm font-medium text-[#1a1530]">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5">
              <button onClick={() => setViewingUser(null)} className="w-full px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: ACCENT }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(51,44,90,0.08)]" style={{ background: "rgba(238,168,108,0.08)" }}>
              <h3 className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="p-1.5 rounded-lg hover:bg-[rgba(51,44,90,0.06)]"><XCircle size={18} color="#7a6e8a" /></button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Status</label>
                <select value={editDraft.status} onChange={e => setEditDraft(d => ({ ...d, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none">
                  {["Active", "Suspended", "Pending"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Subscription</label>
                <select value={editDraft.subscription} onChange={e => setEditDraft(d => ({ ...d, subscription: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none">
                  {["none", "Monthly", "Annual"].map(s => <option key={s} value={s}>{s === "none" ? "— (None)" : s}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setEditingUser(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2]">Cancel</button>
              <button onClick={async () => {
                if (!editingUser) return;
                const res = await fetch(`${API_BASE}/admin/users/${editingUser.id}`, {
                  method: "PATCH",
                  headers: authHeaders(),
                  body: JSON.stringify(editDraft),
                });
                const data = await res.json();
                if (res.ok) {
                  setUsersData(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...data.user } : u));
                  setEditingUser(null);
                }
              }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: ORANGE }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-5 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} color="#d4183d" />
              </div>
              <h3 className="font-bold text-[#1a1530] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete User</h3>
              <p className="text-sm text-[#7a6e8a]">Are you sure you want to delete <strong className="text-[#1a1530]">{deletingUser.name}</strong>? This action cannot be undone.</p>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setDeletingUser(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2]">Cancel</button>
              <button onClick={async () => {
                if (!deletingUser) return;
                const res = await fetch(`${API_BASE}/admin/users/${deletingUser.id}`, {
                  method: "DELETE",
                  headers: authHeaders(),
                });
                if (res.ok) {
                  setUsersData(prev => prev.filter(u => u.id !== deletingUser.id));
                  setDeletingUser(null);
                }
              }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: "#d4183d" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductManagementPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [productsData, setProductsData] = useState(publishedProducts);
  const [viewingProduct, setViewingProduct] = useState<typeof publishedProducts[0] | null>(null);
  const [editingProduct, setEditingProduct] = useState<typeof publishedProducts[0] | null>(null);
  const [editDraft, setEditDraft] = useState({ name: "", price: "", seller: "", sellerCity: "", subscriptionPlan: "Monthly" });
  const [deletingProduct, setDeletingProduct] = useState<typeof publishedProducts[0] | null>(null);

  const statuses = ["All", "Active", "Under Review", "Rejected"];
  const filtered = productsData.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Product Management</h1>
          <p className="text-sm text-[#7a6e8a] mt-0.5">Products published by sellers via subscription</p>
        </div>
      </div>


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Listings", value: "12,841", color: ACCENT },
          { label: "Active Products", value: "10,912", color: "#059669" },
          { label: "Under Review", value: "482", color: ORANGE },
          { label: "Rejected", value: "147", color: "#d4183d" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-[rgba(51,44,90,0.08)]">
            <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</p>
            <p className="text-xs text-[#7a6e8a] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)]">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(51,44,90,0.07)]">
          <div className="flex items-center gap-2 flex-1 bg-[#f5ebe2] rounded-xl px-3 py-2.5">
            <Search size={15} className="text-[#7a6e8a]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search product, seller or category…" className="bg-transparent text-sm outline-none flex-1 text-[#1a1530] placeholder-[#7a6e8a]" />
          </div>
          <div className="flex gap-1 p-1 rounded-xl border border-[rgba(51,44,90,0.12)] bg-[#faf6f2]">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={statusFilter === s ? { background: ACCENT, color: "#fff" } : { color: "#7a6e8a" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[#7a6e8a] uppercase tracking-wide bg-[#faf6f2]">
                {["Product", "Price", "Seller", "Subscription", "Published On", "Rating", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-[rgba(51,44,90,0.05)] hover:bg-[#faf6f2] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F0F2FF" }}>
                        <Package size={16} color={ACCENT} />
                      </div>
                      <p className="font-semibold text-[#1a1530] max-w-[180px] truncate">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-[#1a1530]">{p.price}</td>
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-medium text-[#1a1530] text-xs whitespace-nowrap">{p.seller}</p>
                      <div className="flex items-center gap-1 text-[#7a6e8a]">
                        <MapPin size={9} /><span className="text-xs">{p.sellerCity}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: p.subscriptionPlan === "Annual" ? "#F0F2FF" : "rgba(238,168,108,0.12)", color: p.subscriptionPlan === "Annual" ? ACCENT : ORANGE }}>{p.subscriptionPlan}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[#7a6e8a] text-xs whitespace-nowrap">{p.publishedOn}</td>
                  <td className="px-4 py-3.5">
                    {p.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star size={12} fill={ORANGE} color={ORANGE} />
                        <span className="text-xs font-medium text-[#1a1530]">{p.rating}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#7a6e8a]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5"><Badge status={p.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-lg hover:bg-[#F0F2FF]" title="View" onClick={() => setViewingProduct(p)}><Eye size={13} color={ACCENT} /></button>
                      {p.status === "Under Review" && (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50" title="Approve" onClick={() => setProductsData(prev => prev.map(x => x.id === p.id ? { ...x, status: "Active" } : x))}><CheckCircle size={13} color="#059669" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50" title="Reject" onClick={() => setProductsData(prev => prev.map(x => x.id === p.id ? { ...x, status: "Rejected" } : x))}><XCircle size={13} color="#d4183d" /></button>
                        </>
                      )}
                      {p.status !== "Under Review" && (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-[#F0F2FF]" title="Edit" onClick={() => { setEditingProduct(p); setEditDraft({ name: p.name, price: p.price, seller: p.seller, sellerCity: p.sellerCity, subscriptionPlan: p.subscriptionPlan }); }}><Edit2 size={13} color={ACCENT} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50" title="Delete" onClick={() => setDeletingProduct(p)}><Trash2 size={13} color="#d4183d" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(51,44,90,0.08)]" style={{ background: "#F0F2FF" }}>
              <h3 className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Product Details</h3>
              <button onClick={() => setViewingProduct(null)} className="p-1.5 rounded-lg hover:bg-[rgba(51,44,90,0.06)]"><XCircle size={18} color="#7a6e8a" /></button>
            </div>
            <div className="px-6 py-5 space-y-0">
              {[
                { label: "Name", value: viewingProduct.name },
                { label: "Price", value: viewingProduct.price },
                { label: "Seller", value: viewingProduct.seller },
                { label: "City", value: viewingProduct.sellerCity },
                { label: "Plan", value: viewingProduct.subscriptionPlan },
                { label: "Published On", value: viewingProduct.publishedOn },
                { label: "Rating", value: viewingProduct.rating > 0 ? `${viewingProduct.rating} ★` : "—" },
                { label: "Status", value: viewingProduct.status },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-[rgba(51,44,90,0.06)]">
                  <span className="text-xs text-[#7a6e8a]">{row.label}</span>
                  <span className="text-sm font-medium text-[#1a1530] text-right max-w-[60%]">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 pt-3">
              <button onClick={() => setViewingProduct(null)} className="w-full px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: ACCENT }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(51,44,90,0.08)]" style={{ background: "rgba(238,168,108,0.08)" }}>
              <h3 className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1.5 rounded-lg hover:bg-[rgba(51,44,90,0.06)]"><XCircle size={18} color="#7a6e8a" /></button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[
                { label: "Product Name", key: "name" },
                { label: "Price", key: "price" },
                { label: "Seller", key: "seller" },
                { label: "Seller City", key: "sellerCity" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">{f.label}</label>
                  <input value={editDraft[f.key as keyof typeof editDraft]} onChange={e => setEditDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Subscription Plan</label>
                <select value={editDraft.subscriptionPlan} onChange={e => setEditDraft(d => ({ ...d, subscriptionPlan: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none">
                  <option>Monthly</option><option>Annual</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setEditingProduct(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2]">Cancel</button>
              <button onClick={() => {
                setProductsData(prev => prev.map(x => x.id === editingProduct.id ? { ...x, ...editDraft } : x));
                setEditingProduct(null);
              }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: ORANGE }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-5 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} color="#d4183d" /></div>
              <h3 className="font-bold text-[#1a1530] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete Product</h3>
              <p className="text-sm text-[#7a6e8a]">Are you sure you want to delete <strong className="text-[#1a1530]">{deletingProduct.name}</strong>? This cannot be undone.</p>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setDeletingProduct(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2]">Cancel</button>
              <button onClick={() => {
                setProductsData(prev => prev.filter(x => x.id !== deletingProduct.id));
                setDeletingProduct(null);
              }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: "#d4183d" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FinancialPage({ sub }: { sub: string }) {
  const [activeSub, setActiveSub] = useState(sub);
  const [monthlyPlan, setMonthlyPlan] = useState({ price: "499", ads: "5" });
  const [annualPlan, setAnnualPlan] = useState({ price: "4999", ads: "60" });
  const [editingPlan, setEditingPlan] = useState<null | "monthly" | "annual">(null);
  const [editDraft, setEditDraft] = useState({ price: "", ads: "" });
  const [couponsData, setCouponsData] = useState(coupons);
  const [editingCoupon, setEditingCoupon] = useState<null | typeof coupons[0]>(null);
  const [couponDraft, setCouponDraft] = useState({ code: "", discount: "", expires: "" });
  const [addingCoupon, setAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "", type: "Percentage", usageLimit: "", expires: "" });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Financial Management</h1>
        <p className="text-sm text-[#7a6e8a] mt-0.5">Monitor revenue, transactions, and coupons</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl border border-[rgba(51,44,90,0.12)] bg-white w-fit">
        {[["Dashboard", "dashboard"], ["Subscriptions", "subscriptions"], ["Transactions", "transactions"], ["Coupons", "coupons"]].map(([label, val]) => (
          <button key={val} onClick={() => setActiveSub(val)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={activeSub === val ? { background: ACCENT, color: "#fff" } : { color: "#7a6e8a" }}>
            {label}
          </button>
        ))}
      </div>

      {activeSub === "dashboard" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-[rgba(51,44,90,0.08)]">
            <h3 className="font-bold text-[#1a1530] mb-5">Monthly Revenue Trend</h3>
            <CustomBarChart data={financialBarData} />
          </div>
        </div>
      )}

      {activeSub === "subscriptions" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)] overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between" style={{ background: "rgba(238,168,108,0.08)", borderBottom: "1px solid rgba(238,168,108,0.2)" }}>
                <div>
                  <p className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Monthly Plan</p>
                  <p className="text-xs text-[#7a6e8a] mt-0.5">{monthlyPlan.ads} ads per month</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: ORANGE, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{Number(monthlyPlan.price).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-[#7a6e8a]">per month</p>
                  </div>
                  <button onClick={() => { setEditingPlan("monthly"); setEditDraft({ price: monthlyPlan.price, ads: monthlyPlan.ads }); }}
                    className="p-2 rounded-xl hover:bg-[rgba(238,168,108,0.15)] transition-colors" title="Edit plan">
                    <Edit2 size={15} color={ORANGE} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)] overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between" style={{ background: "#F0F2FF", borderBottom: "1px solid rgba(56,69,171,0.15)" }}>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Annual Plan</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: ACCENT }}>Best Value</span>
                  </div>
                  <p className="text-xs text-[#7a6e8a] mt-0.5">{annualPlan.ads} ads per year</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: ACCENT, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{Number(annualPlan.price).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-[#7a6e8a]">per year</p>
                  </div>
                  <button onClick={() => { setEditingPlan("annual"); setEditDraft({ price: annualPlan.price, ads: annualPlan.ads }); }}
                    className="p-2 rounded-xl hover:bg-[rgba(56,69,171,0.1)] transition-colors" title="Edit plan">
                    <Edit2 size={15} color={ACCENT} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {editingPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(51,44,90,0.08)]" style={{ background: editingPlan === "monthly" ? "rgba(238,168,108,0.08)" : "#F0F2FF" }}>
                  <h3 className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Edit {editingPlan === "monthly" ? "Monthly" : "Annual"} Plan
                  </h3>
                  <button onClick={() => setEditingPlan(null)} className="p-1.5 rounded-lg hover:bg-[rgba(51,44,90,0.06)]">
                    <XCircle size={18} color="#7a6e8a" />
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Price (₹)</label>
                    <input type="number" value={editDraft.price} onChange={e => setEditDraft(d => ({ ...d, price: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none focus:border-[rgba(51,44,90,0.4)]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Number of Ads</label>
                    <input type="number" value={editDraft.ads} onChange={e => setEditDraft(d => ({ ...d, ads: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none focus:border-[rgba(51,44,90,0.4)]" />
                  </div>
                </div>
                <div className="px-6 pb-5 flex gap-3">
                  <button onClick={() => setEditingPlan(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2] transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => {
                    if (editingPlan === "monthly") setMonthlyPlan({ price: editDraft.price, ads: editDraft.ads });
                    else setAnnualPlan({ price: editDraft.price, ads: editDraft.ads });
                    setEditingPlan(null);
                  }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{ background: editingPlan === "monthly" ? ORANGE : ACCENT }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)]">
            <div className="px-5 py-4 border-b border-[rgba(51,44,90,0.07)] flex items-center justify-between">
              <h3 className="font-bold text-[#1a1530]">Recent Subscriptions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-[#7a6e8a] uppercase tracking-wide bg-[#faf6f2]">
                    {["Seller", "City", "Plan", "Amount Paid", "Ads Remaining", "Subscribed On", "Renewal", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Arjun Sharma", city: "Mumbai", plan: "Annual", amount: "₹4,999", adsLeft: "48 / 60", subscribed: "1 Jan 2026", renewal: "31 Dec 2026", status: "Active" },
                    { name: "Vikram Patel", city: "Ahmedabad", plan: "Annual", amount: "₹4,999", adsLeft: "9 / 60", subscribed: "15 Feb 2026", renewal: "14 Feb 2027", status: "Active" },
                    { name: "Deepak Nair", city: "Kochi", plan: "Monthly", amount: "₹499", adsLeft: "2 / 5", subscribed: "1 May 2026", renewal: "1 Jun 2026", status: "Active" },
                    { name: "Rahul Gupta", city: "Delhi", plan: "Monthly", amount: "₹499", adsLeft: "0 / 5", subscribed: "1 Apr 2026", renewal: "1 May 2026", status: "Expired" },
                    { name: "Meera Joshi", city: "Pune", plan: "Annual", amount: "₹4,999", adsLeft: "55 / 60", subscribed: "20 May 2026", renewal: "19 May 2027", status: "Active" },
                    { name: "Suresh Kumar", city: "Coimbatore", plan: "Monthly", amount: "₹499", adsLeft: "3 / 5", subscribed: "10 May 2026", renewal: "10 Jun 2026", status: "Active" },
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-[rgba(51,44,90,0.05)] hover:bg-[#faf6f2] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: ACCENT }}>
                            {row.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="font-semibold text-[#1a1530] whitespace-nowrap">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#7a6e8a]">
                        <div className="flex items-center gap-1"><MapPin size={10} />{row.city}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: row.plan === "Annual" ? "#F0F2FF" : "rgba(238,168,108,0.12)", color: row.plan === "Annual" ? ACCENT : ORANGE }}>{row.plan}</span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-[#1a1530]">{row.amount}</td>
                      <td className="px-5 py-3.5 text-xs text-[#7a6e8a]">{row.adsLeft}</td>
                      <td className="px-5 py-3.5 text-xs text-[#7a6e8a] whitespace-nowrap">{row.subscribed}</td>
                      <td className="px-5 py-3.5 text-xs text-[#7a6e8a] whitespace-nowrap">{row.renewal}</td>
                      <td className="px-5 py-3.5"><Badge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSub === "transactions" && (
        <div className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)]">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(51,44,90,0.07)]">
            <div className="flex items-center gap-2 flex-1 bg-[#f5ebe2] rounded-xl px-3 py-2.5">
              <Search size={15} className="text-[#7a6e8a]" />
              <input placeholder="Search subscription transactions…" className="bg-transparent text-sm outline-none flex-1 text-[#1a1530] placeholder-[#7a6e8a]" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#7a6e8a] uppercase tracking-wide bg-[#faf6f2]">
                  {["Txn ID", "Seller", "City", "Plan", "Amount", "Payment Method", "Status", "Subscribed On", "Renews On", ""].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-t border-[rgba(51,44,90,0.05)] hover:bg-[#faf6f2]">
                    <td className="px-5 py-3.5 font-mono text-xs text-[#7a6e8a]">{tx.id}</td>
                    <td className="px-5 py-3.5 font-medium text-[#1a1530] whitespace-nowrap">{tx.user}</td>
                    <td className="px-5 py-3.5 text-xs text-[#7a6e8a] whitespace-nowrap">{tx.city}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap"
                        style={{ background: tx.plan === "Annual" ? "#F0F2FF" : "#FFF5EC", color: tx.plan === "Annual" ? ACCENT : ORANGE }}>
                        {tx.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#1a1530]">{tx.amount}</td>
                    <td className="px-5 py-3.5 text-xs text-[#7a6e8a] whitespace-nowrap">{tx.method}</td>
                    <td className="px-5 py-3.5"><Badge status={tx.status} /></td>
                    <td className="px-5 py-3.5 text-[#7a6e8a] text-xs whitespace-nowrap">{tx.date}</td>
                    <td className="px-5 py-3.5 text-[#7a6e8a] text-xs whitespace-nowrap">{tx.renewsOn}</td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 rounded-lg hover:bg-[#F0F2FF]"><Eye size={14} color={ACCENT} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSub === "coupons" && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <button onClick={() => { setNewCoupon({ code: "", discount: "", type: "Percentage", usageLimit: "", expires: "" }); setAddingCoupon(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: ORANGE }}>
              <Plus size={15} /> Create Coupon
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-[#7a6e8a] uppercase tracking-wide bg-[#faf6f2]">
                    {["Code", "Discount", "Type", "Usage", "Expires", "Status", "Actions"].map(h => (
                      <th key={h} className="px-5 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {couponsData.map(c => (
                    <tr key={c.code} className="border-t border-[rgba(51,44,90,0.05)] hover:bg-[#faf6f2]">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-sm font-bold px-2.5 py-1 rounded-lg" style={{ background: "#F0F2FF", color: ACCENT }}>{c.code}</span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-[#1a1530]">{c.discount}</td>
                      <td className="px-5 py-3.5 text-[#7a6e8a] text-xs">{c.type}</td>
                      <td className="px-5 py-3.5 text-[#7a6e8a] text-xs">{c.usage}</td>
                      <td className="px-5 py-3.5 text-[#7a6e8a] text-xs whitespace-nowrap">{c.expires}</td>
                      <td className="px-5 py-3.5"><Badge status={c.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-red-50" onClick={() => setCouponsData(prev => prev.filter(x => x.code !== c.code))}><Trash2 size={14} color="#d4183d" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {addingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(51,44,90,0.08)]" style={{ background: "rgba(238,168,108,0.08)" }}>
              <h3 className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create Coupon</h3>
              <button onClick={() => setAddingCoupon(false)} className="p-1.5 rounded-lg hover:bg-[rgba(51,44,90,0.06)]"><XCircle size={18} color="#7a6e8a" /></button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Coupon Code</label>
                <input value={newCoupon.code} onChange={e => setNewCoupon(d => ({ ...d, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SAVE20" className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none font-mono uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Discount</label>
                  <input value={newCoupon.discount} onChange={e => setNewCoupon(d => ({ ...d, discount: e.target.value }))}
                    placeholder="e.g. 20% off" className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Type</label>
                  <select value={newCoupon.type} onChange={e => setNewCoupon(d => ({ ...d, type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none">
                    <option>Percentage</option>
                    <option>Fixed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Usage Limit</label>
                  <input value={newCoupon.usageLimit} onChange={e => setNewCoupon(d => ({ ...d, usageLimit: e.target.value }))}
                    placeholder="e.g. 1000" className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Expiry Date</label>
                  <input value={newCoupon.expires} onChange={e => setNewCoupon(d => ({ ...d, expires: e.target.value }))}
                    placeholder="e.g. 31 Dec 2026" className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setAddingCoupon(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2]">Cancel</button>
              <button disabled={!newCoupon.code || !newCoupon.discount} onClick={() => {
                setCouponsData(prev => [{ code: newCoupon.code, discount: newCoupon.discount, type: newCoupon.type, usage: `0 / ${newCoupon.usageLimit || "∞"}`, expires: newCoupon.expires || "—", status: "Active" }, ...prev]);
                setAddingCoupon(false);
              }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40" style={{ background: ORANGE }}>
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PromotionsPage() {
  const [showNewModal, setShowNewModal] = useState(false);
  const [draft, setDraft] = useState({ title: "", type: "Banner", placement: "Home", startDate: "", endDate: "" });
  const [promotionsData, setPromotionsData] = useState(promotions);
  const [editingPromo, setEditingPromo] = useState<typeof promotions[0] | null>(null);
  const [editDraft, setEditDraft] = useState({ title: "", type: "Banner", placement: "Home", startDate: "", endDate: "" });
  const [deletingPromo, setDeletingPromo] = useState<typeof promotions[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>In-App Promotions</h1>
          <p className="text-sm text-[#7a6e8a] mt-0.5">Manage banners, carousels, and pop-ups</p>
        </div>
        <button onClick={() => { setDraft({ title: "", type: "Banner", placement: "Home", startDate: "", endDate: "" }); setShowNewModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: ORANGE }}>
          <Plus size={15} /> New Promotion
        </button>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(51,44,90,0.08)]" style={{ background: "rgba(238,168,108,0.08)" }}>
              <h3 className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New Promotion</h3>
              <button onClick={() => setShowNewModal(false)} className="p-1.5 rounded-lg hover:bg-[rgba(51,44,90,0.06)]">
                <XCircle size={18} color="#7a6e8a" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Media</label>
                <label className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-[rgba(51,44,90,0.2)] bg-[#f5ebe2] cursor-pointer hover:border-[rgba(56,69,171,0.4)] transition-colors">
                  <ImageIcon size={22} color="#7a6e8a" />
                  <span className="text-xs text-[#7a6e8a]">Click to upload image <span className="text-[#3845AB] font-medium">or drag & drop</span></span>
                  <span className="text-xs text-[#b0a8d0]">PNG, JPG, GIF up to 5MB</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Title</label>
                <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="e.g. Monsoon Sale Banner"
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Type</label>
                  <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none">
                    {["Banner", "Carousel", "Pop-up", "Notification"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Placement</label>
                  <select value={draft.placement} onChange={e => setDraft(d => ({ ...d, placement: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none">
                    {["Home", "Category", "Checkout", "Global"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Start Date</label>
                  <input type="date" value={draft.startDate} onChange={e => setDraft(d => ({ ...d, startDate: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">End Date</label>
                  <input type="date" value={draft.endDate} onChange={e => setDraft(d => ({ ...d, endDate: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setShowNewModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2] transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowNewModal(false)} disabled={!draft.title}
                className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                style={{ background: ORANGE }}>
                Create Promotion
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="grid gap-4">
        {promotionsData.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)] p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F0F2FF" }}>
                  <ImageIcon size={20} color={ACCENT} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#1a1530]">{p.title}</h3>
                    <Badge status={p.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#7a6e8a]">
                    <span>{p.type}</span>
                    <span className="w-1 h-1 rounded-full bg-[#7a6e8a]" />
                    <span>Placement: {p.placement}</span>
                    <span className="w-1 h-1 rounded-full bg-[#7a6e8a]" />
                    <span>{p.startDate} → {p.endDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-[#F0F2FF]" onClick={() => { setEditingPromo(p); setEditDraft({ title: p.title, type: p.type, placement: p.placement, startDate: p.startDate, endDate: p.endDate }); }}><Edit2 size={14} color={ACCENT} /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-50" onClick={() => setDeletingPromo(p)}><Trash2 size={14} color="#d4183d" /></button>
              </div>
            </div>
            {p.impressions !== "—" && (
              <div className="mt-4 pt-4 border-t border-[rgba(51,44,90,0.07)] grid grid-cols-3 gap-4">
                <div><p className="text-xs text-[#7a6e8a] mb-0.5">Impressions</p><p className="font-bold text-[#1a1530]">{p.impressions}</p></div>
                <div><p className="text-xs text-[#7a6e8a] mb-0.5">Clicks</p><p className="font-bold text-[#1a1530]">{p.clicks}</p></div>
                <div>
                  <p className="text-xs text-[#7a6e8a] mb-0.5">CTR</p>
                  <p className="font-bold text-[#1a1530]">
                    {`${((parseInt(p.clicks.replace(/,/g, "")) / parseInt(p.impressions.replace(/,/g, ""))) * 100).toFixed(1)}%`}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(51,44,90,0.08)]" style={{ background: "rgba(238,168,108,0.08)" }}>
              <h3 className="font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Edit Promotion</h3>
              <button onClick={() => setEditingPromo(null)} className="p-1.5 rounded-lg hover:bg-[rgba(51,44,90,0.06)]"><XCircle size={18} color="#7a6e8a" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Title</label>
                <input value={editDraft.title} onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Type</label>
                  <select value={editDraft.type} onChange={e => setEditDraft(d => ({ ...d, type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none">
                    {["Banner", "Carousel", "Pop-up", "Notification"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Placement</label>
                  <select value={editDraft.placement} onChange={e => setEditDraft(d => ({ ...d, placement: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none">
                    {["Home", "Category", "Checkout", "Global"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Start Date</label>
                  <input value={editDraft.startDate} onChange={e => setEditDraft(d => ({ ...d, startDate: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1a1530] block mb-1.5">End Date</label>
                  <input value={editDraft.endDate} onChange={e => setEditDraft(d => ({ ...d, endDate: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] bg-[#f5ebe2] text-sm text-[#1a1530] outline-none" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setEditingPromo(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2]">Cancel</button>
              <button onClick={() => {
                setPromotionsData(prev => prev.map(x => x.id === editingPromo.id ? { ...x, ...editDraft } : x));
                setEditingPromo(null);
              }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: ORANGE }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {deletingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(26,21,48,0.4)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-5 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} color="#d4183d" /></div>
              <h3 className="font-bold text-[#1a1530] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete Promotion</h3>
              <p className="text-sm text-[#7a6e8a]">Are you sure you want to delete <strong className="text-[#1a1530]">{deletingPromo.title}</strong>? This cannot be undone.</p>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button onClick={() => setDeletingPromo(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-[rgba(51,44,90,0.15)] text-sm font-medium text-[#7a6e8a] hover:bg-[#f5ebe2]">Cancel</button>
              <button onClick={() => {
                setPromotionsData(prev => prev.filter(x => x.id !== deletingPromo.id));
                setDeletingPromo(null);
              }} className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: "#d4183d" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage() {
  const [toggles, setToggles] = useState({ emailNotif: true, pushNotif: false, twoFactor: true, maintenanceMode: false, autoBackup: true });
  const toggle = (k: keyof typeof toggles) => setToggles(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1530]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Settings</h1>
        <p className="text-sm text-[#7a6e8a] mt-0.5">Configure application preferences</p>
      </div>

      {[
        {
          title: "General", icon: <Globe size={16} color={ACCENT} />, items: [
            { label: "App Name", sub: "Display name for your application", type: "input", value: "VyaparNet" },
            { label: "Support Email", sub: "Contact address shown to users", type: "input", value: "support@vyaparnet.in" },
            { label: "Default Currency", sub: "Currency used for all transactions", type: "select", value: "INR — Indian Rupee" },
          ]
        },
      ].map(section => (
        <div key={section.title} className="bg-white rounded-2xl border border-[rgba(51,44,90,0.08)]">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[rgba(51,44,90,0.07)]">
            <div className="p-2 rounded-lg" style={{ background: "#F0F2FF" }}>{section.icon}</div>
            <h3 className="font-bold text-[#1a1530]">{section.title}</h3>
          </div>
          <div className="divide-y divide-[rgba(51,44,90,0.06)]">
            {section.items.map((item: any) => (
              <div key={item.label} className="px-5 py-4 flex items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[#1a1530]">{item.label}</p>
                  <p className="text-xs text-[#7a6e8a] mt-0.5">{item.sub}</p>
                </div>
                {item.type === "toggle" && (
                  <button onClick={() => toggle(item.key)} className="relative w-11 h-6 rounded-full transition-all shrink-0" style={{ background: toggles[item.key as keyof typeof toggles] ? ACCENT : "#d1d5db" }}>
                    <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: toggles[item.key as keyof typeof toggles] ? "calc(100% - 20px)" : "4px" }} />
                  </button>
                )}
                {item.type === "input" && (
                  <input defaultValue={item.value} className="w-64 px-3 py-2 rounded-xl border border-[rgba(51,44,90,0.12)] text-sm text-[#1a1530] bg-[#faf6f2] outline-none focus:border-[#3845AB] transition-colors" />
                )}
                {item.type === "select" && (
                  <select className="w-52 px-3 py-2 rounded-xl border border-[rgba(51,44,90,0.12)] text-sm text-[#1a1530] bg-[#faf6f2] outline-none">
                    <option>INR — Indian Rupee</option>
                    <option>USD — US Dollar</option>
                    <option>EUR — Euro</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <button className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90" style={{ background: ORANGE }}>Save Changes</button>
        <button className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-[rgba(51,44,90,0.12)] text-[#7a6e8a] hover:bg-white transition-colors">Discard</button>
      </div>
    </div>
  );
}


const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "products", label: "Products", icon: Package },
  {
    id: "financial", label: "Financial", icon: IndianRupee,
    children: [
      { id: "financial-dashboard", label: "Dashboard", icon: BarChart2 },
      { id: "financial-transactions", label: "Transactions", icon: CreditCard },
      { id: "financial-coupons", label: "Coupons", icon: Tag },
    ]
  },
  { id: "promotions", label: "Promotions", icon: Megaphone },
  { id: "settings", label: "Settings", icon: Settings },
];


function LoginPage({ onLogin }: { onLogin: (admin: { name: string; city: string }) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        return;
      }
      setToken(data.token);
      onLogin(data.admin);
    } catch {
      setError("Network error. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: SCREEN_BG }}>
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 py-10" style={{ background: MENU_BG }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ORANGE }}>
                <ShoppingBag size={20} color="white" />
              </div>
              <span className="text-white font-bold text-2xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>VyaparNet</span>
            </div>
            <p className="text-white/50 text-sm mt-1">Super Admin Panel</p>
          </div>
          <div className="px-8 py-8">
            <h2 className="text-xl font-bold text-[#1a1530] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Welcome back</h2>
            <p className="text-sm text-[#7a6e8a] mb-6">Sign in to your admin account</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Email Address</label>
                <div className="flex items-center gap-2 bg-[#f5ebe2] rounded-xl px-3 py-2.5 border border-transparent focus-within:border-[rgba(56,69,171,0.3)]">
                  <Users size={15} color="#7a6e8a" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent text-sm text-[#1a1530] outline-none placeholder-[#7a6e8a]" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1a1530] block mb-1.5">Password</label>
                <div className="flex items-center gap-2 bg-[#f5ebe2] rounded-xl px-3 py-2.5 border border-transparent focus-within:border-[rgba(56,69,171,0.3)]">
                  <Lock size={15} color="#7a6e8a" />
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="flex-1 bg-transparent text-sm text-[#1a1530] outline-none placeholder-[#7a6e8a]" />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="text-[#7a6e8a] hover:text-[#1a1530]">
                    <Eye size={15} />
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity mt-2 disabled:opacity-50" style={{ background: MENU_BG }}>
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => !!getToken());
  const [adminInfo, setAdminInfo] = useState<{ name: string; city: string } | null>(null);
  const [active, setActive] = useState("dashboard");
  const [financialOpen, setFinancialOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!getToken()) return;
    fetch(`${API_BASE}/admin/auth/me`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setAdminInfo(d.admin))
      .catch(() => { clearToken(); setLoggedIn(false); });
  }, []);

  const handleLogout = () => { clearToken(); setLoggedIn(false); setAdminInfo(null); };

  if (!loggedIn) return <LoginPage onLogin={(admin) => { setAdminInfo(admin); setLoggedIn(true); }} />;

  const financialSub = active.startsWith("financial-") ? active.replace("financial-", "") : "dashboard";
  const isFinancialActive = active.startsWith("financial-");

  const handleNav = (id: string) => {
    if (id === "financial") {
      setActive("financial-dashboard");
      setFinancialOpen(true);
    } else {
      setActive(id);
      if (id.startsWith("financial-")) setFinancialOpen(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: SCREEN_BG, fontFamily: "'DM Sans', sans-serif" }}>
      <aside className="flex flex-col h-full shrink-0 transition-all duration-300" style={{ width: sidebarOpen ? 240 : 72, background: MENU_BG, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: ORANGE }}>
            <ShoppingBag size={18} color="#fff" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-base leading-tight">VyaparNet</p>
              <p className="text-white/40 text-xs">Super Admin</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(p => !p)} className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            {sidebarOpen ? <ChevronLeft size={16} color="rgba(255,255,255,0.5)" /> : <ChevronRight size={16} color="rgba(255,255,255,0.5)" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id || (item.id === "financial" && isFinancialActive);
            const isOpen = item.id === "financial" && financialOpen;
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                  style={isActive ? { background: "rgba(56,69,171,0.6)", color: "#fff" } : { color: "rgba(255,255,255,0.6)" }}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon size={18} className="shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: ORANGE }}>
              {adminInfo?.name.split(" ").map(n => n[0]).join("") ?? "A"}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{adminInfo?.name ?? "Admin"}</p>
                <p className="text-white/40 text-xs truncate">{adminInfo?.city ?? ""}</p>
              </div>
            )}
            {sidebarOpen && <LogOut size={15} color="rgba(255,255,255,0.4)" className="cursor-pointer shrink-0" onClick={handleLogout} />}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-[rgba(51,44,90,0.08)] shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="flex items-center gap-2 flex-1 bg-[#f5ebe2] rounded-xl px-3 py-2">
              <Search size={15} className="text-[#7a6e8a]" />
              <input placeholder="Search anything…" className="bg-transparent text-sm outline-none flex-1 text-[#1a1530] placeholder-[#7a6e8a]" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right mr-1 hidden sm:block">
              <p className="text-xs font-semibold text-[#1a1530]">{adminInfo?.name ?? "Admin"}</p>
              <p className="text-xs text-[#7a6e8a]">{adminInfo?.city ? `${adminInfo.city}, India` : ""}</p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: ACCENT }}>
              {adminInfo?.name.split(" ").map(n => n[0]).join("") ?? "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {active === "dashboard" && <DashboardPage />}
          {active === "users" && <UserManagementPage />}
          {active === "products" && <ProductManagementPage />}
          {isFinancialActive && <FinancialPage sub={financialSub} />}
          {active === "promotions" && <PromotionsPage />}
          {active === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
