import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { AnalysisHeader } from '../components/analysis/AnalysisHeader';
import { GTCodingWorkspace } from '../components/analysis/GTCodingWorkspace';
import { TheoryGraph } from '../components/analysis/TheoryGraph';
import { ConstantComparisonPanel } from '../components/analysis/ConstantComparisonPanel';
import { CodeFrequencyPanel, SaturationPanel } from '../components/analysis/SaturationPanel';
import { AxialCategoryPanel } from '../components/analysis/AxialCategoryPanel';
import { MemoWritingPanel } from '../components/analysis/MemoWritingPanel';
import { TheoreticalIntegrationPanel } from '../components/analysis/TheoreticalIntegrationPanel';
import { ConsensusPanel } from '../components/analysis/ConsensusPanel';
import { useProject } from '../context/ProjectContext';
import { suggestGTCodingStage, computeSaturationMetrics, type GTCodingStage } from '../domain/gtAnalysis';

export function Analysis() {
  const { state } = useProject();
  const metrics = computeSaturationMetrics(state);
  const [stage, setStage] = useState<GTCodingStage>(() => suggestGTCodingStage(metrics));
  const [memoSegment, setMemoSegment] = useState<{
    text: string;
    start: number;
    end: number;
    artifactId: string;
  } | null>(null);

  const primaryCode = state.codes.find((c) => c.kind === 'code');

  return (
    <>
      <Header title="Analysis" showBack backTo="/scientist/data-management" />
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
        <AnalysisHeader stage={stage} onStageChange={setStage} />

        <div className="flex-1 p-4 space-y-4">
          <GTCodingWorkspace
            stage={stage}
            onSelectionForMemo={(payload) => setMemoSegment(payload)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <CodeFrequencyPanel />
            <SaturationPanel />
            <ConstantComparisonPanel />
            <MemoWritingPanel
              pendingSegment={memoSegment}
              onClearPending={() => setMemoSegment(null)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AxialCategoryPanel />
            <TheoreticalIntegrationPanel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TheoryGraph />
            {primaryCode && (
              <ConsensusPanel
                targetId={primaryCode.id}
                targetType="code"
                targetLabel={`Open code approval (RITL-C): ${primaryCode.name}`}
                votingType="majority"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
