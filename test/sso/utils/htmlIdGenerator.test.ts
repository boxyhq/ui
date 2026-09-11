import { describe, expect, it } from 'vitest';
import htmlIdGenerator from '../../../src/sso/utils/htmlIdGenerator';
import getUniqueId from '../../../src/sso/utils/getUniqueId';

describe('htmlIdGenerator', () => {
  it('namespaces the id by prefix and element type', () => {
    expect(htmlIdGenerator('sso', 'input')).toBe('boxyhq-sso-input');
  });

  it('is deterministic for the same prefix and element type', () => {
    expect(htmlIdGenerator('sso', 'input')).toBe(htmlIdGenerator('sso', 'input'));
  });
});

describe('getUniqueId', () => {
  it('delegates to htmlIdGenerator', () => {
    expect(getUniqueId('dsync', 'button')).toBe(htmlIdGenerator('dsync', 'button'));
  });
});
