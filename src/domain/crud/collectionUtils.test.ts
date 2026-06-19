import { describe, expect, it } from 'vitest';
import { findById, removeById, updateById, upsertById } from './collectionUtils';

describe('collectionUtils', () => {
  const items = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' },
  ];

  it('finds items by id', () => {
    expect(findById(items, '2')?.name).toBe('B');
    expect(findById(items, 'x')).toBeUndefined();
  });

  it('updates items by id', () => {
    const updated = updateById(items, '1', { name: 'A2' });
    expect(findById(updated, '1')?.name).toBe('A2');
  });

  it('removes items by id', () => {
    expect(removeById(items, '1')).toHaveLength(1);
  });

  it('upserts items', () => {
    const upserted = upsertById(items, { id: '2', name: 'B2' });
    expect(findById(upserted, '2')?.name).toBe('B2');
    const added = upsertById(items, { id: '3', name: 'C' });
    expect(added).toHaveLength(3);
  });
});
