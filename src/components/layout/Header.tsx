import { Search, Bell, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { ResearcherAvatar } from '../shared/ResearcherAvatar';
import { formatRelativeTime } from '../../lib/utils';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  showExport?: boolean;
  onExport?: () => void;
  centerStatus?: boolean;
}

export function Header({
  title,
  showBack,
  backTo = '/',
  showExport,
  onExport,
  centerStatus,
}: HeaderProps) {
  const navigate = useNavigate();
  const { state, activeResearcher, dispatch } = useProject();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <h2 className="text-sm font-semibold text-gray-900 truncate">{title}</h2>
      </div>

      {centerStatus && (
        <span className="text-xs text-gray-400 hidden sm:block">
          Updated {formatRelativeTime(state.settings.updatedAt)}
        </span>
      )}

      <div className="flex items-center gap-3">
        {showExport && onExport && (
          <button
            onClick={onExport}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Export
          </button>
        )}
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
          <Search size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full" />
        </button>
        <select
          value={activeResearcher.id}
          onChange={(e) => dispatch({ type: 'SET_ACTIVE_RESEARCHER', researcherId: e.target.value })}
          className="sr-only"
          aria-label="Switch researcher"
          id="researcher-select"
        />
        <button
          onClick={() => {
            const sel = document.getElementById('researcher-select') as HTMLSelectElement;
            sel?.click();
          }}
          className="relative group"
          title={activeResearcher.name}
        >
          <ResearcherAvatar initials={activeResearcher.initials} color={activeResearcher.color} />
          <select
            className="absolute inset-0 opacity-0 cursor-pointer"
            value={activeResearcher.id}
            onChange={(e) =>
              dispatch({ type: 'SET_ACTIVE_RESEARCHER', researcherId: e.target.value })
            }
          >
            {state.researchTeam.researchers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </button>
      </div>
    </header>
  );
}
