import type { Artifact } from '../types/domain';

export interface PrivacyCheckResult {
  safe: boolean;
  privateCount: number;
  publicCount: number;
}

export function checkPrivacyForExport(artifacts: Artifact[]): PrivacyCheckResult {
  const privateCount = artifacts.filter((a) => a.access === 'private').length;
  const publicCount = artifacts.filter((a) => a.access === 'public').length;
  return { safe: privateCount === 0, privateCount, publicCount };
}

export function filterArtifactsByPhase(artifacts: Artifact[], status: Artifact['status']) {
  return artifacts.filter((a) => a.status === status);
}
