import { Plus, HandCoins, CheckCircle, Users } from "lucide-react";
import { useNavigate } from "react-router";

interface ActionButton {
  id: number;
  label: string;
  icon: string;
  feature: string;
  route?: string;
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

export function ActionSidebar({ actions }: ActionSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {actions.map((action) => {
        const Icon = ICON_MAP[action.icon] || Plus;
        return (
          <button
            key={action.id}
            onClick={() => {
              if (action.route) {
                navigate(action.route);
              } else {
                console.log(`Feature Pending: ${action.feature}`);
              }
            }}
            className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] text-white px-6 py-4 rounded-lg font-semibold text-sm flex items-center gap-3 transition-colors shadow-sm hover:shadow-md"
          >
            <Icon className="w-5 h-5" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
