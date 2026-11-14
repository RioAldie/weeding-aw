import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Fixed full-page overlay of white lily petals drifting down,
 * swaying side to side and tumbling in 3D (rotateX/rotateY).
 */
export default function FallingPetals({ count = 16 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 14 + Math.random() * 18,
        duration: 12 + Math.random() * 12,
        delay: -Math.random() * 20, // negative = already mid-fall on load
        sway: 30 + Math.random() * 60,
        spin: Math.random() > 0.5 ? 360 : -360,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" style={{ perspective: 600 }} aria-hidden>
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute -top-10"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.6 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.sway, -p.sway / 2, p.sway / 3, 0],
            rotateZ: [0, p.spin],
            rotateX: [0, 180, 360],
            rotateY: [0, 120, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 20 32" className="h-full w-full drop-shadow-[0_2px_3px_rgba(44,76,59,0.15)]">
            <defs>
              <linearGradient id={`pg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#FBF8F1" />
                <stop offset="100%" stopColor="#E3EBCF" />
              </linearGradient>
            </defs>
            <path d="M10 0 C17 8 19 20 10 32 C1 20 3 8 10 0Z" fill={`url(#pg${i})`} opacity="0.9" />
            <path d="M10 3 L10 29" stroke="#E8E2D2" strokeWidth="0.6" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

