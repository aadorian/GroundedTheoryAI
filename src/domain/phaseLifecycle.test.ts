import { describe, expect, it } from 'vitest';
import { PHASE_LABELS, PHASE_ORDER } from '../types/domain';
import {
  canAdvancePhase,
  canBacktrackPhase,
  getNextPhase,
  getPrevPhase,
  isValidPhase,
} from './phaseLifecycle';

describe('PHASE_ORDER domain constants', () => {
  it('defines the ArtEModel-GT five-phase lifecycle in order', () => {
    expect(PHASE_ORDER).toEqual([
      'problem_statement',
      'acquisition',
      'management',
      'analysis',
      'report',
    ]);
  });

  it('maps every phase to a human-readable label', () => {
    for (const phase of PHASE_ORDER) {
      expect(PHASE_LABELS[phase]).toBeTruthy();
    }
  });
});

describe('phaseLifecycle', () => {
  it('returns the next phase in the lifecycle', () => {
    expect(getNextPhase('problem_statement')).toBe('acquisition');
    expect(getNextPhase('acquisition')).toBe('management');
    expect(getNextPhase('management')).toBe('analysis');
    expect(getNextPhase('analysis')).toBe('report');
  });

  it('returns null when already at the final phase', () => {
    expect(getNextPhase('report')).toBeNull();
  });

  it('returns the previous phase in the lifecycle', () => {
    expect(getPrevPhase('report')).toBe('analysis');
    expect(getPrevPhase('analysis')).toBe('management');
    expect(getPrevPhase('management')).toBe('acquisition');
    expect(getPrevPhase('acquisition')).toBe('problem_statement');
  });

  it('returns null when already at the first phase', () => {
    expect(getPrevPhase('problem_statement')).toBeNull();
  });

  it('validates known phase values', () => {
    expect(isValidPhase('analysis')).toBe(true);
    expect(isValidPhase('invalid')).toBe(false);
  });

  it('reports whether advance and backtrack are possible', () => {
    expect(canAdvancePhase('analysis')).toBe(true);
    expect(canAdvancePhase('report')).toBe(false);
    expect(canBacktrackPhase('analysis')).toBe(true);
    expect(canBacktrackPhase('problem_statement')).toBe(false);
  });
});
