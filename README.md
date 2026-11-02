# TVStar

A TV show discovery app built with Vue 3 for the frontend developer assignment. Shows come from the public [TVMaze API](https://www.tvmaze.com/api), are grouped by genre, sorted by rating, searchable, and each has a details page.

**Live demo:** https://tvstarvue.netlify.app

## Run it

Developed and tested with **Node.js 24.22.2** and **npm 11.19.1**. The minimum supported versions are listed under `engines` in `package.json`.

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reloading |
| `npm run test:unit` | Run the unit and component tests (Vitest, watch mode) |
| `npm run test:unit -- --run` | Run the tests once |
| `npm run type-check` | TypeScript check |
| `npm run lint` | oxlint and ESLint |
| `npm run format` | Prettier |
| `npm run build` | Type-check and production build |

## Features

- Horizontal rows of shows per genre, sorted by rating, with a "See all" page for each genre
- Genre pages can be sorted by rating, name or year
- Featured hero banner (highest rated show)
- Search by name: debounced, cancels outdated requests, query kept in the URL (`/discover?q=...`)
- Details page with summary, genres, facts and cast
- Favorites saved in localStorage
- English and Dutch (the interface, genre names and labels), saved between visits
- Lazy rendering: genre rows and genre grids are built in chunks as you scroll (IntersectionObserver); posters and routes load lazily too
- Responsive layout with a slide-in menu on phones
- Loading, error (with retry) and 404 states
- Accessibility: skip link, landmarks, labelled controls, visible focus, reduced-motion support

## Architecture

```
TVMaze API -> services/tvmazeService.ts -> stores (Pinia) -> views -> components
                                              ^
                    utils/ (pure functions)   composables/ (reusable logic)
```

```
src/
  components/  layout/ (sidebar, header)
               shows/ (card, grid, rows, hero)
               common/ (search, sort select, favorite button, language toggle, spinner, error, back to top)
  composables/ useDebounce, useThrottle, useLazyList, useGenreLabel
  i18n/        vue-i18n setup + en.json / nl.json
  router/      routes (lazy-loaded)
  services/    all HTTP lives here
  stores/      showStore, favoritesStore, preferencesStore
  types/       TypeScript types
  utils/       genre grouping, sorting, formatting
  views/       one file per page
  tests/       unit and component tests
```

## Decisions

- **Vue 3 + Composition API + `<script setup>` + TypeScript**: the framework used at ABN AMRO; the Composition API keeps logic reusable (composables) and typed.
- **Pinia (setup stores)**: the official store; data fetching, grouping and sorting live in the store so components stay presentational.
- **Vite**: fast dev server and builds; the only scaffolding used is `create-vue`.
- **Genres are routes** (`/genre/:genre`): deep-linkable and the Back button works.
- **Ratings come from the API** (`rating.average`, 0 to 10). They are formatted and used for sorting, never hard-coded. User-submitted ratings would need accounts and a backend, which is outside the brief.
- **Search state lives in the URL**: shareable, and Back restores the search. Debounce (400 ms) limits requests; `AbortController` cancels outdated ones.
- **Throttle on scroll**: the "back to top" button checks the scroll position at most every 150 ms.
- **IntersectionObserver for lazy rendering**: a throttled scroll listener can miss the final scroll event, so lists are extended when an invisible marker near the end comes into view. The data itself is fetched once.
- **The "Show index" endpoint** is the only source of genre data, so the first page (250 shows) is loaded once and cached in the store; search reaches the whole catalog.
- **API summaries are HTML**: they are stripped to text instead of using `v-html`, which avoids XSS.
- **Scoped CSS per component, design tokens in `main.css`**: styles cannot leak, lazy routes ship only their own CSS, and all colours and the font can be changed in one place.
- **Single dark theme**: kept minimal on purpose; a light theme was not required.
- **Show names and summaries stay in English** because they come from the API; everything else is translated.
- **No backend or login**: the data is public and favorites are stored in the browser.

## Tests

`npm run test:unit` covers the pure utils (grouping, sorting, formatting), debounce and throttle (with fake timers), the stores (with a mocked service), the translation files (both languages must have the same keys) and the `ShowCard` component.

## Quality checks

On the deployed site (mobile mode, Lighthouse): Accessibility 100, Best Practices 100, SEO 100.

## Deployment

Hosted on Netlify from the `main` branch. Build command `npm run build`, publish directory `dist`. A `public/_redirects` file sends every route to `index.html`, so refreshing a deep link such as `/shows/1` works.

## Possible improvements

End-to-end tests (Playwright),a voice input for searching and a backend with accounts for synced favorites and user ratings.