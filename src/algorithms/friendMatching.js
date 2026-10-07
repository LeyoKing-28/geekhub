import { calculateJaccard } from './similarity';

/**
 * Calculates friendship affinity between two geeks based on:
 * - Shared technical skills (Jaccard similarity)
 * - Shared fandoms & hobbies (Jaccard similarity)
 * - Work & tooling synergy (editor, indentation habits)
 */
export function computeFriendAffinity(userA, userB) {
  const skillsA = (userA.skills || []).map(s => s.toLowerCase());
  const skillsB = (userB.skills || []).map(s => s.toLowerCase());
  const skillScore = calculateJaccard(skillsA, skillsB);

  const fandomsA = (userA.fandoms || []).map(f => f.toLowerCase());
  const fandomsB = (userB.fandoms || []).map(f => f.toLowerCase());
  const fandomScore = calculateJaccard(fandomsA, fandomsB);

  let habitBonus = 0;
  if (userA.stats?.tabVsSpace && userB.stats?.tabVsSpace) {
    if (userA.stats.tabVsSpace === userB.stats.tabVsSpace) habitBonus += 0.15;
  }
  if (userA.stats?.editor && userB.stats?.editor) {
    if (userA.stats.editor.includes(userB.stats.editor) || userB.stats.editor.includes(userA.stats.editor)) {
      habitBonus += 0.15;
    }
  }

  // Weightings: 45% skills, 40% fandoms/interests, 15% habits
  const rawAffinity = (0.45 * skillScore) + (0.4 * fandomScore) + habitBonus;
  return Math.min(0.99, Math.max(0.65, rawAffinity));
}

/**
 * Ranks friend discovery feed using background similarity algorithms
 */
export function rankFriendsFeed(currentUser, pool) {
  return pool.map(candidate => {
    const affinity = computeFriendAffinity(currentUser, candidate);
    return {
      ...candidate,
      matchPercentage: Math.round(affinity * 100)
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}
