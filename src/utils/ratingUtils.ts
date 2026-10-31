export const formatRating = (rating: number | null | undefined): string =>
  rating == null ? 'N/A' : rating.toFixed(1)
