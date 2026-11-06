import render from './main.server';

/**
 * Cloudflare Worker entry.
 *
 * Static assets are served by the asset worker before a request reaches here,
 * so everything that arrives is a page request: fetch the built `index.html`
 * through the ASSETS binding and render the route into it.
 *
 * In `vite dev` the binding is backed by the Vite dev server, so the template
 * already carries Vite's dev transforms.
 */
export default {
  async fetch(request, env) {
    const template = await env.ASSETS.fetch(new URL('/index.html', request.url));

    if (!template.ok) {
      return new Response('Not found.', { status: 404 });
    }

    const html = await render(request.url, await template.text());

    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=utf-8' },
    });
  },
} satisfies ExportedHandler<Env>;
