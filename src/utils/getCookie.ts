 import { cookies as serverCookies } from "next/headers";
import Cookies from "js-cookie";

/**
 * Get cookie value safely for both client and server.
 *
 * @param key The cookie name to fetch
 * @returns The cookie value as a string or undefined
 */
export async function getCookie(key: string): Promise<string | undefined> {
  if (typeof window === "undefined") {
    // ✅ Server-side
    const cookies = await serverCookies(); // <-- FIX
    return cookies.get(key)?.value;
  } else {
    // ✅ Client-side
    return Cookies.get(key);
  }
}

/**
 * Get parsed JSON cookie (e.g., objects stored via JSON.stringify)
 *
 * @param key The cookie name
 * @returns Parsed object or null
 */
export async function getParsedCookie<T = any>(key: string): Promise<T | null> {
  const raw = await getCookie(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`❌ Failed to parse cookie [${key}]:`, err);
    return null;
  }
}
