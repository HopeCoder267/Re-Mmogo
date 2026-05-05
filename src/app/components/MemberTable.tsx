import { Check, X } from "lucide-react";
import { TABLE_COLUMNS } from "../config/dataConfig";
 
interface Member {
  id: number;
  name: string;
  monthlyPaid: boolean;
  progressPercent: number;
  signatoryStatus: string;
}
 
interface MemberTableProps {
  members: Member[];
  currentUserName?: string;
  userRole?: string;
}
 
export function MemberTable({ members, currentUserName, userRole }: MemberTableProps) {
  const isMember = userRole === "member";
 
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Role-aware table header label */}
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          {isMember ? "Your Membership Status" : "All Members"}
        </span>
        {isMember && (
          <span className="text-xs text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
            Showing your record only
          </span>
        )}
      </div>
 
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1e1b4b] text-white">
            <tr>
              {Object.values(TABLE_COLUMNS).map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-left text-sm font-semibold">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">
                  No member data to display.
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const isCurrentUser = member.name === currentUserName;
                return (
                  <tr
                    key={member.id}
                    className={`transition-colors
                      ${isCurrentUser && isMember
                        ? "bg-indigo-50/60 hover:bg-indigo-50"
                        : "hover:bg-gray-50"
                      }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center gap-2">
                      {member.name}
                      {isCurrentUser && (
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">YOU</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {member.monthlyPaid ? (
                        <span className="inline-flex items-center gap-1 text-[#10b981] font-semibold">
                          <Check className="w-4 h-4" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 font-semibold">
                          <X className="w-4 h-4" /> No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#10b981] h-full transition-all" style={{ width: `${member.progressPercent}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">{member.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        member.signatoryStatus === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {member.signatoryStatus === "approved" ? "Approved" : "Pending"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}