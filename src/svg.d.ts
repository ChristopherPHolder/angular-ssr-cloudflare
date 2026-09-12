// SVG files imported from TypeScript resolve to their raw text content.
// Enabled by the `".svg": "text"` loader configured in angular.json and used to
// inline icons into the server bundle for SSR (see app/renderer/svg-icons.ts).
declare module '*.svg' {
  const content: string;
  export default content;
}
