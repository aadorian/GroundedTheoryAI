import { describe, expect, it } from 'vitest';
import {
  computeCodeFrequencies,
  computeSaturationMetrics,
  findConstantComparisonGroups,
  suggestGTCodingStage,
} from './gtAnalysis';
import { createMinimalProjectState } from './fixtures';

describe('gtAnalysis', () => {
  it('computes code frequencies sorted by count', () => {
    const state = createMinimalProjectState({
      codings: [
        { id: 'cd1', artifactId: 'a-test', codeId: 'c-test', start: 0, end: 5, textSnippet: 'hello', researcherId: 'r1' },
        { id: 'cd2', artifactId: 'a-test', codeId: 'c-test', start: 10, end: 15, textSnippet: 'world', researcherId: 'r1' },
      ],
    });
    const freqs = computeCodeFrequencies(state);
    expect(freqs[0].count).toBe(2);
    expect(freqs[0].codeId).toBe('c-test');
  });

  it('computes saturation coverage for analysis artefacts', () => {
    const state = createMinimalProjectState({
      artifacts: [
        { ...createMinimalProjectState().artifacts[0], id: 'a1', status: 'analysis' },
        { ...createMinimalProjectState().artifacts[0], id: 'a2', status: 'analysis' },
      ],
      codings: [
        { id: 'cd1', artifactId: 'a1', codeId: 'c-test', start: 0, end: 5, textSnippet: 'x', researcherId: 'r1' },
      ],
    });
    const metrics = computeSaturationMetrics(state);
    expect(metrics.analysisArtifacts).toBe(2);
    expect(metrics.codedArtifacts).toBe(1);
    expect(metrics.coveragePercent).toBe(50);
  });

  it('finds constant comparison groups with 2+ instances', () => {
    const state = createMinimalProjectState({
      artifacts: [
        { ...createMinimalProjectState().artifacts[0], id: 'a1' },
        { ...createMinimalProjectState().artifacts[0], id: 'a2', name: 'Second' },
      ],
      codings: [
        { id: 'cd1', artifactId: 'a1', codeId: 'c-test', start: 0, end: 5, textSnippet: 'one', researcherId: 'r1' },
        { id: 'cd2', artifactId: 'a2', codeId: 'c-test', start: 0, end: 5, textSnippet: 'two', researcherId: 'r1' },
      ],
    });
    expect(findConstantComparisonGroups(state)).toHaveLength(1);
  });

  it('suggests open coding when data is sparse', () => {
    const metrics = computeSaturationMetrics(createMinimalProjectState());
    expect(suggestGTCodingStage(metrics)).toBe('open');
  });
});
