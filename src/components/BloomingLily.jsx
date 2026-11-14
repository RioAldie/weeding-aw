import { motion } from 'framer-motion';

/**
 * SVG white lily that "blooms" when scrolled into view:
 * the stem & leaves draw themselves, then six petals unfold from the center,
 * stamens pop out, and the flower keeps swaying gently.
 */
const PETAL = 'M0 0 C14 -18 16 -52 0 -78 C-16 -52 -14 -18 0 0Z';

export default function BloomingLily({ className = '', flip = false, delay = 0 }) {
  const ease = [0.22, 1, 0.36, 1];
  return (
    <motion.svg
      viewBox="-100 -110 200 330"
      className={className}
      style={{ scaleX: flip ? -1 : 1 }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      aria-hidden
    >
      <defs>
        <radialGradient id="lilyPetal" cx="0.5" cy="1" r="1">
          <stop offset="0%" stopColor="#E6EFD3" />
          <stop offset="35%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FAF7EF" />
        </radialGradient>
      </defs>

      {/* Stem */}
      <motion.path
        d="M0 10 C6 80 -10 150 4 220"
        fill="none" stroke="#8A9A5B" strokeWidth="3" strokeLinecap="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.4, delay, ease } } }}
      />
      {/* Leaves */}
      {[
        'M2 120 C30 100 60 100 80 70 C50 80 25 95 2 120Z',
        'M-2 170 C-30 150 -62 150 -84 120 C-52 128 -24 145 -2 170Z',
      ].map((d, i) => (
        <motion.path
          key={i} d={d} fill="#8A9A5B" fillOpacity="0.85" stroke="#2C4C3B" strokeWidth="0.6"
          variants={{
            hidden: { pathLength: 0, fillOpacity: 0 },
            show: { pathLength: 1, fillOpacity: 0.85, transition: { duration: 1, delay: delay + 0.6 + i * 0.2 } },
          }}
        />
      ))}

      {/* Swaying flower head */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '0px', originY: '10px' }}
      >
        {[-75, -25, 25, 75, -50, 50].map((angle, i) => (
          <g key={i} transform="translate(0 10)"><motion.g
            style={{ originX: '0px', originY: '0px' }}
            variants={{
              hidden: { rotate: 0, scale: 0.2, opacity: 0 },
              show: {
                rotate: angle,
                scale: i > 3 ? 0.85 : 1,
                opacity: 1,
                transition: { duration: 1.6, delay: delay + 1.2 + i * 0.12, ease },
              },
            }}
          >
            <path d={PETAL} fill="url(#lilyPetal)" stroke="#E3DCCB" strokeWidth="0.8" />
            <path d="M0 -4 L0 -70" stroke="#DCE6C6" strokeWidth="0.8" />
          </motion.g></g>
        ))}

        {/* Stamens */}
        {[-30, -12, 8, 26].map((a, i) => (
          <g key={a} transform={`translate(0 10) rotate(${a})`}><motion.g
            variants={{ hidden: { opacity: 0, scale: 0 }, show: { opacity: 1, scale: 1, transition: { delay: delay + 2.2 + i * 0.08 } } }}
          >
            <line x1="0" y1="0" x2="0" y2="-55" stroke="#C9D8A8" strokeWidth="1.2" />
            <ellipse cx="0" cy="-58" rx="5" ry="2.2" fill="#D4AF37" />
          </motion.g></g>
        ))}
      </motion.g>
    </motion.svg>
  );
}

