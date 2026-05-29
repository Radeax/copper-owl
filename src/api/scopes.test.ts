import { describe, it, expect } from 'vitest';
import { missingScopes, scopeWarningCopy, REQUIRED_SCOPES } from './scopes';
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

describe('scopeWarningCopy', () => {
  it('returns empty when nothing is missing', () => {
    expect(scopeWarningCopy([])).toBe('');
  });

  it('names the Progression effect specifically when only progression is missing', () => {
    expect(scopeWarningCopy(['progression'])).toBe(
      'This API key is missing the Progression permission. Recommendations that depend on story, mastery, or unlock progress will be skipped.'
    );
  });

  it('names the Account effect specifically when only account is missing', () => {
    expect(scopeWarningCopy(['account'])).toBe(
      'This API key is missing the Account permission. Recommendations that depend on your account state will be skipped.'
    );
  });

  it('names the Characters effect specifically when only characters is missing', () => {
    expect(scopeWarningCopy(['characters'])).toBe(
      'This API key is missing the Characters permission. Recommendations that depend on your characters will be skipped.'
    );
  });

  it('coordinates two effects with "and" for two missing scopes', () => {
    expect(scopeWarningCopy(['account', 'characters'])).toBe(
      'This API key is missing the Account and Characters permissions. Recommendations that depend on your account state and your characters will be skipped.'
    );
  });

  it('coordinates two effects including progression cleanly', () => {
    expect(scopeWarningCopy(['characters', 'progression'])).toBe(
      'This API key is missing the Characters and Progression permissions. Recommendations that depend on your characters and story, mastery, or unlock progress will be skipped.'
    );
  });

  it('falls back to "them" for three missing scopes to avoid comma-overload', () => {
    expect(scopeWarningCopy(['account', 'characters', 'progression'])).toBe(
      'This API key is missing the Account, Characters, and Progression permissions. Recommendations that depend on them will be skipped.'
    );
  });
});
