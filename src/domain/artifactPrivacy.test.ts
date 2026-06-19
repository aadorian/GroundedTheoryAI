import { describe, expect, it } from 'vitest';
import { checkPrivacyForExport, filterArtifactsByPhase } from './artifactPrivacy';
import { createMinimalArtifact } from './fixtures';

describe('artifactPrivacy', () => {
  it('marks export as safe when all artefacts are public', () => {
    const artifacts = [
      createMinimalArtifact({ id: 'a1', access: 'public' }),
      createMinimalArtifact({ id: 'a2', access: 'public' }),
    ];
    expect(checkPrivacyForExport(artifacts)).toEqual({
      safe: true,
      privateCount: 0,
      publicCount: 2,
    });
  });

  it('flags private artefacts before export', () => {
    const artifacts = [
      createMinimalArtifact({ id: 'a1', access: 'public' }),
      createMinimalArtifact({ id: 'a2', access: 'private' }),
      createMinimalArtifact({ id: 'a3', access: 'private' }),
    ];
    expect(checkPrivacyForExport(artifacts)).toEqual({
      safe: false,
      privateCount: 2,
      publicCount: 1,
    });
  });

  it('filters artefacts by research phase', () => {
    const artifacts = [
      createMinimalArtifact({ id: 'a1', status: 'acquisition' }),
      createMinimalArtifact({ id: 'a2', status: 'analysis' }),
      createMinimalArtifact({ id: 'a3', status: 'acquisition' }),
    ];
    expect(filterArtifactsByPhase(artifacts, 'acquisition')).toHaveLength(2);
    expect(filterArtifactsByPhase(artifacts, 'report')).toHaveLength(0);
  });
});
