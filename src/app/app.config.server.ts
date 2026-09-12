import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

// NOTE: The original (Node/Fastify) app provided a filesystem-based fast-svg
// load strategy here that read icons from disk via `node:fs`. That is not
// available on the Cloudflare Workers runtime (`ssr.platform: "neutral"`), so
// it has been removed. Server-side icon loading therefore falls back to the
// browser `provideFastSVG` configuration from `app.config.ts`.
const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
