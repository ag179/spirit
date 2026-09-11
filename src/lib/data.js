import retreatData from '../data/retreats.json' with { type: 'json' };
import { PLACEMENTS } from '../config.mjs';

// Bayesian ranking to avoid outliers
export function computeRanking(retreats) {
  // Calculate dataset mean
  const ratings = retreats
    .filter(r => r.rating)
    .map(r => parseFloat(r.rating) || 0);

  const datasetMean = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 4.5;

  const PRIOR = 12; // "benefit of the doubt" reviews

  return retreats.map(retreat => {
    const n = parseFloat(retreat.reviews) || 0;
    const rating = parseFloat(retreat.rating) || datasetMean;

    const bayesianScore = (PRIOR * datasetMean + n * rating) / (PRIOR + n);

    return {
      ...retreat,
      displayRating: rating, // Show unmodified rating
      rankingScore: bayesianScore, // Use for sorting
      isFeatured: PLACEMENTS.featured.includes(retreat.slug)
    };
  });
}

// Get all retreats with rankings
export function getAllRetreats() {
  return computeRanking(retreatData);
}

// Get retreats by city
export function getRetreatsbyCity(citySlug) {
  const retreats = getAllRetreats()
    .filter(r => r.citySlug === citySlug)
    .sort((a, b) => {
      // Featured first
      if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1;
      // Then by ranking score
      return b.rankingScore - a.rankingScore;
    });

  return retreats;
}

// Get all cities
export function getCities() {
  const citiesMap = new Map();

  retreatData.forEach(retreat => {
    if (!citiesMap.has(retreat.city)) {
      citiesMap.set(retreat.city, {
        name: retreat.city,
        slug: retreat.citySlug,
        state: retreat.state,
        count: 0,
        lat: retreat.latitude,
        lng: retreat.longitude
      });
    }
    citiesMap.get(retreat.city).count++;
  });

  return Array.from(citiesMap.values()).sort((a, b) => b.count - a.count);
}

// Get all services/categories
export function getServices() {
  const servicesMap = new Map();

  retreatData.forEach(retreat => {
    const categories = (retreat.subtypes || '').split(',').map(s => s.trim()).filter(Boolean);
    categories.forEach(cat => {
      if (!servicesMap.has(cat)) {
        servicesMap.set(cat, { name: cat, slug: cat.toLowerCase().replace(/\s+/g, '-'), count: 0 });
      }
      servicesMap.get(cat).count++;
    });
  });

  return Array.from(servicesMap.values())
    .filter(s => s.count > 1) // Only services with 2+ retreats
    .sort((a, b) => b.count - a.count);
}

// Get single retreat
export function getRetreat(slug) {
  const retreat = retreatData.find(r => r.slug === slug);
  if (!retreat) return null;

  const withRanking = computeRanking([retreat])[0];
  return withRanking;
}
