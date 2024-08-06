import { describe, it, expect } from 'vitest';
import { trimNonAlphanumeric } from '$/utils/string.utils';

describe('trimNonAlphanumeric', () => {
  it('should trim non-alphanumeric characters from the left side of a string', () => {
    let input = '+1 305-888-9836';
    let expected = '+1 305-888-9836';
    expect(trimNonAlphanumeric(input)).toBe(expected);

    input = 'siricustomcarpentry.com';
    expected = 'siricustomcarpentry.com';
    expect(trimNonAlphanumeric(input)).toBe(expected);
  });

  it('should trim non-alphanumeric characters from both sides of a string', () => {
    let input = '5537 NW 72nd Ave, Miami, FL 33166, Stany Zjednoczone';
    let expected = '5537 NW 72nd Ave, Miami, FL 33166, Stany Zjednoczone';
    expect(trimNonAlphanumeric(input)).toBe(expected);

    input = 'siricustomcarpentry.com';
    expected = 'siricustomcarpentry.com';
    expect(trimNonAlphanumeric(input)).toBe(expected);
  });
});
