import { WithContext } from './context.interface';

/**
 * Merges a partial `WithContext` update (e.g. a `{ loading: true }` emission
 * from `withLoadingEmission`, or `{ value: {...} }` from a resource) into the
 * current slice. The slice is `undefined` before its first emission, so this
 * falls back to an empty context instead of letting `patch()` warn about a
 * non-object original value. Nested `value` dictionaries are merged, not
 * replaced, so previously loaded entries survive later fetches.
 */
export function patchWithContext<T extends Record<string, unknown>>(
  current: WithContext<T> | undefined,
  update: Partial<WithContext<T>>,
  initialValue: T = {} as T,
): WithContext<T> {
  const base: WithContext<T> = current ?? { value: initialValue, loading: false };
  return {
    ...base,
    ...update,
    value: update.value !== undefined ? { ...base.value, ...update.value } : base.value,
  };
}
