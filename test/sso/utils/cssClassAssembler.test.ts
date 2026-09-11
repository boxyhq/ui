import { describe, expect, it } from 'vitest';
import cssClassAssembler from '../../../src/sso/utils/cssClassAssembler';

describe('cssClassAssembler', () => {
  it('appends the default classes after the custom ones', () => {
    expect(cssClassAssembler('custom', 'default')).toBe('custom default');
  });

  it('falls back to the default classes when no custom ones are given', () => {
    expect(cssClassAssembler('', 'default')).toBe('default');
    expect(cssClassAssembler(undefined, 'default')).toBe('default');
  });

  it('returns an empty string when neither is given', () => {
    expect(cssClassAssembler()).toBe('');
  });

  it('trims the result so a missing default leaves no trailing space', () => {
    expect(cssClassAssembler('custom', '')).toBe('custom');
  });
});
