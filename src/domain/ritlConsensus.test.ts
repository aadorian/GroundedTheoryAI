import { describe, expect, it } from 'vitest';
import { createMinimalResearchers, createVote } from './fixtures';
import { createVote as createDomainVote, evaluateConsensus } from './ritlConsensus';

describe('ritlConsensus', () => {
  const researchers = createMinimalResearchers(4);
  const targetId = 'c1';

  describe('evaluateConsensus', () => {
    it('requires all approvals for unanimous voting', () => {
      const votes = researchers.map((r) => createVote(targetId, r.id, 'approve'));
      const result = evaluateConsensus(votes, targetId, researchers, 'unanimous');
      expect(result.met).toBe(true);
      expect(result.approve).toBe(4);
    });

    it('fails unanimous voting when any researcher rejects', () => {
      const votes = [
        ...researchers.slice(0, 3).map((r) => createVote(targetId, r.id, 'approve')),
        createVote(targetId, researchers[3].id, 'reject'),
      ];
      const result = evaluateConsensus(votes, targetId, researchers, 'unanimous');
      expect(result.met).toBe(false);
    });

    it('passes majority voting with more than half approvals', () => {
      const votes = [
        createVote(targetId, 'r1', 'approve'),
        createVote(targetId, 'r2', 'approve'),
        createVote(targetId, 'r3', 'approve'),
        createVote(targetId, 'r4', 'reject'),
      ];
      const result = evaluateConsensus(votes, targetId, researchers, 'majority');
      expect(result.met).toBe(true);
    });

    it('fails majority voting with exactly half approvals', () => {
      const votes = [
        createVote(targetId, 'r1', 'approve'),
        createVote(targetId, 'r2', 'approve'),
        createVote(targetId, 'r3', 'reject'),
        createVote(targetId, 'r4', 'reject'),
      ];
      const result = evaluateConsensus(votes, targetId, researchers, 'majority');
      expect(result.met).toBe(false);
    });

    it('passes consensus voting at two-thirds threshold', () => {
      const threeResearchers = researchers.slice(0, 3);
      const votes = [
        createVote(targetId, 'r1', 'approve'),
        createVote(targetId, 'r2', 'approve'),
        createVote(targetId, 'r3', 'reject'),
      ];
      const result = evaluateConsensus(votes, targetId, threeResearchers, 'consensus');
      expect(result.met).toBe(true);
    });

    it('ignores votes for other targets', () => {
      const votes = [
        createVote(targetId, 'r1', 'approve'),
        createVote('other-target', 'r2', 'approve'),
      ];
      const result = evaluateConsensus(votes, targetId, researchers, 'majority');
      expect(result.approve).toBe(1);
    });
  });

  describe('createVote', () => {
    it('creates a vote with the expected RITL-C fields', () => {
      const vote = createDomainVote('cat1', 'category', 'r1', 'approve', () => 'v-test');
      expect(vote).toMatchObject({
        id: 'v-test',
        targetId: 'cat1',
        targetType: 'category',
        researcherId: 'r1',
        decision: 'approve',
      });
      expect(vote.timestamp).toBeTruthy();
    });
  });
});
