import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { onImgError } from './LoveJourney.jsx';

const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

/** Pre-wedding photos — replace with your own shoot. */
const PHOTOS = [
  { src: u('1519741497674-611481863552'), caption: 'Golden hour' },
  { src: u('1511285560929-80b456fea0bc'), caption: 'Hand in hand' },
  { src: u('1465495976277-4387d4b0b4c6'), caption: 'The garden' },
  { src: u('1583939003579-730e3918a45a'), caption: 'Her smile' },
  { src: u('1522673607200-164d1b6ce486'), caption: 'Little moments' },
  { src: u('1606216794074-735e91aa2c92'), caption: 'Together' },
  { src: u('1529634806980-85c3dd6d34ac'), caption: 'Wanderers' },
  { src: u('1537633552985-df8429e8048b'), caption: 'Always' },
  { src: u('1516589178581-6cd7833ae3b2'), caption: 'Forever yours' },
];

function Photo({ p, index, onOpen, tall }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block w-full overflow-hidden rounded-2xl shadow-lg"
    >
      <img
        src={p.src}
        alt={p.caption}
        loading="lazy"
        onError={onImgError(`pw${index}`)}
        className={`w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110 ${tall ? 'aspect-[3/4]' : 'aspect-square'}`}
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-forest/70 via-forest/10 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="font-serif text-xl italic text-white">{p.caption}</span>
        <Expand size={18} className="text-white/80" />
      </div>
    </motion.button>
  );
}

function Lightbox({ index, setIndex }) {
  const close = () => setIndex(null);
  const step = (d) => setIndex((i) => (i + d + PHOTOS.length) % PHOTOS.length);

  // Keyboard navigation + scroll lock
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  });

  const p = PHOTOS[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={close}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-forest/90 p-4 backdrop-blur-md"
    >
      <AnimatePresence mode="wait">
        <motion.figure
          key={index}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => info.offset.x < -80 ? step(1) : info.offset.x > 80 && step(-1)}
          className="max-h-[85vh] max-w-4xl"
        >
          <img src={p.src.replace('w=900', 'w=1600')} alt={p.caption} onError={onImgError(`pw${index}`)} className="max-h-[78vh] w-auto rounded-lg object-contain shadow-2xl" draggable={false} />
          <figcaption className="mt-4 text-center font-serif text-2xl italic text-white">
            {p.caption} <span className="ml-2 font-sans text-xs not-italic tracking-widest text-white/50">{index + 1} / {PHOTOS.length}</span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      <button onClick={close} className="absolute right-5 top-5 rounded-full p-2 text-white/80 hover:bg-white/10" aria-label="Close"><X /></button>
      <button onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-8" aria-label="Previous"><ChevronLeft /></button>
      <button onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-8" aria-label="Next"><ChevronRight /></button>
    </motion.div>
  );
}

export default function Gallery() {
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Each column scrolls at its own speed for a parallax masonry effect
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const cols = [y1, y2, y3];

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-16 text-center">
          <p className="section-eyebrow mb-4">Pre-Wedding</p>
          <h2 className="text-4xl font-light md:text-6xl">Captured Moments</h2>
          <p className="mx-auto mt-4 max-w-md font-light text-forest/60">A few frames from our favourite days. Tap any photo to view it larger.</p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {cols.map((y, c) => (
            <motion.div key={c} style={{ y }} className={`space-y-4 md:space-y-6 ${c === 2 ? 'hidden md:block' : ''}`}>
              {PHOTOS.filter((_, i) => i % 3 === c).map((p) => {
                const idx = PHOTOS.indexOf(p);
                return <Photo key={idx} p={p} index={idx} onOpen={setActive} tall={(idx + c) % 2 === 0} />;
              })}
            </motion.div>
          ))}
        </div>
        {/* On mobile, show the third column's photos below in two columns */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:hidden">
          {PHOTOS.filter((_, i) => i % 3 === 2).map((p) => {
            const idx = PHOTOS.indexOf(p);
            return <Photo key={idx} p={p} index={idx} onOpen={setActive} />;
          })}
        </div>
      </div>

      <AnimatePresence>{active !== null && <Lightbox index={active} setIndex={setActive} />}</AnimatePresence>
    </section>
  );
}

