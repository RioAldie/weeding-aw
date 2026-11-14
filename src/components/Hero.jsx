import { Suspense, lazy, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// Lazy-load the heavy 3D bundle so text paints immediately
const Scene3D = lazy(() => import('./Scene3D.jsx'));

export const COUPLE = { name1: 'Ambar', name2: 'Wildan' };

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Parallax: canvas drifts slowly, text moves faster & fades -> depth
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-white to-ivory">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </motion.div>

      {/* Soft vignette to keep text legible over 3D */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.3)_45%,transparent_75%)]" />

      <motion.div
        style={{ y: textY, opacity }}
        className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="section-eyebrow mb-6"
        >
          You are invited to the wedding of
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl font-light leading-tight text-forest sm:text-7xl md:text-8xl lg:text-9xl"
        >
          {COUPLE.name1}
          <span className="mx-3 block font-serif italic text-gold sm:inline">&amp;</span>
          {COUPLE.name2}
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="my-8 h-px w-32 bg-gold/70"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="font-serif text-xl tracking-widest text-sage md:text-2xl"
        >
          06 · 12 · 2027
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#couple"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-sage"
        aria-label="Scroll to explore"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll to explore</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={22} strokeWidth={1.25} />
        </motion.span>
      </motion.a>
    </section>
  );
}

