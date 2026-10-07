import React from 'react';
import { Cpu, Clock, BarChart2, Activity } from 'lucide-react';

export default function MetricsPanel({ metrics }) {
  if (!metrics) return null;

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.7)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      borderRadius: 'var(--radius-md)',
      padding: '1rem',
      marginBottom: '1.5rem',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '0.6rem',
        marginBottom: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700 }}>
          <Activity size={16} />
          <span>ALGORITHM ANALYSIS & BENCHMARKS</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
          {metrics.algorithm}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.75rem'
      }}>
        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Theoretical Complexity</div>
          <div style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
            {metrics.theoreticalComplexity}
          </div>
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Input Size (N)</div>
          <div style={{ fontSize: '1rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
            {metrics.inputSizeN || metrics.totalFormed || '-'}
          </div>
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Total Operations / Compares</div>
          <div style={{ fontSize: '1rem', color: '#f59e0b', fontWeight: 700, marginTop: '2px' }}>
            {metrics.totalComparisons ?? metrics.operations ?? metrics.comparisons ?? '-'}
          </div>
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Execution Runtime</div>
          <div style={{ fontSize: '1rem', color: '#ec4899', fontWeight: 700, marginTop: '2px' }}>
            {metrics.executionTimeMs} ms
          </div>
        </div>
      </div>
    </div>
  );
}
