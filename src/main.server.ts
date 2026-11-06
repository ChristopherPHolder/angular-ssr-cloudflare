import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * The SSR contract vite-plugin-ngp expects: take a URL and the contents of
 * `index.html`, resolve to the rendered page.
 *
 * `allowedHosts` has to list every hostname the Worker answers for — Angular's
 * SSR host guard rejects any request whose `host` header isn't listed with
 * NG05706.
 *
 * The wildcard covers the Previews that CI deploys per pull request, which are
 * served from their own hostnames: `pr-<n>-angular-ssr-cloudflare.…` for the
 * Preview URL, `<deployment-id>-angular-ssr-cloudflare.…` for one deployment.
 * Angular matches a `*.` entry by suffix, so this is scoped to the account's
 * own subdomain rather than to `workers.dev` at large.
 */
export default function render(url: string, document: string): Promise<string> {
  return renderApplication(
    (context: BootstrapContext) => bootstrapApplication(App, config, context),
    {
      document,
      url,
      allowedHosts: [
        'localhost',
        'angular-ssr-cloudflare.toholderandrews-4c2.workers.dev',
        '*.toholderandrews-4c2.workers.dev',
      ],
    },
  );
}
