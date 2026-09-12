// Raw SVG sources inlined at build time for server-side rendering.
//
// Each import resolves to the file's text via the `".svg": "text"` loader
// configured in angular.json. This module is only referenced from
// `app.config.server.ts`, so the strings are bundled into the server output and
// never shipped to the browser. Rendering the real markup during SSR lets
// ngx-fast-svg hydrate the icons from the DOM on the client with no network
// request and no loader-fallback flash.
//
// Keys must match the `name` used in templates (`<fast-svg name="...">`). Any
// icon without an entry here simply falls back to the loader placeholder.
import account from '../../assets/svg-icons/account.svg';
import back from '../../assets/svg-icons/back.svg';
import deleteIcon from '../../assets/svg-icons/delete.svg';
import error from '../../assets/svg-icons/error.svg';
import genre from '../../assets/svg-icons/genre.svg';
import imdb from '../../assets/svg-icons/imdb.svg';
import moviesLogo from '../../assets/svg-icons/movies-logo.svg';
import play from '../../assets/svg-icons/play.svg';
import popular from '../../assets/svg-icons/popular.svg';
import sad from '../../assets/svg-icons/sad.svg';
import search from '../../assets/svg-icons/search.svg';
import tmdbLogo from '../../assets/svg-icons/tmdb-logo.svg';
import topRated from '../../assets/svg-icons/top_rated.svg';
import upcoming from '../../assets/svg-icons/upcoming.svg';
import website from '../../assets/svg-icons/website.svg';

export const SVG_ICONS: Record<string, string> = {
  account,
  back,
  delete: deleteIcon,
  error,
  genre,
  imdb,
  'movies-logo': moviesLogo,
  play,
  popular,
  sad,
  search,
  'tmdb-logo': tmdbLogo,
  top_rated: topRated,
  upcoming,
  website,
};
