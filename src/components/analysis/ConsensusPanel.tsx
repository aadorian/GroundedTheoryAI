import { useProject } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';
import { ResearcherAvatar } from '../shared/ResearcherAvatar';

interface ConsensusPanelProps {
  targetId: string;
  targetType: 'code' | 'category' | 'theory' | 'phase_transition' | 'artefact';
  targetLabel: string;
  votingType?: 'unanimous' | 'majority' | 'consensus';
}

export function ConsensusPanel({
  targetId,
  targetType,
  targetLabel,
  votingType = 'majority',
}: ConsensusPanelProps) {
  const { state, castVote, getConsensusStatus } = useProject();
  const status = getConsensusStatus(targetId, votingType);

  const getVote = (researcherId: string) =>
    state.votes.find((v) => v.targetId === targetId && v.researcherId === researcherId);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900">RITL-C Consensus</h4>
        <Badge variant={status.met ? 'primary' : 'committed'}>
          {status.met ? 'Consensus met' : `${status.approve}/${status.total} (${votingType})`}
        </Badge>
      </div>
      <p className="text-xs text-gray-500 mb-4">{targetLabel}</p>

      <div className="space-y-2">
        {state.researchTeam.researchers.map((r) => {
          const vote = getVote(r.id);
          return (
            <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <ResearcherAvatar initials={r.initials} color={r.color} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{r.name}</p>
                <p className="text-xs text-gray-400">{r.role}</p>
              </div>
              {vote ? (
                <Badge
                  variant={
                    vote.decision === 'approve'
                      ? 'primary'
                      : vote.decision === 'reject'
                        ? 'committed'
                        : 'muted'
                  }
                >
                  {vote.decision}
                </Badge>
              ) : (
                <div className="flex gap-1">
                  <button
                    onClick={() => castVote(targetId, targetType, 'approve')}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => castVote(targetId, targetType, 'reject')}
                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    ✗
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CategoryBuilder() {
  const { state, addCategory } = useProject();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
      <div className="space-y-2 mb-4">
        {state.categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-800">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.codeIds.length} codes • {cat.level}</p>
            </div>
            <Badge variant="outline">{cat.level}</Badge>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          const name = prompt('Category name:');
          if (name) addCategory(name, state.codes.slice(0, 2).map((c) => c.id), 'analytical');
        }}
        className="text-xs text-blue-600 font-medium hover:underline"
      >
        + Add category from codes
      </button>
    </div>
  );
}

export function TheoryPanel() {
  const { state, updateTheory } = useProject();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Emerging Theory</h4>
      <textarea
        value={state.theory?.content ?? ''}
        onChange={(e) => updateTheory(e.target.value)}
        className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none h-32 leading-relaxed"
        placeholder="Theory grounded in categories and codes..."
      />
      {state.theory && (
        <ConsensusPanel
          targetId={state.theory.id}
          targetType="theory"
          targetLabel="Theory elaboration consensus"
          votingType="consensus"
        />
      )}
    </div>
  );
}
