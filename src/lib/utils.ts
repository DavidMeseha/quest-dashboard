import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChangedFields<T extends Record<string, any>>(initial: T, current: T) {
  const changed: Record<string, any> = {};
  let key: string;
  for (key in current) {
    if (Array.isArray(current[key]) || typeof current[key] === 'object') {
      if (JSON.stringify(current[key]) !== JSON.stringify(initial[key])) {
        changed[key] = current[key];
      }
    } else {
      if (current[key] !== initial[key] && typeof current[key] === typeof initial[key]) {
        changed[key] = current[key];
      }
    }
  }
  return changed as Partial<T>;
}
