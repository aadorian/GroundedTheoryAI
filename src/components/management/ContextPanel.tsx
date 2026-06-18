import { useProject } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';
import { ResearcherAvatar } from '../shared/ResearcherAvatar';
import { getNextPhase, getPrevPhase } from '../../context/ProjectContext';
import { PHASE_LABELS } from '../../types/domain';
import type { TypeOfStatus } from '../../types/domain';

export function ContextPanel() {
  const {
    state,
    updateArtifact,
    advanceArtifactPhase,
    backtrackArtifact,
    getResearcher,
    castVote,
    getConsensusStatus,
  } = useProject();

  const managementArtifacts = state.artifacts.filter((a) => a.status === 'management');

  const handleAdvance = (artifactId: string, current: TypeOfStatus) => {
    const next = getNextPhase(current);
    if (!next) return;
    const transitionId = `${artifactId}-${next}`;
    const criteria = state.researchTeam.consensusCriteria.find((c) => c.name === 'Phase Transition');
    if (criteria) {
      castVote(transitionId, 'phase_transition', 'approve');
      const status = getConsensusStatus(transitionId, criteria.votingType);
      if (!status.met) {
        alert(`Consensus not met: ${status.approve}/${status.total} approvals (${criteria.votingType})`);
        return;
      }
    }
    advanceArtifactPhase(artifactId);
  };

  return (
    <div className="space-y-4">
      {managementArtifacts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
          No artefacts in Data Management phase. Advance artefacts from Data Acquisition.
        </div>
      ) : (
        managementArtifacts.map((art) => {
          const researcher = art.responsibleId ? getResearcher(art.responsibleId) : undefined;
          const next = getNextPhase(art.status);
          const prev = getPrevPhase(art.status);
          return (
            <div key={art.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{art.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{art.description}</p>
                </div>
                <Badge variant="primary">{PHASE_LABELS[art.status]}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <label className="block">
                  <span className="text-xs text-gray-400">Format</span>
                  <input
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={art.curation.format}
                    onChange={(e) =>
                      updateArtifact(art.id, {
                        curation: { ...art.curation, format: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-400">Source / Provenance</span>
                  <input
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={art.curation.source}
                    onChange={(e) =>
                      updateArtifact(art.id, {
                        curation: { ...art.curation, source: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block col-span-2">
                  <span className="text-xs text-gray-400">Preservation notes</span>
                  <textarea
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-16"
                    value={art.curation.preservationNotes ?? ''}
                    onChange={(e) =>
                      updateArtifact(art.id, {
                        curation: { ...art.curation, preservationNotes: e.target.value },
                      })
                    }
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={art.curation.consentObtained}
                    onChange={(e) =>
                      updateArtifact(art.id, {
                        curation: { ...art.curation, consentObtained: e.target.checked },
                      })
                    }
                  />
                  Consent obtained
                </label>
                <select
                  value={art.access}
                  onChange={(e) =>
                    updateArtifact(art.id, { access: e.target.value as 'public' | 'private' })
                  }
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
                {researcher && (
                  <div className="flex items-center gap-2 ml-auto text-xs text-gray-500">
                    <ResearcherAvatar initials={researcher.initials} color={researcher.color} size="sm" />
                    {researcher.name}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                {prev && (
                  <button
                    onClick={() =>
                      backtrackArtifact(art.id, prev, 'More data required — ArtEModel-GT backtrack')
                    }
                    className="px-3 py-1.5 text-xs border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50"
                  >
                    ← More data ({PHASE_LABELS[prev as TypeOfStatus]})
                  </button>
                )}
                {next && (
                  <button
                    onClick={() => handleAdvance(art.id, art.status)}
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
                  >
                    Advance to {PHASE_LABELS[next as TypeOfStatus]} →
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
