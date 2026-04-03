import { hueFromString, initialsFromDisplayName } from './kit-avatar.utils';

describe('kit-avatar.utils', () => {
  describe('initialsFromDisplayName', () => {
    it('returns empty for nullish', () => {
      expect(initialsFromDisplayName(undefined)).toBe('');
      expect(initialsFromDisplayName(null)).toBe('');
      expect(initialsFromDisplayName('   ')).toBe('');
    });

    it('returns first letter for single word', () => {
      expect(initialsFromDisplayName('alice')).toBe('A');
    });

    it('returns first and last for multiple words', () => {
      expect(initialsFromDisplayName('Alice Bob')).toBe('AB');
      expect(initialsFromDisplayName('  Foo   Bar  Baz ')).toBe('FB');
    });
  });

  describe('hueFromString', () => {
    it('is stable for the same input', () => {
      expect(hueFromString('test')).toBe(hueFromString('test'));
    });

    it('returns value in 0..359', () => {
      for (const s of ['a', 'longer seed string', '']) {
        const h = hueFromString(s);
        expect(h).toBeGreaterThanOrEqual(0);
        expect(h).toBeLessThan(360);
      }
    });
  });
});
