export function toSnakeCase<T extends Record<string, any>>(
  obj: T
): Record<string, any> {
  if (Array.isArray(obj)) return obj.map(toSnakeCase) as any;

  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`),
        toSnakeCase(value),
      ])
    );
  }

  return obj;
}
