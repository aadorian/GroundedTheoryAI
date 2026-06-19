import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { getPrevPhase } from '../../context/ProjectContext';
import { Badge } from '../shared/Badge';
import {
  GT_STAGE_DESCRIPTIONS,
  GT_STAGE_LABELS,
  GT_STAGE_ORDER,
  computeSaturationMetrics,
  getMethodologyLabel,
  suggestGTCodingStage,
  type GTCodingStage,
} from '../../domain/gtAnalysis';
import { PHASE_LABELS } from '../../types/domain';
import { cn } from '../../lib/utils';

interface AnalysisHeaderProps {
  stage: GTCodingStage;
  onStageChange: (stage: GTCodingStage) => void;
}

export function AnalysisHeader({ stage, onStageChange }: AnalysisHeaderProps) {
  const { state, backtrackArtifact } = useProject();
  const [showGuide, setShowGuide] = useState(false);
  const metrics = computeSaturationMetrics(state);
  const suggested = suggestGTCodingStage(metrics);
  const methodology = state.settings.theoreticalFramework.methodology;
  const analysisArtifacts = state.artifacts.filter((a) => a.status === 'analysis');
  const prev = getPrevPhase('analysis');

  return (
    <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Grounded Theory Analysis</h2>
            <Badge variant="methodology">{getMethodologyLabel(methodology)}</Badge>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl">
            Iterative coding through open → focused → axial → theoretical integration.
            Compare incidents constantly; write memos throughout.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {analysisArtifacts.map((a) => (
            <button
              key={a.id}
              onClick={() =>
                prev && backtrackArtifact(a.id, prev, 'Revisit coding — ArtEModel-GT more coding loop')
              }
              className="text-xs px-3 py-1.5 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50"
            >
              ↺ More coding: {a.name.slice(0, 18)}…
            </button>
          ))}
          {prev && analysisArtifacts[0] && (
            <button
              onClick={() =>
                backtrackArtifact(analysisArtifacts[0].id, 'acquisition', 'More data collection required')
              }
              className="text-xs px-3 py-1.5 border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50"
            >
              ← More data ({PHASE_LABELS.acquisition})
            </button>
          )}
        </div>
      </div>

      {/* GT stage navigator */}
      <div className="flex flex-wrap gap-2">
        {GT_STAGE_ORDER.map((s, i) => (
          <button
            key={s}
            onClick={() => onStageChange(s)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
              stage === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:bg-blue-50'
            )}
          >
            <span className="text-xs opacity-70">{i + 1}</span>
            {GT_STAGE_LABELS[s]}
            {suggested === s && stage !== s && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">suggested</span>
            )}
          </button>
        ))}
      </div>

      {/* Saturation strip */}
      <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-2 min-w-[180px]">
          <span>Artefact coverage</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${metrics.coveragePercent}%` }}
            />
          </div>
          <span className="font-medium text-gray-700">{metrics.coveragePercent}%</span>
        </div>
        <span>{metrics.openCodeCount} open codes</span>
        <span>{metrics.populatedCategories}/{metrics.categoryCount} categories populated</span>
        <span>{metrics.totalCodings} codings</span>
        {metrics.hasTheory && <Badge variant="primary">Theory emerging</Badge>}
      </div>

      <button
        onClick={() => setShowGuide((v) => !v)}
        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
      >
        {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {GT_STAGE_LABELS[stage]} — what to do now
      </button>
      {showGuide && (
        <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 leading-relaxed">
          {GT_STAGE_DESCRIPTIONS[stage]}
        </p>
      )}
    </div>
  );
}
