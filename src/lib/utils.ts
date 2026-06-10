/**
 * src/lib/utils.ts
 *
 * A tiny, dependency-free `cn` (classNames) utility similar to `clsx`.
 * It accepts strings, numbers, arrays, and objects and returns a single
 * space-separated className string. Useful for conditional Tailwind/CSS classes.
 *
 * Example:
 *   cn('btn', { 'btn-active': isActive }, ['mt-4', conditional && 'hidden'])
 *
 * This file is intentionally small and avoids external dependencies.
 */

type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassArray;
interface ClassDictionary {
  [key: string]: unknown;
}
interface ClassArray extends Array<ClassValue> {}

/**
 * Merge a list of class values into a normalized class string.
 * - Strings and numbers are included.
 * - Arrays are flattened recursively.
 * - Objects include keys whose values are truthy.
 * - Booleans/null/undefined/false are ignored.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  const add = (value: ClassValue) => {
    if (!value && value !== 0) return; // ignore falsey values except 0

    const type = typeof value;

    if (type === "string" || type === "number") {
      classes.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      for (const v of value) add(v);
      return;
    }

    if (type === "object") {
      const obj = value as ClassDictionary;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && (obj as any)[key]) {
          classes.push(key);
        }
      }
      return;
    }

    // ignore other types (boolean already handled by falsy check)
  };

  for (const input of inputs) add(input);

  return classes.join(" ").replace(/\s+/g, " ").trim();
}

export default cn;
