import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Users,
  FileText,
  Download,
  Database,
  Microscope,
  FileBarChart,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const scientistRoutes = [
  { path: '/scientist/problem-statement', label: 'Problem Statement', icon: FileText },
  { path: '/scientist/data-acquisition', label: 'Data Acquisition', icon: Download },
  { path: '/scientist/data-management', label: 'Data Management', icon: Database },
  { path: '/scientist/analysis', label: 'Analysis', icon: Microscope },
  { path: '/scientist/report', label: 'Report', icon: FileBarChart },
];

export function Sidebar() {
  const location = useLocation();
  const isScientistActive = location.pathname.startsWith('/scientist');
  const [scientistOpen, setScientistOpen] = useState(true);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    );

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full">
      <div className="px-5 py-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Mentor</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/" end className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/codebook" className={linkClass}>
          <BookOpen size={18} />
          CodeBook
        </NavLink>

        <div>
          <button
            onClick={() => setScientistOpen(!scientistOpen)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isScientistActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <FlaskConical size={18} />
            <span className="flex-1 text-left">Scientist</span>
            {scientistOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {scientistOpen && (
            <div className="mt-1 ml-2 space-y-0.5">
              {scientistRoutes.map((route) => {
                const Icon = route.icon;
                const isActive = location.pathname === route.path;
                return (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    )}
                  >
                    {isActive && <Plus size={14} className="shrink-0" />}
                    <Icon size={16} className={isActive ? '' : 'ml-5'} />
                    {route.label}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        <NavLink to="/settings" className={linkClass}>
          <Settings size={18} />
          Settings
        </NavLink>
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() =>
            alert(
              'Notify Researchers: Regina Motz, Rosalia Winocur, Soledad Morales, Magela Cabrera'
            )
          }
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Users size={16} />
          Notify Researchers
        </button>
      </div>
    </aside>
  );
}
