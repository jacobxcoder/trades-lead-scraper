/**
 * Trims non-alphanumeric characters from the left or right side of a string.
 * @param input - The input string to trim.
 * @param direction - The direction to trim ('left' or 'right').
 * @returns The trimmed string.
 */
export function trimNonAlphanumeric(input: string): string {
  return input.replace(/^[^a-zA-Z0-9:+]/, '').replace(/[^a-zA-Z0-9:+]+$/, '');
}
