import React from 'react';
import { 
  Code2, 
  Terminal, 
  Dice5, 
  Dice6, 
  Gamepad2, 
  Cpu, 
  BookOpen, 
  Bot, 
  Tv, 
  Keyboard, 
  Headphones, 
  Flame, 
  Palette, 
  Sparkles, 
  Compass, 
  Shield, 
  Lock, 
  Radio, 
  GitBranch, 
  Scissors, 
  Dna, 
  Box 
} from 'lucide-react';

const ICON_MAP = {
  Code2, Terminal, Dice5, Dice6, Gamepad2, Cpu, BookOpen, Bot,
  Tv, Keyboard, Headphones, Flame, Palette, Sparkles, Compass,
  Shield, Lock, Radio, GitBranch, Scissors, Dna, Box
};

export default function Badge({ tag, size = "md" }) {
  const IconComponent = ICON_MAP[tag.icon] || Sparkles;
  const isSmall = size === "sm";

  return (
    <span 
      className={`badge-${tag.category || 'dev'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.3rem' : '0.45rem',
        padding: isSmall ? '3px 8px' : '5px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: isSmall ? '0.72rem' : '0.82rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        letterSpacing: '0.01em',
        transition: 'all 0.2s ease',
        cursor: 'default',
        userSelect: 'none'
      }}
      title={`Category: ${tag.category}`}
    >
      <IconComponent size={isSmall ? 12 : 14} />
      <span>{tag.label}</span>
    </span>
  );
}
