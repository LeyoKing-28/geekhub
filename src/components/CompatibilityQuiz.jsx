import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Terminal, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    category: "Coding & Philosophy",
    prompt: "In your ideal pair programming date, what editor setup are we using?",
    options: [
      { text: "Neovim with customized Lua configs & tmux", score: 95, vibe: "True Terminal Purist" },
      { text: "VS Code with GitHub Copilot & Tokyo Night theme", score: 88, vibe: "Pragmatic & Modern" },
      { text: "JetBrains IDE with 40 tabs and memory warning", score: 82, vibe: "Enterprise Veteran" },
      { text: "Google Docs (for chaotic evil vibes)", score: 40, vibe: "Chaotic Rebel" }
    ]
  },
  {
    id: 2,
    category: "Sci-Fi & Universe",
    prompt: "Choose your ideal weekend marathon watch:",
    options: [
      { text: "Blade Runner 2049 + Cyberpunk: Edgerunners", score: 96, vibe: "Dystopian Neon Dreamer" },
      { text: "Neon Genesis Evangelion + End of Evangelion", score: 92, vibe: "Existential Mech Thinker" },
      { text: "Lord of the Rings: Extended Edition (all 12 hours)", score: 94, vibe: "High Fantasy Legend" },
      { text: "Interstellar + Dune Part Two", score: 90, vibe: "Cosmic Odyssey Explorer" }
    ]
  },
  {
    id: 3,
    category: "Tabletop & Gaming",
    prompt: "A wild bug corrupts production at 2:00 AM on a Friday. What do you do?",
    options: [
      { text: "Roll a d20 for initiative and git revert with coffee", score: 95, vibe: "Dungeon Master Resilience" },
      { text: "Bisect commit history like Sherlock Holmes", score: 91, vibe: "Algorithmic Detective" },
      { text: "Blame the DNS server and log into Steam instead", score: 85, vibe: "Relatable Gamer" },
      { text: "Fix it in 2 minutes with a zero-day patch and flex", score: 93, vibe: "10x Legend" }
    ]
  },
  {
    id: 4,
    category: "Geek Lifestyle",
    prompt: "What is the ultimate first date itinerary?",
    options: [
      { text: "Vintage arcade bar followed by late-night ramen and tech debate", score: 98, vibe: "Flawless Synergy" },
      { text: "Browsing a niche manga/board game cafe together", score: 94, vibe: "Cozy Cozy Vibes" },
      { text: "Soldering custom macro pads and lubricating keyboard switches", score: 92, vibe: "Hardware Artisan" },
      { text: "Attending a local 48-hour game jam as a dynamic duo", score: 95, vibe: "Power Couple" }
    ]
  }
];

export default function CompatibilityQuiz({ onQuizCompleted }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelect = (option) => {
    const updated = { ...selectedAnswers, [currentIdx]: option };
    setSelectedAnswers(updated);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onQuizCompleted) {
        onQuizCompleted(calculateAverage(updated));
      }
    }
  };

  const calculateAverage = (answers) => {
    const values = Object.values(answers);
    if (!values.length) return 0;
    const total = values.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(total / values.length);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowResult(false);
  };

  const finalScore = calculateAverage(selectedAnswers);

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 182, 212, 0.15)'
      }}>
        {!showResult ? (
          <div>
            {/* Header info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-glass)',
              paddingBottom: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Terminal size={18} color="#06b6d4" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#06b6d4' }}>
                  compatibility_eval.sh [Step {currentIdx + 1}/{QUESTIONS.length}]
                </span>
              </div>
              <span style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)'
              }}>
                {currentQ.category}
              </span>
            </div>

            {/* Question Prompt */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              lineHeight: '1.5',
              color: '#ffffff',
              marginBottom: '1.5rem'
            }}>
              {currentQ.prompt}
            </h3>

            {/* Option Choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt)}
                  className="btn-glass"
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    lineHeight: '1.4',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      color: '#a855f7',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}>
                      0x{i + 1}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  <ArrowRight size={16} color="var(--text-faint)" />
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div style={{
              marginTop: '2rem',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '999px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%`,
                background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ) : (
          /* Result View */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.2))',
              border: '2px solid #06b6d4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
            }}>
              <Zap size={40} color="#06b6d4" />
            </div>

            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: '#c084fc',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Evaluation Completed
            </span>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', margin: '0.5rem 0' }}>
              {finalScore}% Geek Synergy
            </h2>

            <p style={{
              maxWidth: '480px',
              margin: '0 auto 1.5rem auto',
              color: '#94a3b8',
              lineHeight: '1.6',
              fontSize: '0.95rem'
            }}>
              Your algorithmic profile indicates a high affinity for deep tech conversations, sci-fi worldbuilding, and optimal keyboard acoustics. Elena and Marcus are a 95%+ match for you!
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleReset}
                className="btn-glass"
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem'
                }}
              >
                <RotateCcw size={16} />
                <span>Re-run Diagnostic</span>
              </button>

              <button
                onClick={() => {}}
                className="btn-neon-purple"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem'
                }}
              >
                <Sparkles size={16} />
                <span>Auto-Filter Matches</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
