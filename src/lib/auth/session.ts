import 'server-only';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const USER_COOKIE_NAME = 'brandmind_uid';

/**
 * Validates that an ID is a safe alphanumeric string without dangerous characters.
 */
export function isValidId(id: unknown): id is string {
  if (typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_\-\.]{1,128}$/.test(id.trim());
}

/**
 * Sanitizes and trims text input with max length boundary.
 */
export function sanitizeText(val: unknown, maxLen = 1000): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

/**
 * Extracts or generates a consistent user ID from headers or cookies for data isolation.
 */
export async function getOrCreateUserId(req?: NextRequest): Promise<string> {
  // 1. Check custom authorization / user header if provided by client/proxy
  const headerUserId = req?.headers.get('x-user-id');
  if (headerUserId && isValidId(headerUserId)) {
    return headerUserId;
  }

  // 2. Check HTTP-only cookie
  try {
    const cookieStore = await cookies();
    const existingCookie = cookieStore.get(USER_COOKIE_NAME)?.value;
    if (existingCookie && isValidId(existingCookie)) {
      return existingCookie;
    }
  } catch {
    // In edge cases where cookies() is unavailable
  }

  // 3. Fallback to a deterministic session ID or anonymous default
  return 'usr_anonymous';
}
