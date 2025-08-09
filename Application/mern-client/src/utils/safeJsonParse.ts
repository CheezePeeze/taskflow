export function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error("[safeJsonParse] invalid JSON:", error, "raw", raw);
    return null;
  }
}
