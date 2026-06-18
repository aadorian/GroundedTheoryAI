import { Header } from '../components/layout/Header';
import { CodingWorkspace } from '../components/analysis/CodingWorkspace';
import { TheoryGraph } from '../components/analysis/TheoryGraph';
import { ConsensusPanel, CategoryBuilder, TheoryPanel } from '../components/analysis/ConsensusPanel';
import { MemoPanel } from '../components/analysis/MemoPanel';
import { useProject } from '../context/ProjectContext';
import { getPrevPhase } from '../context/ProjectContext';
import { PHASE_LABELS } from '../types/domain';

export function Analysis() {
  const { state, backtrackArtifact } = useProject();
  const analysisArtifacts = state.artifacts.filter((a) => a.status === 'analysis');
  const prev = getPrevPhase('analysis');

  return (
    <>
      <Header title="Analysis" showBack backTo="/scientist/data-management" />
      <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4">
        <div className="flex gap-2 shrink-0">
          {analysisArtifacts.map((a) => (
            <button
              key={a.id}
              onClick={() =>
                prev &&
                backtrackArtifact(a.id, prev, 'Revisit coding — ArtEModel-GT more coding loop')
              }
              className="text-xs px-3 py-1.5 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50"
            >
              ↺ More coding: {a.name.slice(0, 20)}…
            </button>
          ))}
          {prev && (
            <button
              onClick={() => {
                const a = analysisArtifacts[0];
                if (a) backtrackArtifact(a.id, 'acquisition', 'More data collection required');
              }}
              className="text-xs px-3 py-1.5 border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50"
            >
              ← More data ({PHASE_LABELS.acquisition})
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0">
          <CodingWorkspace />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 max-h-80 overflow-y-auto">
          <TheoryGraph />
          <CategoryBuilder />
          <MemoPanel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
          <TheoryPanel />
          {state.codes[0] && (
            <ConsensusPanel
              targetId={state.codes[0].id}
              targetType="code"
              targetLabel={`Code approval: ${state.codes[0].name}`}
              votingType="majority"
            />
          )}
        </div>
      </div>
    </>
  );
}
