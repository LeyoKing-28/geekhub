import React, { useState } from 'react';
import { formComplementarySquads } from '../algorithms/squadFormation';
import MetricsPanel from './MetricsPanel';
import Badge from './Badge';
import { Users, Shield, RefreshCw } from 'lucide-react';

export default function SquadView({ pool }) {
  const [squadSize, setSquadSize] = useState(3);
  const [result, setResult] = useState(() => formComplementarySquads(pool, squadSize));

  const handleRun = (newSize = squadSize) => {
    setResult(formComplementarySquads(pool, newSize));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
          Greedy Multi-Role Squad Formation
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
          Partitions the geek community into optimal hackathon/project squads by maximizing marginal intra-team synergy.
        </p>
      </div>

      <MetricsPanel metrics={result.metrics} />

      {/* Control bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-faint)' }}>Squad Target Size:</span>
          {[2, 3, 4].map(s => (
            <button
              key={s}
              onClick={() => { setSquadSize(s); handleRun(s); }}
              className={squadSize === s ? 'btn-neon-purple' : 'btn-glass'}
              style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}
            >
              {s} Members
            </button>
          ))}
        </div>

        <button onClick={() => handleRun()} className="btn-neon-purple" style={{ padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} />
          <span>Re-partition Pool</span>
        </button>
      </div>

      {/* Squad Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {result.squads.map((squad) => (
          <div key={squad.id} className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                <Users size={16} />
                <span>{squad.id.toUpperCase()}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {squad.synergyScore}% Synergy
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {squad.members.map((member, mi) => (
                <div key={mi} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>{member.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>@{member.handle}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {member.tags.slice(0, 2).map((t, ti) => <Badge key={ti} tag={t} size="sm" />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
