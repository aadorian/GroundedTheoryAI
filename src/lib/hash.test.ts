import { describe, expect, it } from 'vitest';
import { generateHashID, shortHash } from '../lib/hash';

describe('hash utilities', () => {
  it('generates a deterministic SHA-256 hashID for artefact content', async () => {
    const hash1 = await generateHashID('identical content');
    const hash2 = await generateHashID('identical content');
    const hash3 = await generateHashID('different content');

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it('returns the first 8 characters as a short hash preview', () => {
    const full = 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456';
    expect(shortHash(full)).toBe('a1b2c3d4');
  });
});
