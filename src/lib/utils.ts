/**
 * Class name helper for conditional/dynamic class composition.
 */

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
