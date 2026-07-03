import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge class names with Tailwind-aware conflict resolution.
 * Foundational helper shared by every component in the package.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
