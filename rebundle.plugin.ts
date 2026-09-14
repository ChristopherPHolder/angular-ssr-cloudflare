import rebundle from '@rx-angular/rebundle';

/**
 * Merges the esbuild output chunks before they are written to disk, so the
 * browser fetches a handful of bundles instead of dozens of tiny ones.
 *
 * The plugin is a no-op for the server build and for non-optimised builds, so
 * `ng serve` is unaffected.
 */
export default () => rebundle();
