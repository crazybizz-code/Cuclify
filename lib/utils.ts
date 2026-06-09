import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency: string, locale: string = 'en-US'): string {
  const l = locale || 'en-US';
  try {
    return new Intl.NumberFormat(l, {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    console.error('[formatPrice] Error formatting price:', e);
    return `${currency || 'USD'} ${amount}`;
  }
}
