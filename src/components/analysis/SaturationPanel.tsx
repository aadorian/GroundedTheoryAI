import { Target } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { computeCodeFrequencies, computeSaturationMetrics } from '../../domain/gtAnalysis';
import { Badge } from '../shared/Badge';
import { cn } from '../../lib/utils';

export function CodeFrequencyPanel() {
  const { state } = useProject();
  const frequencies = computeCodeFrequencies(state);
  const maxCount = frequencies[0]?.count ?? 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Target size={16} className="text-violet-600" />
        <h4 className="text-sm font-semibold text-gray-900">Focused Coding</h4>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Prioritise codes with highest frequency and analytic power. Merge or retire sparse codes.
      </p>

      {frequencies.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">No open codes yet.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {frequencies.map((f, i) => (
            <div key={f.codeId} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-4">{i + 1}</span>
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
              <span className="text-xs text-gray-700 flex-1 truncate">{f.name}</span>
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(f.count / maxCount) * 100}%`,
                    backgroundColor: f.color,
                  }}
                />
              </div>
              <span className="text-[10px] text-gray-500 w-8 text-right">{f.count}</span>
              {f.artifactIds.length >= 2 && (
                <Badge variant="outline" className="text-[9px] px-1">
                  cross-case
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SaturationPanel() {
  const { state, getConsensusStatus } = useProject();
  const metrics = computeSaturationMetrics(state);
  const saturationCriteria = state.researchTeam.consensusCriteria.find(
    (c) => c.name === 'Category Saturation' && c.active
  );
  const saturationTargetId = state.categories.find((c) => c.level === 'descriptive')?.id
    ?? state.categories[0]?.id
    ?? 'category-saturation';
  const saturationVote = saturationCriteria
    ? getConsensusStatus(saturationTargetId, saturationCriteria.votingType)
    : null;

  const indicators = [
    {
      label: 'Artefact coverage',
      value: metrics.coveragePercent,
      threshold: 80,
      detail: `${metrics.codedArtifacts}/${metrics.analysisArtifacts} artefacts coded`,
    },
    {
      label: 'Code density',
      value: Math.min(100, metrics.avgCodingsPerArtifact * 10),
      threshold: 50,
      detail: `${metrics.avgCodingsPerArtifact} codings per artefact`,
    },
    {
      label: 'Category integration',
      value:
        metrics.categoryCount > 0
          ? Math.round((metrics.populatedCategories / metrics.categoryCount) * 100)
          : 0,
      threshold: 75,
      detail: `${metrics.populatedCategories}/${metrics.categoryCount} categories linked to codes`,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Theoretical Saturation</h4>
      <p className="text-xs text-gray-500 mb-4">
        Saturation is reached when new data no longer yields new properties of categories. Confirm with
        the research team (RITL-C).
      </p>

      <div className="space-y-3 mb-4">
        {indicators.map((ind) => (
          <div key={ind.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{ind.label}</span>
              <span
                className={cn(
                  'font-medium',
                  ind.value >= ind.threshold ? 'text-emerald-600' : 'text-gray-700'
                )}
              >
                {ind.value}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  ind.value >= ind.threshold ? 'bg-emerald-500' : 'bg-amber-400'
                )}
                style={{ width: `${ind.value}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{ind.detail}</p>
          </div>
        ))}
      </div>

      {saturationCriteria && saturationVote && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">{saturationCriteria.name}</p>
          <Badge variant={saturationVote.met ? 'primary' : 'committed'}>
            {saturationVote.met
              ? 'Team confirms saturation'
              : `${saturationVote.approve}/${saturationVote.total} votes (${saturationCriteria.votingType})`}
          </Badge>
        </div>
      )}

      {metrics.hasTheory && (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mt-3">
          Emerging theory documented. Continue memoing and comparing negative cases.
        </p>
      )}
    </div>
  );
}
