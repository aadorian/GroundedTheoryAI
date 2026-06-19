import { useState } from 'react';
import { Header } from '../components/layout/Header';
import {
  AcquisitionTabs,
  RecentEntryCard,
  UploadPanel,
  ActivityTimeline,
} from '../components/acquisition/AcquisitionViews';
import { useProject } from '../context/ProjectContext';
import { getNextPhase } from '../context/ProjectContext';
import { ArtifactsCrud } from '../components/crud/ArtifactsCrud';
import { ActivitiesCrud } from '../components/crud/WorkflowCrud';
import { PHASE_LABELS } from '../types/domain';

export function DataAcquisition() {
  const [tab, setTab] = useState('All');
  const { state, advanceArtifactPhase, castVote, getConsensusStatus } = useProject();

  const acquisitionArtifacts = state.artifacts.filter((a) => a.status === 'acquisition');

  const handleAdvance = (artifactId: string) => {
    const next = getNextPhase('acquisition');
    if (!next) return;
    const transitionId = `${artifactId}-${next}`;
    castVote(transitionId, 'phase_transition', 'approve');
    const criteria = state.researchTeam.consensusCriteria.find((c) => c.name === 'Phase Transition');
    if (criteria) {
      const s = getConsensusStatus(transitionId, criteria.votingType);
      if (!s.met && s.approve < 2) {
        alert(`Vote recorded. Need consensus: ${s.approve}/${s.total}`);
      }
    }
    advanceArtifactPhase(artifactId);
  };

  return (
    <>
      <Header title="Data Acquisition" showBack backTo="/scientist/problem-statement" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <AcquisitionTabs active={tab} onChange={setTab} />
        <RecentEntryCard />
        <UploadPanel />

        {acquisitionArtifacts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Advance to Management</p>
            <div className="space-y-2">
              {acquisitionArtifacts.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{a.name}</span>
                  <button
                    onClick={() => handleAdvance(a.id)}
                    className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    → {PHASE_LABELS.management}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <ActivityTimeline />
        <ActivitiesCrud />
        <ArtifactsCrud status="acquisition" title="Acquisition Artefacts" />
      </div>
    </>
  );
}
