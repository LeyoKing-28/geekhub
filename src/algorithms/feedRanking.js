import { calculateGeekAffinity, findTopKPeers } from './similarity';
import { runGaleShapley } from './galeShapley';
import { formComplementarySquads } from './squadFormation';
import { SAMPLE_PROFILES } from '../data/profiles';

/**
 * Reddit Feed Ranking Algorithm
 * Uses Vector/Jaccard similarity to calculate a personalized affinity score,
 * combined with standard Hacker News/Reddit decay ranking:
 * 
 * Score = (Upvotes + 1) * (1 + 2 * GeekAffinity) / (HoursOld + 2)^1.5
 */
export function rankFeedPosts(posts, currentUser, activeSubgeek = 'all') {
  const filtered = activeSubgeek === 'all' 
    ? [...posts] 
    : posts.filter(p => p.subgeek === activeSubgeek);

  const nowHours = 12; // baseline reference

  return filtered.map(post => {
    // Treat post author as a profile for affinity computation
    const syntheticAuthor = {
      id: post.author,
      tags: post.authorSkills || [],
      fandoms: post.authorFandoms || [],
      stats: { tabVsSpace: "2 Spaces" }
    };

    const affinity = calculateGeekAffinity(currentUser, syntheticAuthor);

    // Approximate hours from post string
    const match = post.timeAgo.match(/(\d+)/);
    const hoursAgo = match ? parseInt(match[1], 10) : 3;

    // Time decay formula with algorithmic relevance weight
    const gravity = 1.5;
    const popularityScore = post.upvotes + (post.commentCount * 1.5);
    const algorithmicBoost = 1 + (affinity * 2.5); // high affinity posts boosted up to 3.5x
    const rankedScore = (popularityScore * algorithmicBoost) / Math.pow(hoursAgo + 2, gravity);

    return {
      ...post,
      affinityScore: Math.round(affinity * 100),
      rankedScore
    };
  }).sort((a, b) => b.rankedScore - a.rankedScore);
}

/**
 * Suggested Peers / Mentors recommendation using Min-Heap Top-K
 */
export function getRecommendedPeers(currentUser, k = 4) {
  const topResult = findTopKPeers(currentUser, SAMPLE_PROFILES, k);
  return topResult.matches.map(m => ({
    ...m.user,
    matchPercentage: Math.round(m.score * 100)
  }));
}

/**
 * Auto-Pair / 1-on-1 Matching Service (Gale-Shapley)
 */
export function getAutomatedPairing(currentUser, pool = SAMPLE_PROFILES) {
  const mentors = pool.filter(p => p.headline?.toLowerCase().includes('senior') || p.tags.some(t => t.id === 'rust' || t.id === 'infosec'));
  const learners = [currentUser, ...pool.filter(p => !mentors.includes(p))];

  // Balance sets
  const size = Math.min(mentors.length, learners.length);
  const matched = runGaleShapley(mentors.slice(0, size), learners.slice(0, size), calculateGeekAffinity);
  return matched.pairs;
}

/**
 * Squad Generator for a Post
 */
export function generateSquadForPost(post, pool = SAMPLE_PROFILES) {
  const result = formComplementarySquads(pool, 3);
  return result.squads[0] || null;
}
