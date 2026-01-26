import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCookie = (key: string): string | null => {
  // Guard for SSR - document doesn't exist on server
  if (typeof document === 'undefined') {
    return null;
  }
  
  const cookies = Object. fromEntries(
    document. cookie.split('; ').map((v) => v.split(/=(.*)/s).map(decodeURIComponent)),
  );
  return cookies?.[key] ?? null;
};