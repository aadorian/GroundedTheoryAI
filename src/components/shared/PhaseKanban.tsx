import { useProject } from '../../context/ProjectContext';
import { PHASE_LABELS, PHASE_ORDER } from '../../types/domain';
import { artifactDisplayId } from '../../lib/seedData';

export function PhaseKanban() {
  const { state, advanceArtifactPhase } = useProject();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm overflow-x-auto">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Research Lifecycle Board (ArtEModel-GT)</h3>
      <div className="flex gap-3 min-w-[900px]">
        {PHASE_ORDER.map((phase) => {
          const items = state.artifacts.filter((a) => a.status === phase);
          return (
            <div
              key={phase}
              className="flex-1 min-w-[160px] bg-gray-50 rounded-lg border border-gray-100 p-2"
            >
              <p className="text-xs font-semibold text-gray-600 mb-2 px-1">{PHASE_LABELS[phase]}</p>
              <div className="space-y-2">
                {items.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white rounded-lg border border-gray-200 p-2 text-xs shadow-sm"
                  >
                    <p className="font-medium text-gray-800 truncate">{art.name}</p>
                    <p className="text-gray-400 font-mono mt-0.5">{artifactDisplayId(art.id)}</p>
                    {phase !== 'report' && (
                      <button
                        onClick={() => advanceArtifactPhase(art.id)}
                        className="mt-2 text-[10px] text-blue-600 hover:underline"
                      >
                        Advance →
                      </button>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-[10px] text-gray-400 px-1 py-4 text-center">No artefacts</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
