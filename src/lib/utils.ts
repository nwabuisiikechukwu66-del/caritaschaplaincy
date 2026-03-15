import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMMM d, yyyy');
}

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}
