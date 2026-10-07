import React, { useState } from 'react';
import { findTopKPeers } from '../algorithms/similarity';
import MetricsPanel from './MetricsPanel';
import Badge from './Badge';
import { Target, Zap, RefreshCw } from 'lucide-react';

export default function TopKPeerView({ pool }) {
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [kValue, setKValue] = useState(3);

  const targetUser = pool[selectedUserIndex] || pool[0];
  const result = findTopKPeers(targetUser, pool, kValue);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
          Top-K Peer Search (Min-Heap Selection)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
          Demonstrates $O(N \log K)$ retrieval vs $O(N \log N)$ sorting using a bounded priority queue / binary min-heap.
        </p>
      </div>

      <MetricsPanel metrics={result.metrics} />

      {/* Target Selector & K Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-glass)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={16} color="#ec4899" />
          <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>Select Target Geek:</span>
          <select
            value={selectedUserIndex}
            onChange={(e) => setSelectedUserIndex(Number(e.target.value))}
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#ffffff',
              border: '1px solid var(--border-glass)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem'
            }}
          >
            {pool.map((u, idx) => (
              <option key={u.id} value={idx}>{u.name} (@{u.handle})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-faint)' }}>K (Matches to return):</span>
          {[2, 3, 5].map(val => (
            <button
              key={val}
              onClick={() => setKValue(val)}
              className={kValue === val ? 'btn-neon-purple' : 'btn-glass'}
              style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem' }}
            >
              K={val}
            </button>
          ))}
        </div>
      </div>

      {/* Display Top-K matches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {result.matches.map((item, rank) => (
          <div key={item.user.id} className="glass-panel" style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(236, 72, 153, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                #{rank + 1}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                  {item.user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  @{item.user.handle}
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {item.user.tags.slice(0, 3).map((t, idx) => (
                    <Badge key={idx} tag={t} size="sm" />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ec4899' }}>
                {Math.round(item.score * 100)}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Jaccard/Cosine Metric</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
