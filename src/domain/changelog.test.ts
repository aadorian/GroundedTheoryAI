import { describe, expect, it } from 'vitest';
import { createChangeRecord } from './changelog';

describe('changelog', () => {
  it('creates a change record with GTA-DCM fields', () => {
    const record = createChangeRecord(
      'r1',
      'research_question',
      'MOD: fixed RQ',
      'Refined wording for clarity',
      'committed',
      'Team agreed on constructivist framing',
      () => 'ch-test-1'
    );

    expect(record).toEqual({
      id: 'ch-test-1',
      authorId: 'r1',
      category: 'research_question',
      action: 'MOD: fixed RQ',
      rationale: 'Refined wording for clarity',
      status: 'committed',
      note: 'Team agreed on constructivist framing',
      timestamp: expect.any(String),
    });
  });

  it('defaults to draft status when not specified', () => {
    const record = createChangeRecord('r2', 'artefact', 'ADD: interview', 'New data collected');
    expect(record.status).toBe('draft');
  });
});
