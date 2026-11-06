import { ConsoleLogger, LogLevel, NodeJSFileSystem } from '@angular/compiler-cli';
import { cloudflare } from '@cloudflare/vite-plugin';
import { ngp } from '@push-based/vite-plugin-ngp';
import { defineConfig, type Plugin } from 'vite';

/**
 * Partially compiled packages that have to reach Angular's linker before they
 * can run. `@angular/core` and `@angular/compiler` declare the `ɵɵngDeclare*`
 * functions but never need linking themselves.
 */
const PARTIALLY_COMPILED = [
  '@angular/common',
  '@angular/forms',
  '@angular/platform-browser',
  '@angular/platform-server',
  '@angular/router',
  '@push-based/ngx-fast-svg',
  '@rx-angular/cdk',
  '@rx-angular/state',
];

const LINKER_MARKER = 'ɵɵngDeclare';
const NEVER_LINKED = /[\\/]@angular[\\/](?:compiler|core)[\\/]/;

/**
 * Angular's linker, for the Cloudflare Worker environment only.
 *
 * ngp links libraries in two places: a `transform` hook, and a Rolldown plugin
 * it adds to the *client's* dependency optimizer. Neither reaches the Worker
 * environment — the Cloudflare plugin supplies that environment's optimizer
 * plugins, and ngp's transform filter is `/\.[cm]?js$/`, which the dev
 * server's dependency ids (`.../common.mjs?v=6288c9a3`) miss because of the
 * version query. An unlinked `@angular/common` then reaches workerd, asks for
 * the JIT compiler and the dev server never boots.
 *
 * Upstream it's a one-line widening of that filter to allow a query. Until
 * that lands, run the same linker here. Paired with the `optimizeDeps.exclude`
 * below, which keeps these packages in the transform pipeline instead of the
 * Cloudflare optimizer's pre-bundle, where no linker runs at all.
 */
function angularLinkerForWorker(): Plugin {
  let linker: Promise<unknown> | undefined;

  return {
    name: 'angular-linker-worker',
    applyToEnvironment: (environment) => environment.name === 'ssr',
    async transform(code, id) {
      const file = id.replace(/[?#].*$/, '');

      if (!code.includes(LINKER_MARKER) || !/\.[cm]?js$/.test(file) || NEVER_LINKED.test(file)) {
        return null;
      }

      linker ??= import('@angular/compiler-cli/linker/babel').then(({ createEs2015LinkerPlugin }) =>
        createEs2015LinkerPlugin({
          linkerJitMode: false,
          sourceMapping: false,
          fileSystem: new NodeJSFileSystem(),
          logger: new ConsoleLogger(LogLevel.warn),
        }),
      );

      const babel = await import('@babel/core');
      const result = await babel.transformAsync(code, {
        filename: file,
        configFile: false,
        babelrc: false,
        compact: false,
        sourceMaps: true,
        plugins: [await linker],
      });

      return result?.code == null ? null : { code: result.code, map: result.map };
    },
  };
}

export default defineConfig({
  plugins: [
    ngp({
      // `ssr` stays off on purpose. It would make ngp own the `ssr`
      // environment — its own outDir, its own build input, and a Node-based
      // render middleware — but the server here is a Cloudflare Worker that
      // has to run in workerd. The Cloudflare plugin owns that environment
      // instead, and ngp still compiles it correctly: it keys off the
      // environment's *consumer*, so the Worker gets the server compiler, with
      // no HMR code and `ngServerMode: true`.
      entries: ['src/main.ts', 'src/worker.ts'],
      budgets: [
        { type: 'initial', maximumWarning: '500kB', maximumError: '1MB' },
        { type: 'anyComponentStyle', maximumWarning: '4kB', maximumError: '8kB' },
      ],
    }),
    // `viteEnvironment.name: 'ssr'` is the full-stack wiring: the Worker
    // becomes the SSR environment rather than a standalone one beside the app.
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    angularLinkerForWorker(),
  ],
  environments: {
    ssr: {
      optimizeDeps: {
        // Keep these out of the Worker environment's pre-bundle so they pass
        // through the transform pipeline, where the linker above can see them.
        exclude: PARTIALLY_COMPILED,
      },
    },
  },
});
