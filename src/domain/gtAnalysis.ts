import type { Artifact, Coding, ProjectState } from '../types/domain';

/** Constructivist GT coding stages (Charmaz, 2006). */
export type GTCodingStage = 'open' | 'focused' | 'axial' | 'theoretical';

export interface CodeFrequency {
  codeId: string;
  name: string;
  color: string;
  count: number;
  artifactIds: string[];
}

export interface SaturationMetrics {
  analysisArtifacts: number;
  codedArtifacts: number;
  totalCodings: number;
  avgCodingsPerArtifact: number;
  openCodeCount: number;
  categoryCount: number;
  hasTheory: boolean;
  coveragePercent: number;
  /** Categories with at least one linked code. */
  populatedCategories: number;
}

export interface ComparisonInstance {
  artifactId: string;
  artifactName: string;
  snippet: string;
  researcherId: string;
}

export interface ComparisonGroup {
  codeId: string;
  codeName: string;
  color: string;
  instances: ComparisonInstance[];
}

export const GT_STAGE_ORDER: GTCodingStage[] = ['open', 'focused', 'axial', 'theoretical'];

export const GT_STAGE_LABELS: Record<GTCodingStage, string> = {
  open: 'Open Coding',
  focused: 'Focused Coding',
  axial: 'Axial / Category Development',
  theoretical: 'Theoretical Integration',
};

export const GT_STAGE_DESCRIPTIONS: Record<GTCodingStage, string> = {
  open:
    'Fracture data into initial codes. Stay close to participants\' words (in-vivo codes). Compare incidents as they emerge.',
  focused:
    'Identify the most significant and frequent codes. Sort and synthesise data around them (constant comparison).',
  axial:
    'Relate categories to subcategories. Specify properties and dimensions linking codes into higher-order categories.',
  theoretical:
    'Integrate categories into an explanatory framework. Write memos, refine the core story, and seek theoretical saturation.',
};

export function computeCodeFrequencies(state: ProjectState): CodeFrequency[] {
  const openCodes = state.codes.filter((c) => c.kind === 'code');
  const freq = new Map<string, CodeFrequency>();

  for (const code of openCodes) {
    freq.set(code.id, {
      codeId: code.id,
      name: code.name,
      color: code.color,
      count: 0,
      artifactIds: [],
    });
  }

  for (const coding of state.codings) {
    const entry = freq.get(coding.codeId);
    if (!entry) continue;
    entry.count += 1;
    if (!entry.artifactIds.includes(coding.artifactId)) {
      entry.artifactIds.push(coding.artifactId);
    }
  }

  return [...freq.values()].sort((a, b) => b.count - a.count);
}

export function computeSaturationMetrics(state: ProjectState): SaturationMetrics {
  const analysisArtifacts = state.artifacts.filter((a) => a.status === 'analysis');
  const analysisIds = new Set(analysisArtifacts.map((a) => a.id));
  const analysisCodings = state.codings.filter((c) => analysisIds.has(c.artifactId));
  const codedArtifactIds = new Set(analysisCodings.map((c) => c.artifactId));

  const openCodeCount = state.codes.filter((c) => c.kind === 'code').length;
  const populatedCategories = state.categories.filter((c) => c.codeIds.length > 0).length;

  return {
    analysisArtifacts: analysisArtifacts.length,
    codedArtifacts: codedArtifactIds.size,
    totalCodings: analysisCodings.length,
    avgCodingsPerArtifact:
      analysisArtifacts.length > 0
        ? Math.round((analysisCodings.length / analysisArtifacts.length) * 10) / 10
        : 0,
    openCodeCount,
    categoryCount: state.categories.length,
    populatedCategories,
    hasTheory: Boolean(state.theory?.content?.trim()),
    coveragePercent:
      analysisArtifacts.length > 0
        ? Math.round((codedArtifactIds.size / analysisArtifacts.length) * 100)
        : 0,
  };
}

export function suggestGTCodingStage(metrics: SaturationMetrics): GTCodingStage {
  if (metrics.totalCodings < 3 || metrics.openCodeCount < 2) return 'open';
  if (metrics.populatedCategories < 2) return 'focused';
  if (!metrics.hasTheory && metrics.populatedCategories < metrics.categoryCount) return 'axial';
  if (metrics.hasTheory) return 'theoretical';
  if (metrics.coveragePercent >= 80 && metrics.populatedCategories >= 2) return 'theoretical';
  return 'axial';
}

export function findConstantComparisonGroups(state: ProjectState): ComparisonGroup[] {
  const groups = new Map<string, ComparisonGroup>();

  for (const coding of state.codings) {
    const code = state.codes.find((c) => c.id === coding.codeId);
    const artifact = state.artifacts.find((a) => a.id === coding.artifactId);
    if (!code || !artifact) continue;

    if (!groups.has(coding.codeId)) {
      groups.set(coding.codeId, {
        codeId: coding.codeId,
        codeName: code.name,
        color: code.color,
        instances: [],
      });
    }
    groups.get(coding.codeId)!.instances.push({
      artifactId: artifact.id,
      artifactName: artifact.name,
      snippet: coding.textSnippet,
      researcherId: coding.researcherId,
    });
  }

  return [...groups.values()]
    .filter((g) => g.instances.length >= 2)
    .sort((a, b) => b.instances.length - a.instances.length);
}

export function getUncodedCharacterRatio(
  artifact: Artifact,
  codings: Coding[]
): number {
  if (!artifact.content.length) return 0;
  const artifactCodings = codings.filter((c) => c.artifactId === artifact.id);
  if (artifactCodings.length === 0) return 1;

  const covered = new Set<number>();
  for (const coding of artifactCodings) {
    for (let i = coding.start; i < coding.end; i++) covered.add(i);
  }
  return 1 - covered.size / artifact.content.length;
}

export function getMethodologyLabel(methodology: ProjectState['settings']['theoreticalFramework']['methodology']): string {
  const labels = {
    classic: 'Classic GT (Glaser)',
    constructivist: 'Constructivist GT (Charmaz)',
    straussian: 'Straussian GT (Corbin & Strauss)',
  };
  return labels[methodology];
}
