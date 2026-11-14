import { useMemo } from 'react';

/**
 * GPU-composited falling white lily petals.
 * Uses pure CSS @keyframes with translate3d + rotate so it runs on the
 * compositor thread at 60fps on mobile without JS frame overhead or drop-shadow repaints.
 */
export default function FallingPetals({ count = 14 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * (100 / count) + Math.random() * 6) % 100}%`,
        size: 13 + Math.random() * 14,
        duration: `${11 + Math.random() * 9}s`,
        delay: `${-Math.random() * 18}s`,
        sway: `${(Math.random() > 0.5 ? 1 : -1) * (24 + Math.random() * 36)}px`,
        spin: `${Math.random() > 0.5 ? 360 : -360}deg`,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      <style>{`
        @keyframes petal-fall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg);
            opacity: 0;
          }
          8% { opacity: 0.9; }
          50% {
            transform: translate3d(var(--sway), 50vh, 0) rotate(calc(var(--spin) * 0.5));
          }
          92% { opacity: 0.9; }
          100% {
            transform: translate3d(0, 110vh, 0) rotate(var(--spin));
            opacity: 0;
          }
        }
        .lily-petal {
          will-change: transform;
          animation: petal-fall var(--dur) linear var(--delay) infinite;
        }
      `}</style>

      {petals.map((p, i) => (
        <div
          key={i}
          className="lily-petal absolute top-0"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.55,
            '--dur': p.duration,
            '--delay': p.delay,
            '--sway': p.sway,
            '--spin': p.spin,
          }}
        >
          <svg viewBox="0 0 20 32" className="h-full w-full">
            <path d="M10 0 C17 8 19 20 10 32 C1 20 3 8 10 0Z" fill="#FAF7EF" stroke="#E3EBCF" strokeWidth="0.6" />
            <path d="M10 3 L10 29" stroke="#E8E2D2" strokeWidth="0.6" />
          </svg>
        </div>
      ))}
    </div>
  );
}
