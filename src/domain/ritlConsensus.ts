import type { TypeOfVote, Vote, VoteDecision } from '../types/domain';

export interface ConsensusResult {
  met: boolean;
  approve: number;
  reject: number;
  total: number;
}

export function evaluateConsensus(
  votes: Vote[],
  targetId: string,
  researchers: { id: string }[],
  votingType: TypeOfVote
): ConsensusResult {
  const relevant = votes.filter((v) => v.targetId === targetId);
  const approve = relevant.filter((v) => v.decision === 'approve').length;
  const reject = relevant.filter((v) => v.decision === 'reject').length;
  const total = researchers.length;

  let met = false;
  if (votingType === 'unanimous') {
    met = approve === total && reject === 0;
  } else if (votingType === 'majority') {
    met = approve > total / 2;
  } else {
    met = approve >= Math.ceil(total * 0.66);
  }

  return { met, approve, reject, total };
}

export function createVote(
  targetId: string,
  targetType: Vote['targetType'],
  researcherId: string,
  decision: VoteDecision,
  idFactory: () => string = () => `v-${Date.now()}-${researcherId}`
): Vote {
  return {
    id: idFactory(),
    targetId,
    targetType,
    researcherId,
    decision,
    timestamp: new Date().toISOString(),
  };
}
