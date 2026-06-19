import { useMemo } from 'react';
import { createDomainCrud } from '../domain/crud/domainCrud';
import { useProject } from '../context/ProjectContext';

export function useDomainCrud() {
  const { state, dispatch } = useProject();
  return useMemo(() => createDomainCrud(() => state, dispatch), [state, dispatch]);
}
