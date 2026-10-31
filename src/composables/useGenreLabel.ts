import { useI18n } from 'vue-i18n'

// The API gives English genre names ("Science-Fiction").
// This returns the translated name, or the original if we have no translation.
export function useGenreLabel() {
  const { t, te } = useI18n()

  return (genre: string) => {
    const key = `genres.${genre.toLowerCase().replace(/[^a-z]/g, '')}`
    return te(key) ? t(key) : genre
  }
}
