import type { ChangeCategory, ChangeRecord } from '../types/domain';

export function createChangeRecord(
  authorId: string,
  category: ChangeCategory,
  action: string,
  rationale: string,
  status: ChangeRecord['status'] = 'draft',
  note?: string,
  idFactory: () => string = () => `ch-${Date.now()}`
): ChangeRecord {
  return {
    id: idFactory(),
    timestamp: new Date().toISOString(),
    authorId,
    category,
    action,
    rationale,
    status,
    note,
  };
}
