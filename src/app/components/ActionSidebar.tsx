import { Plus, HandCoins, CheckCircle, Users, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
 
interface ActionButton {
  id: number;
  label: string;
  icon: string;
  feature: string;
  route?: string;
  permissionKey: string;
}
 
interface ActionSidebarProps {
  actions: ActionButton[];
}
 
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  plus: Plus,
  handCoins: HandCoins,
  checkCircle: CheckCircle,
  users: Users,
};
 
const LOCK_REASON: Record<string, string> = {
  "approve-signatory": "Only signatories can approve requests.",
  "enroll-member":     "Only signatories can enroll new members.",
};
 
export function ActionSidebar({ actions }: ActionSidebarProps) {
  const navigate = useNavigate();
  const { can } = useAuth();
 
  return (
    <div className="space-y-3">
      {actions.map((action) => {
        const Icon    = ICON_MAP[action.icon] || Plus;
        const allowed = can(action.permissionKey);
 
        const handleClick = () => {
          if (!allowed) {
            toast.error(LOCK_REASON[action.permissionKey] ?? "You don't have permission for this action.");
            return;
          }
          if (action.route) {
            navigate(action.route);
          } else {
            toast.info(`Feature Pending: ${action.feature}`);
          }
        };
 
        return (
          <div key={action.id} className="relative group">
            <button
              onClick={handleClick}
              aria-disabled={!allowed}
              className={`w-full px-6 py-4 rounded-lg font-semibold text-sm flex items-center gap-3
                transition-all duration-150 shadow-sm
                ${allowed
                  ? "bg-[#1e1b4b] hover:bg-[#2d2755] text-white hover:shadow-md cursor-pointer"
                  : "bg-gray-100 text-gray-400 border border-dashed border-gray-300 cursor-not-allowed"
                }`}
            >
              {allowed
                ? <Icon className="w-5 h-5 shrink-0" />
                : <Lock className="w-4 h-4 shrink-0 text-gray-400" />
              }
              <span className="flex-1 text-left">{action.label}</span>
 
              {!allowed && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                  Signatory
                </span>
              )}
            </button>
 
            {!allowed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-20
                hidden group-hover:block w-48 bg-gray-900 text-white text-xs
                rounded-lg px-3 py-2 shadow-xl pointer-events-none">
                {LOCK_REASON[action.permissionKey] ?? "Requires signatory access"}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
