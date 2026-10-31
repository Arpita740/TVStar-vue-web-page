// TVMaze summaries contain HTML; strip it instead of using v-html (XSS-safe)
export const stripHtml = (html: string | null): string =>
  html ? html.replace(/<[^>]*>/g, '').trim() : ''
