import React, { useState } from 'react';
import { runGaleShapley } from '../algorithms/galeShapley';
import { calculateGeekAffinity } from '../algorithms/similarity';
import MetricsPanel from './MetricsPanel';
import Badge from './Badge';
import { GitPullRequest, ArrowRight, Play, CheckCircle2, RefreshCw } from 'lucide-react';

export default function StableMatchView({ pool }) {
  // Split pool into Mentors & Learners or Frontend & Backend
  const half = Math.min(pool.length, 6);
  const groupA = pool.slice(0, Math.floor(half / 2));
  const groupB = pool.slice(Math.floor(half / 2), Math.floor(half / 2) * 2);

  const [result, setResult] = useState(() => runGaleShapley(groupA, groupB, calculateGeekAffinity));
  const [showTrace, setShowTrace] = useState(false);

  const handleRerun = () => {
    setResult(runGaleShapley(groupA, groupB, calculateGeekAffinity));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Description */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
          Gale-Shapley Stable Pair Matching
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
          Assigns mentors to mentees or pair-programming partners. Guarantees <strong>0 blocking pairs</strong> (mathematically stable matching in $O(N^2)$).
        </p>
      </div>

      <MetricsPanel metrics={result.metrics} />

      {/* Control bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={handleRerun} className="btn-neon-purple" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={15} />
          <span>Re-compute Matching</span>
        </button>
        <button 
          onClick={() => setShowTrace(!showTrace)} 
          className="btn-glass" 
          style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
        >
          {showTrace ? 'Hide Trace Logs' : 'View Step-by-Step Proposals'}
        </button>
      </div>

      {/* Trace Log View if toggled */}
      {showTrace && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          marginBottom: '1.5rem',
          maxHeight: '200px',
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem'
        }}>
          <div style={{ color: '#06b6d4', marginBottom: '6px' }}>Execution Trace:</div>
          {result.steps.map((st, i) => (
            <div key={i} style={{ color: st.type === 'SWITCH' ? '#f59e0b' : st.type === 'REJECT' ? '#ef4444' : '#10b981', marginBottom: '4px' }}>
              [{st.type}] {st.proposer ? `${st.proposer} proposed to ${st.candidate}` : `${st.actor}: ${st.reason}`}
            </div>
          ))}
        </div>
      )}

      {/* Resulting Stable Pairs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
        {result.pairs.map((pair, idx) => (
          <div key={idx} className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
                STABLE_PAIR_0x{idx + 1}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> {pair.affinityScore}% Synergy
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              {/* Member A */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{pair.memberA.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>@{pair.memberA.handle}</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {pair.memberA.tags.slice(0, 2).map((t, ti) => <Badge key={ti} tag={t} size="sm" />)}
                </div>
              </div>

              <ArrowRight size={18} color="#a855f7" />

              {/* Member B */}
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{pair.memberB.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>@{pair.memberB.handle}</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '6px' }}>
                  {pair.memberB.tags.slice(0, 2).map((t, ti) => <Badge key={ti} tag={t} size="sm" />)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
