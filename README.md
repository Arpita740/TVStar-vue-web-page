# TVStar

A TV show discovery app built with Vue 3 for the frontend developer assignment. Shows come from the public [TVMaze API](https://www.tvmaze.com/api), are grouped by genre, sorted by rating, searchable, and each has a details page.

## Run it

Requirements: **Node.js <24.22.2>** and **npm <11.19.1>** (the project needs Node 24.22.2).

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run test:unit` | Run the unit tests (Vitest) |
| `npm run type-check` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run build` | Type-check and production build |

## Features

- Horizontal rows of shows per genre, sorted by rating, with a "See all" grid page for each genre
- Featured hero banner (highest rated show)
- Search by name: debounced, cancels outdated requests, query kept in the URL (`/discover?q=...`)
- Details page with summary, genres, facts and cast
- Favorites saved in localStorage
- English and Dutch (the interface, genre names and labels), saved between visits
- Responsive layout with a slide-in menu on phones
- Loading, error (with retry) and 404 states
- Accessibility: skip link, landmarks, labelled controls, visible focus, reduced-motion support

## Architecture

```
TVMaze API -> services/tvmazeService.ts -> stores (Pinia) -> views -> components
                                              ^
                           utils/ (pure functions)  composables/ (debounce, throttle)
```

```
src/
  components/  layout/ (sidebar, header)  shows/ (card, grid, rows, hero)  common/ (search, spinner, error, ...)
  composables/ useDebounce, useThrottle, useGenreLabel
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
- **Search state lives in the URL**: shareable, and Back restores the search. Debounce (400 ms) limits requests; `AbortController` cancels outdated ones.
- **Throttle on scroll**: the "back to top" button checks scroll position at most every 150 ms.
- **The "Show index" endpoint** is the only source of genre data, so the first two pages (about 500 shows) are loaded once and cached in the store.
- **API summaries are HTML**: they are stripped to text instead of using `v-html`, which avoids XSS.
- **Single dark theme**: kept minimal on purpose; a light theme was not required.
- **Show names and summaries stay in English** because they come from the API; everything else is translated.

## Tests

`npm run test:unit` covers the pure utils, debounce and throttle (with fake timers), the stores (with a mocked service), the translation files (both languages must have the same keys) and the `ShowCard` component.

## Possible improvements

Pagination or infinite scroll beyond 500 shows, end-to-end tests (Playwright), focus trapping in the mobile menu.