// Runtime guards for model-supplied props.
//
// Every block's props arrived as JSON over HTTP from a probabilistic system.
// `strict: true` is Anthropic-only and TypeScript checked nothing at runtime,
// so each block re-validates at its own boundary. The rule from the notes:
// degrade to less UI, never to a crash.

export const obj = (value: unknown): Record<string, unknown> =>
	(value ?? {}) as Record<string, unknown>;

export const isStr = (value: unknown): value is string => typeof value === "string";

export const isNum = (value: unknown): value is number =>
	typeof value === "number" && Number.isFinite(value);

export const strArr = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every(isStr);

interface ListSpec {
	/** Keys that must be present and be strings. */
	str?: string[];
	/** Keys that must be present and be finite numbers. */
	num?: string[];
	/** Keys that may be absent, but must be strings when present. */
	optStr?: string[];
	/** Keys that must be present and be arrays of strings. */
	strs?: string[];
}

/**
 * Validate an array of flat objects. Returns the typed array, or null if the
 * value is not a non-empty array of items matching the spec.
 */
export function list<T>(value: unknown, spec: ListSpec): T[] | null {
	if (!Array.isArray(value) || value.length === 0) return null;

	const ok = value.every((item) => {
		const candidate = obj(item);
		return (
			(spec.str ?? []).every((key) => isStr(candidate[key])) &&
			(spec.num ?? []).every((key) => isNum(candidate[key])) &&
			(spec.strs ?? []).every((key) => strArr(candidate[key])) &&
			(spec.optStr ?? []).every(
				(key) => candidate[key] === undefined || isStr(candidate[key]),
			)
		);
	});

	return ok ? (value as T[]) : null;
}

/** Clamp a model-supplied percentage into something a progress bar can show. */
export const pct = (value: number) => Math.max(0, Math.min(100, value));

/** Initials for an avatar fallback, derived rather than asked of the model. */
export const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("") || "?";
