export function getClientSideCookie(name: string): string | null {
  if (typeof document === "undefined") return null; // safeguard for SSR

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}
