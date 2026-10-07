/**
 * Similarity Algorithms & Top-K Retrieval
 * 
 * 1. Jaccard Similarity:
 *    J(A, B) = |A ∩ B| / |A ∪ B|
 *    Complexity: O(|A| + |B|) using Set intersection
 * 
 * 2. Cosine Similarity on Multi-dimensional Skill Vectors:
 *    cos(u, v) = (u · v) / (||u|| * ||v||)
 *    Complexity: O(D) where D is feature dimension
 * 
 * 3. Top-K Selection:
 *    Comparing O(N log N) via full sort vs O(N log K) via Min-Heap.
 */

// Jaccard similarity for categorical sets (tags, fandoms, topics)
export function calculateJaccard(setA, setB) {
  if (!setA.length && !setB.length) return 0;
  const sA = new Set(setA);
  const sB = new Set(setB);
  let intersectionCount = 0;
  for (const item of sA) {
    if (sB.has(item)) intersectionCount++;
  }
  const unionSize = sA.size + sB.size - intersectionCount;
  return unionSize === 0 ? 0 : intersectionCount / unionSize;
}

// Vector Cosine Similarity
export function calculateCosine(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Composite Geek Affinity Function combining categorical overlap & vector alignment
export function calculateGeekAffinity(user1, user2) {
  const skillJaccard = calculateJaccard(
    user1.tags.map(t => typeof t === 'string' ? t : t.id),
    user2.tags.map(t => typeof t === 'string' ? t : t.id)
  );

  const fandomJaccard = calculateJaccard(user1.fandoms || [], user2.fandoms || []);
  
  // Alignment bonus (e.g. indentation match, editor synergy)
  let habitMatch = 0;
  if (user1.stats?.tabVsSpace && user2.stats?.tabVsSpace) {
    habitMatch += (user1.stats.tabVsSpace === user2.stats.tabVsSpace) ? 0.2 : 0;
  }

  // Weightings: 50% skills, 30% fandoms/interests, 20% dev habits
  const finalAffinity = (0.5 * skillJaccard) + (0.3 * fandomJaccard) + (0.2 * (habitMatch || 0.5));
  return Math.min(1, Math.max(0, finalAffinity));
}

// Min-Heap implementation for optimal Top-K retrieval: O(N log K) instead of O(N log N)
class MinHeap {
  constructor() {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
  }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this._sinkDown(0);
    }
    return top;
  }

  _bubbleUp(idx) {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[idx].score < this.heap[parentIdx].score) {
        [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
        idx = parentIdx;
      } else {
        break;
      }
    }
  }

  _sinkDown(idx) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let smallest = idx;

      if (left < length && this.heap[left].score < this.heap[smallest].score) {
        smallest = left;
      }
      if (right < length && this.heap[right].score < this.heap[smallest].score) {
        smallest = right;
      }

      if (smallest !== idx) {
        [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
        idx = smallest;
      } else {
        break;
      }
    }
  }

  toArraySorted() {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }
}

// Find Top-K peers using Min-Heap
export function findTopKPeers(targetUser, candidatePool, k = 3) {
  let operations = 0;
  const startTime = performance.now();
  const minHeap = new MinHeap();

  for (const candidate of candidatePool) {
    if (candidate.id === targetUser.id) continue;
    operations++;
    const score = calculateGeekAffinity(targetUser, candidate);

    if (minHeap.size() < k) {
      minHeap.push({ user: candidate, score });
    } else if (score > minHeap.peek().score) {
      minHeap.pop();
      minHeap.push({ user: candidate, score });
    }
  }

  const durationMs = performance.now() - startTime;
  const topMatches = minHeap.toArraySorted();

  return {
    matches: topMatches,
    metrics: {
      algorithm: "Top-K Min-Heap Selection",
      inputSizeN: candidatePool.length,
      k,
      operations,
      theoreticalComplexity: "O(N log K)",
      comparedToFullSort: "O(N log N)",
      executionTimeMs: Number(durationMs.toFixed(3))
    }
  };
}
