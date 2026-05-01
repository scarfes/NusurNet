/**
 * Class name utility — merges Tailwind classes intelligently.
 *
 * Combines `clsx` (conditional classes) with `tailwind-merge`
 * (resolves conflicting Tailwind classes, e.g. "px-2 px-4" → "px-4").
 *
 * Usage:
 *   <div className={cn('px-2', isLarge && 'px-4')} />
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
