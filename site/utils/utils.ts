export const getStatsReviews = (data: any[]) => {
    const totalReviews = data.length;

    const ratingStats: any = {
      totalRating: 0,
      starsCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    data.forEach(review => {
      const rating = review.review.rating;
      ratingStats.totalRating += rating;
      ratingStats.starsCount[rating] += 1;
    });

    // Calcul du rating moyen (évite division par 0)
    const averageRating = totalReviews > 0 ? (ratingStats.totalRating / totalReviews).toFixed(2) : 0;

    return {...ratingStats, averageRating, totalReview: data.length };
  }

export const generateSlug = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
}