import { PHASE_ORDER, type TypeOfStatus } from '../types/domain';

export function getNextPhase(current: TypeOfStatus): TypeOfStatus | null {
  const idx = PHASE_ORDER.indexOf(current);
  return idx < PHASE_ORDER.length - 1 ? PHASE_ORDER[idx + 1] : null;
}

export function getPrevPhase(current: TypeOfStatus): TypeOfStatus | null {
  const idx = PHASE_ORDER.indexOf(current);
  return idx > 0 ? PHASE_ORDER[idx - 1] : null;
}

export function isValidPhase(status: string): status is TypeOfStatus {
  return PHASE_ORDER.includes(status as TypeOfStatus);
}

export function canAdvancePhase(current: TypeOfStatus): boolean {
  return getNextPhase(current) !== null;
}

export function canBacktrackPhase(current: TypeOfStatus): boolean {
  return getPrevPhase(current) !== null;
}
