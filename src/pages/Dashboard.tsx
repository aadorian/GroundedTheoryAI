import { Header } from '../components/layout/Header';
import { useProject } from '../context/ProjectContext';
import { ResearcherAvatar } from '../components/shared/ResearcherAvatar';
import { PHASE_LABELS, PHASE_ORDER } from '../types/domain';
import { Badge } from '../components/shared/Badge';
import { PhaseKanban } from '../components/shared/PhaseKanban';

export function Dashboard() {
  const { state } = useProject();
  const phaseCounts = PHASE_ORDER.map((phase) => ({
    phase,
    count: state.artifacts.filter((a) => a.status === phase).length,
  }));

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <ResearcherAvatar initials="MN" color="#6366f1" size="lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{state.settings.projectName}</h1>
              <p className="text-sm text-gray-500">{state.settings.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {state.settings.fieldOfStudy.objectOfStudy} — {state.settings.fieldOfStudy.location}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {phaseCounts.map(({ phase, count }) => (
            <div key={phase} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{count}</p>
              <p className="text-xs text-gray-500 mt-1">{PHASE_LABELS[phase]}</p>
            </div>
          ))}
        </div>

        <PhaseKanban />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Research Team</h3>
            <div className="space-y-2">
              {state.researchTeam.researchers.map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <ResearcherAvatar initials={r.initials} color={r.color} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">GT Summary</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{state.codes.length} codes</Badge>
              <Badge variant="primary">{state.categories.length} categories</Badge>
              <Badge variant="methodology">{state.settings.theoreticalFramework.methodology}</Badge>
              <Badge variant="muted">{state.changeLog.length} changes</Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
