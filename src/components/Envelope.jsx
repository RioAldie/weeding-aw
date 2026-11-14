import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { COUPLE } from './Hero.jsx';

/**
 * Intro screen: a sealed envelope. On click the wax seal breaks,
 * the flap swings open in 3D, the letter slides out, and the whole
 * scene zooms/fades away to reveal the website.
 *
 * phases: closed -> flap -> letter -> exit -> (onOpen)
 */
export default function Envelope({ onOpen, assetsReady = true }) {
  const [phase, setPhase] = useState('closed');
  const [animDone, setAnimDone] = useState(false);
  const [guestName] = useState('Rio Aldi Erwanto');

  // Lock page scroll while the envelope is shown
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Only reveal the site once both the envelope animation AND assets are ready
  useEffect(() => {
    if (animDone && assetsReady) onOpen();
  }, [animDone, assetsReady, onOpen]);

  const open = () => {
    if (phase !== 'closed') return;
    setPhase('flap');
    setTimeout(() => setPhase('letter'), 900);
    setTimeout(() => setPhase('exit'), 2700);
    setTimeout(() => setAnimDone(true), 3500);
  };

  const flapOpen = phase !== 'closed';
  const letterOut = phase === 'letter' || phase === 'exit';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-ivory to-[#F1EEE6] px-4"
      animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Soft radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.12),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: flapOpen ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-center"
      >
        <p className="section-eyebrow">This invitation is for</p>
        <p className="mt-2 font-serif text-2xl italic text-forest sm:text-3xl">{guestName}</p>
      </motion.div>

      {/* Envelope */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -2 }}
        animate={
          phase === 'exit'
            ? { opacity: 1, y: 120, scale: 1.4, rotate: 0 }
            : { opacity: 1, y: letterOut ? 80 : 0, rotate: flapOpen ? 0 : [-2, 2, -2] }
        }
        transition={
          flapOpen
            ? { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
            : { opacity: { duration: 1 }, y: { duration: 1 }, rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }
        }
        onClick={open}
        className="relative aspect-[3/2] w-[88vw] max-w-[520px] cursor-pointer select-none"
        style={{ perspective: 1400 }}
        role="button"
        aria-label="Open the invitation"
      >
        {/* Back of envelope (inside) */}
        <div className="absolute inset-0 rounded-md bg-[#EFE9DC] shadow-[0_30px_60px_-20px_rgba(44,76,59,0.35)]" />

        {/* Letter card */}
        <motion.div
          className="absolute inset-x-[6%] top-[6%] z-10 flex h-[88%] flex-col items-center justify-center rounded-sm border border-gold/30 bg-white px-4 text-center shadow-md"
          animate={letterOut ? { y: '-62%' } : { y: '0%' }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-sm italic text-forest/80 sm:text-base">Dear {guestName},</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.35em] text-sage sm:text-[10px]">Together with their families</p>
          <p className="mt-2 font-serif text-3xl text-forest sm:text-4xl">
            {COUPLE.name1} <span className="italic text-gold">&amp;</span> {COUPLE.name2}
          </p>
          <div className="my-2 h-px w-12 bg-gold/60" />
          <p className="font-serif text-sm italic text-forest/70 sm:text-base">request the pleasure of your company</p>
        </motion.div>

        {/* Front pocket: left, right & bottom folds */}
        <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 z-20 h-full w-full drop-shadow-sm">
          <defs>
            <linearGradient id="envSide" x1="0" x2="1">
              <stop offset="0%" stopColor="#F7F3EA" />
              <stop offset="100%" stopColor="#EDE6D6" />
            </linearGradient>
            <linearGradient id="envBottom" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#F4EFE4" />
              <stop offset="100%" stopColor="#FBF8F2" />
            </linearGradient>
          </defs>
          <path d="M0 0 L150 112 L0 200Z" fill="url(#envSide)" />
          <path d="M300 0 L150 112 L300 200Z" fill="url(#envSide)" />
          <path d="M0 200 L150 100 L300 200Z" fill="url(#envBottom)" stroke="#E4DCC8" strokeWidth="0.6" />
        </svg>

        {/* Top flap — rotates open in 3D; drops behind the letter once open */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[58%] origin-top"
          style={{ transformStyle: 'preserve-3d', zIndex: letterOut ? 5 : 30 }}
          animate={{ rotateX: flapOpen ? 180 : 0 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        >
          <svg viewBox="0 0 300 116" preserveAspectRatio="none" className="h-full w-full drop-shadow-[0_4px_4px_rgba(44,76,59,0.12)]">
            <path d="M0 0 L300 0 L158 112 Q150 118 142 112Z" fill="#F9F6EF" stroke="#E4DCC8" strokeWidth="0.6" />
          </svg>
        </motion.div>

        {/* Wax seal */}
        <AnimatePresence>
          {!flapOpen && (
            <motion.div
              key="seal"
              className="absolute left-1/2 top-[58%] z-40 -translate-x-1/2 -translate-y-1/2"
              exit={{ scale: 1.4, opacity: 0, rotate: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Pulsing halo hints that it's clickable */}
              <motion.span
                className="absolute inset-0 rounded-full bg-gold/40"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#E9CF7A,#C29A2E_55%,#8F6E1C)] shadow-[inset_0_-3px_6px_rgba(0,0,0,0.25),0_6px_14px_rgba(143,110,28,0.45)] sm:h-20 sm:w-20"
              >
                <div className="flex h-[78%] w-[78%] items-center justify-center rounded-full border border-[#F6E3A6]/60">
                  <span className="font-serif text-lg italic text-[#FFF6DA] drop-shadow sm:text-xl">
                    {COUPLE.name1[0]}&amp;{COUPLE.name2[0]}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.p
        animate={{ opacity: flapOpen ? 0 : [0.4, 1, 0.4] }}
        transition={flapOpen ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity }}
        className="mt-12 text-[11px] uppercase tracking-[0.4em] text-forest/60"
      >
        Tap the seal to open
      </motion.p>

      {/* Only shown if the connection is slow and assets are still loading after the envelope opens */}
      <AnimatePresence>
        {animDone && !assetsReady && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 font-serif text-base italic text-sage"
          >
            Preparing your invitation…
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
