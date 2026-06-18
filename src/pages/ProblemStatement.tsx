import { Header } from '../components/layout/Header';
import { SummaryCards } from '../components/problem-statement/SummaryCards';
import { RecentChanges } from '../components/problem-statement/RecentChanges';
import { ResearcherAvatar } from '../components/shared/ResearcherAvatar';
import { useProject } from '../context/ProjectContext';

export function ProblemStatement() {
  const { state, exportMarkdown: doExport } = useProject();

  return (
    <>
      <Header
        title="Problem Statement"
        showBack
        backTo="/"
        centerStatus
        showExport
        onExport={() => doExport()}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <ResearcherAvatar initials="MN" color="#6366f1" size="lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{state.settings.projectName}</h1>
              <p className="text-sm text-gray-500">{state.settings.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <SummaryCards />
          <RecentChanges />
        </div>
      </div>
    </>
  );
}
