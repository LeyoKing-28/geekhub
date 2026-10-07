/**
 * Gale-Shapley Algorithm (Stable Marriage Problem / Stable Matching)
 * 
 * Problem Formulation for GeekHub:
 * Given two disjoint sets of size N:
 *   - Set A: Group 1 (e.g. Frontend devs / Mentors)
 *   - Set B: Group 2 (e.g. Backend devs / Learners)
 * Each person ranks all members of the opposite group based on skill synergy & fandom overlap.
 * 
 * Guarantees:
 * - Finds a stable matching in O(N^2) time.
 * - No pair (a, b) exists such that both prefer each other over their assigned partners.
 * 
 * Complexity:
 * - Time Complexity: Worst-case O(N^2), Best-case O(N)
 * - Space Complexity: O(N^2) for ranking matrices / O(N) for matching tables
 */

export function runGaleShapley(groupA, groupB, calculateAffinity) {
  const n = groupA.length;
  const steps = [];
  let comparisonCount = 0;
  const startTime = performance.now();

  // 1. Build preference matrices
  // A's preference list: Array of B indices sorted by descending affinity
  const aPref = groupA.map((memberA, aIdx) => {
    const scoredB = groupB.map((memberB, bIdx) => {
      comparisonCount++;
      return { bIdx, score: calculateAffinity(memberA, memberB) };
    });
    scoredB.sort((x, y) => y.score - x.score);
    return scoredB.map(item => item.bIdx);
  });

  // B's ranking lookup table: bRank[bIdx][aIdx] gives the rank/priority of aIdx for member b
  // Lower number = higher preference (O(1) lookup during proposals)
  const bRank = Array.from({ length: n }, () => new Array(n));
  groupB.forEach((memberB, bIdx) => {
    const scoredA = groupA.map((memberA, aIdx) => {
      comparisonCount++;
      return { aIdx, score: calculateAffinity(memberB, memberA) };
    });
    scoredA.sort((x, y) => y.score - x.score);
    scoredA.forEach((item, rank) => {
      bRank[bIdx][item.aIdx] = rank;
    });
  });

  // 2. Tracking state
  // nextProposalIndex[aIdx]: pointer to the next candidate in aPref[aIdx] to propose to
  const nextProposalIndex = new Array(n).fill(0);
  // bPartner[bIdx]: current matched partner of bIdx, or -1 if unengaged
  const bPartner = new Array(n).fill(-1);
  // aPartner[aIdx]: current matched partner of aIdx, or -1
  const aPartner = new Array(n).fill(-1);

  // Queue/List of unengaged members of A
  const freeA = Array.from({ length: n }, (_, i) => i);

  // 3. Main Proposal Loop
  while (freeA.length > 0) {
    const a = freeA.shift();
    const candidateRankIdx = nextProposalIndex[a];
    const b = aPref[a][candidateRankIdx];
    nextProposalIndex[a]++;

    steps.push({
      type: "PROPOSAL",
      proposer: groupA[a].name,
      candidate: groupB[b].name,
      round: steps.length + 1
    });

    if (bPartner[b] === -1) {
      // b is free, accept proposal
      bPartner[b] = a;
      aPartner[a] = b;
      steps.push({
        type: "ENGAGED",
        actor: groupB[b].name,
        with: groupA[a].name,
        reason: `${groupB[b].name} was unassigned.`
      });
    } else {
      // b is already engaged, evaluate preference
      const currentPartnerA = bPartner[b];
      comparisonCount++;
      if (bRank[b][a] < bRank[b][currentPartnerA]) {
        // b prefers the new proposer 'a' over current partner
        bPartner[b] = a;
        aPartner[a] = b;
        aPartner[currentPartnerA] = -1;
        freeA.push(currentPartnerA); // previous partner becomes free

        steps.push({
          type: "SWITCH",
          actor: groupB[b].name,
          oldPartner: groupA[currentPartnerA].name,
          newPartner: groupA[a].name,
          reason: `Prefers ${groupA[a].name} over ${groupA[currentPartnerA].name}.`
        });
      } else {
        // b rejects proposal from 'a'
        freeA.push(a); // 'a' stays free to propose to next choice
        steps.push({
          type: "REJECT",
          actor: groupB[b].name,
          rejected: groupA[a].name,
          reason: `Already engaged to preferred partner ${groupA[currentPartnerA].name}.`
        });
      }
    }
  }

  const durationMs = performance.now() - startTime;

  // Format final pairs
  const pairs = groupA.map((memberA, aIdx) => {
    const bIdx = aPartner[aIdx];
    const memberB = groupB[bIdx];
    const affinity = calculateAffinity(memberA, memberB);
    return {
      memberA,
      memberB,
      affinityScore: Math.round(affinity * 100)
    };
  });

  return {
    pairs,
    steps,
    metrics: {
      algorithm: "Gale-Shapley (Deferred Acceptance)",
      inputSizeN: n,
      totalComparisons: comparisonCount,
      theoreticalComplexity: "O(N²)",
      maxPossibleSteps: n * n,
      actualStepsTaken: steps.length,
      executionTimeMs: Number(durationMs.toFixed(3))
    }
  };
}
