import {
  ApplicationConfig,
  Injectable,
  mergeApplicationConfig,
} from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideFastSVG, SvgLoadStrategy } from '@push-based/ngx-fast-svg';
import { EMPTY, Observable, of } from 'rxjs';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

/**
 * Server-safe SVG load strategy.
 *
 * The default `SvgLoadStrategyImpl` from ngx-fast-svg reads `window` in its
 * constructor, which throws during SSR. The original (Node) app worked around
 * this by reading icons from disk via `node:fs`, but that is not available on
 * the Cloudflare Workers runtime (`ssr.platform: "neutral"`).
 *
 * On the server we skip icon loading entirely: `load` completes without
 * emitting, so no SVG is cached into the server DOM (emitting an empty string
 * would make ngx-fast-svg parse `null` and crash). The suspense placeholder is
 * rendered during SSR and the browser strategy fetches the real icons after
 * hydration.
 */
@Injectable()
export class ServerSvgLoadStrategy implements SvgLoadStrategy {
  config(url: string): Observable<string> {
    return of(url);
  }
  load(): Observable<string> {
    return EMPTY;
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
      svgLoadStrategy: ServerSvgLoadStrategy,
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
