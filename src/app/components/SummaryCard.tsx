import { Wallet, Coins, Handshake } from "lucide-react";

interface SummaryCardProps {
  label: string;
  value: string;
  icon: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  wallet: Wallet,
  coins: Coins,
  handshake: Handshake,
};

export function SummaryCard({ label, value, icon }: SummaryCardProps) {
  const Icon = ICON_MAP[icon] || Wallet;
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-[#1e1b4b]">{value}</p>
        </div>
        <Icon className="w-10 h-10 text-[#10b981] opacity-80" />
      </div>
    </div>
  );
}
