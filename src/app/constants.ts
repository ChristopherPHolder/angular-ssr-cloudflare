// Absolute: a relative path resolves against the current route, so on
// /detail/movie/155 it asked for /detail/assets/... and got the SPA shell
// back as HTML, which paints as an empty plate.
export const POSTER_FALLBACK = `/assets/images/no_poster_available.jpg`;
export const MY_LIST_FALLBACK = `/assets/images/nothing.svg`;
export const defaultRedirectRoute = 'list/category/popular';
