/**
 * Greedy Bipartite / Multi-Role Squad Formation
 * 
 * Problem Formulation:
 * Form balanced squads of size S (e.g., 3 members: Frontend, Backend, ML/Systems)
 * to maximize total team synergy and role coverage.
 * 
 * Greedy Approximation Strategy:
 * 1. Seed teams with strongest complementary anchors.
 * 2. Iteratively pick candidates that maximize marginal team synergy gain.
 * 
 * Complexity:
 * - Time: O(M * N) where M is number of squads and N is pool size
 * - Space: O(N)
 */

import { calculateGeekAffinity } from './similarity';

export function formComplementarySquads(candidates, squadSize = 3) {
  const startTime = performance.now();
  let comparisons = 0;

  const pool = [...candidates];
  const squads = [];
  const logs = [];

  let squadId = 1;

  while (pool.length >= squadSize) {
    // 1. Pick leader (first available in pool)
    const leader = pool.shift();
    const currentSquad = [leader];
    logs.push(`Squad #${squadId}: Initialized with anchor ${leader.name}`);

    // 2. Greedily select squadSize - 1 complementary members
    while (currentSquad.length < squadSize && pool.length > 0) {
      let bestCandidateIdx = -1;
      let highestTeamGain = -Infinity;

      for (let i = 0; i < pool.length; i++) {
        const candidate = pool[i];
        // Calculate average affinity to all existing squad members
        let sumAffinity = 0;
        for (const member of currentSquad) {
          comparisons++;
          sumAffinity += calculateGeekAffinity(member, candidate);
        }
        const avgGain = sumAffinity / currentSquad.length;

        if (avgGain > highestTeamGain) {
          highestTeamGain = avgGain;
          bestCandidateIdx = i;
        }
      }

      if (bestCandidateIdx !== -1) {
        const selected = pool.splice(bestCandidateIdx, 1)[0];
        currentSquad.push(selected);
        logs.push(`Squad #${squadId}: Added ${selected.name} (Team Synergy: ${(highestTeamGain * 100).toFixed(1)}%)`);
      }
    }

    // Compute final intra-squad synergy
    let totalPairs = 0;
    let totalScore = 0;
    for (let i = 0; i < currentSquad.length; i++) {
      for (let j = i + 1; j < currentSquad.length; j++) {
        totalPairs++;
        totalScore += calculateGeekAffinity(currentSquad[i], currentSquad[j]);
      }
    }

    const teamSynergy = totalPairs > 0 ? Math.round((totalScore / totalPairs) * 100) : 0;

    squads.push({
      id: `squad-${squadId++}`,
      members: currentSquad,
      synergyScore: teamSynergy
    });
  }

  const durationMs = performance.now() - startTime;

  return {
    squads,
    unassigned: pool,
    logs,
    metrics: {
      algorithm: "Greedy Multi-Role Squad Formation",
      totalFormed: squads.length,
      unassignedCount: pool.length,
      comparisons,
      theoreticalComplexity: "O(K · N · S)",
      executionTimeMs: Number(durationMs.toFixed(3))
    }
  };
}
