import type { EntityId } from './types';

export function createEntityId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function findById<T extends { id: EntityId }>(items: T[], id: EntityId): T | undefined {
  return items.find((item) => item.id === id);
}

export function upsertById<T extends { id: EntityId }>(
  items: T[],
  item: T
): T[] {
  const exists = items.some((entry) => entry.id === item.id);
  return exists
    ? items.map((entry) => (entry.id === item.id ? item : entry))
    : [...items, item];
}

export function updateById<T extends { id: EntityId }>(
  items: T[],
  id: EntityId,
  updates: Partial<T>
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

export function removeById<T extends { id: EntityId }>(items: T[], id: EntityId): T[] {
  return items.filter((item) => item.id !== id);
}

export function filterBy<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}
