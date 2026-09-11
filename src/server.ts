import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine({
	// `localhost` is safe for local dev; Cloudflare guarantees it is never the
	// production host. Add each hostname the app is actually served from — the
	// SSR host guard rejects any request whose `host` header isn't listed.
	allowedHosts: [
		'localhost',
		'angular-ssr-cloudflare.toholderandrews-4c2.workers.dev',
	],
});

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(async (req) => {
	const res = await angularApp.handle(req);

	return res ?? new Response('Page not found.', { status: 404 });
});


export default { fetch: reqHandler };
