import { describe, it, expect } from 'vitest';
import { missingScopes, REQUIRED_SCOPES } from './scopes';
import fullScopes from './__fixtures__/tokeninfo-full-scopes.json';
import missingProgression from './__fixtures__/tokeninfo-missing-progression.json';

describe('missingScopes', () => {
  it('returns empty when all required scopes are present (full-scopes fixture)', () => {
    expect(missingScopes(fullScopes.permissions)).toEqual([]);
  });

  it('returns ["progression"] for the missing-progression fixture', () => {
    expect(missingScopes(missingProgression.permissions)).toEqual(['progression']);
  });

  it('returns all required scopes when permissions is empty', () => {
    expect(missingScopes([])).toEqual([...REQUIRED_SCOPES]);
  });

  it('ignores extra (non-required) scopes', () => {
    expect(
      missingScopes(['account', 'characters', 'progression', 'wallet', 'pvp'])
    ).toEqual([]);
  });

  it('returns multiple missing scopes in REQUIRED_SCOPES order', () => {
    expect(missingScopes(['characters'])).toEqual(['account', 'progression']);
  });
});
