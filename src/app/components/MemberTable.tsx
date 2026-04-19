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
}

export function MemberTable({ members }: MemberTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* SECTION: TABLE HEADER */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1e1b4b] text-white">
            <tr>
              {Object.values(TABLE_COLUMNS).map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-left text-sm font-semibold">{col}</th>
              ))}
            </tr>
          </thead>
          {/* SECTION: TABLE BODY */}
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{member.name}</td>
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
                    member.signatoryStatus === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {member.signatoryStatus === "approved" ? "Approved" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
