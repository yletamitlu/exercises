export function hasField<K extends PropertyKey>(
	obj: unknown,
	field: K,
): obj is Record<K, unknown> {
	return typeof obj === 'object' && obj !== null && field in obj
}
