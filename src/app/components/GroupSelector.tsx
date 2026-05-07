import { ChevronDown } from 'lucide-react';
import { Group } from '../../types';

interface GroupSelectorProps {
  groups: Group[];
  currentGroup: Group | null;
  onGroupChange: (groupId: number) => void;
  className?: string;
}

export function GroupSelector({ groups, currentGroup, onGroupChange, className = '' }: GroupSelectorProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={currentGroup?.id || ''}
        onChange={(e) => onGroupChange(Number(e.target.value))}
        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] focus:border-[#1e1b4b] transition-colors"
        aria-label="Select group"
      >
        <option value="" disabled>
          Select a group...
        </option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
