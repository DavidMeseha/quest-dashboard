import type { ProductForm } from '@/schemas/validation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChangedFields(initial: ProductForm, current: ProductForm) {
  const changed: Record<string, any> = {};
  let key: keyof ProductForm;
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
  return changed as Partial<ProductForm>;
}
