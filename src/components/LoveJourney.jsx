import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Coffee, Plane, Home, Gem, Heart } from 'lucide-react';
import Reveal from './Reveal.jsx';

/** Milestones of the couple's story — edit freely. */
const MILESTONES = [
  { year: '2019', title: 'First Hello', icon: Coffee, text: 'A rainy afternoon, one shared table at a tiny café, and a conversation that lasted until closing time.', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
  { year: '2020', title: 'First Adventure', icon: Plane, text: 'Our first trip together — getting lost in the mountains and discovering we make a pretty good team.', img: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=800&q=80' },
  { year: '2022', title: 'A Home of Our Own', icon: Home, text: 'Mismatched mugs, a balcony full of lilies, and Sunday pancakes became our favourite tradition.', img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80' },
  { year: '2025', title: 'The Proposal', icon: Gem, text: 'Under the stars by the lake, he got down on one knee. She said yes before he finished the question.', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80' },
  { year: '2027', title: 'Forever Begins', icon: Heart, text: 'And now, we can’t wait to begin our greatest chapter — with you beside us.', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
];

/** Falls back to a seeded placeholder if an Unsplash photo is unavailable. */
export const onImgError = (seed) => (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = `https://picsum.photos/seed/${seed}/800/1000`;
};

function Milestone({ m, i }) {
  const left = i % 2 === 0;
  const Icon = m.icon;
  return (
    <div className={`relative flex flex-col gap-6 pl-14 md:flex-row md:items-center md:gap-16 md:pl-0 ${left ? '' : 'md:flex-row-reverse'}`}>
      {/* Node on the timeline */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 15 }}
        className="absolute left-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-white text-gold shadow-md md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
      >
        <Icon size={18} strokeWidth={1.5} />
      </motion.div>

      {/* Photo */}
      <motion.div
        initial={{ opacity: 0, x: left ? -60 : 60, rotate: left ? -4 : 4 }}
        whileInView={{ opacity: 1, x: 0, rotate: left ? -2 : 2 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ rotate: 0, scale: 1.03 }}
        className="md:w-1/2"
      >
        <div className={`bg-white p-3 pb-10 shadow-xl md:max-w-sm ${left ? 'md:ml-auto' : ''}`}>
          <img src={m.img} alt={m.title} loading="lazy" onError={onImgError(m.year)} className="aspect-[4/3] w-full object-cover" />
          <p className="mt-3 text-center font-serif text-lg italic text-forest/70">{m.year}</p>
        </div>
      </motion.div>

      {/* Text */}
      <Reveal delay={0.15} className={`md:w-1/2 ${left ? 'md:text-left' : 'md:text-right'}`}>
        <p className="font-serif text-5xl font-light text-gold/80">{m.year}</p>
        <h3 className="mt-1 text-3xl md:text-4xl">{m.title}</h3>
        <p className={`mt-4 max-w-md font-light leading-relaxed text-forest/70 ${left ? '' : 'md:ml-auto'}`}>{m.text}</p>
      </Reveal>
    </div>
  );
}

export default function LoveJourney() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  // Timeline line "draws" itself as you scroll
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const heartY = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-20 text-center">
          <p className="section-eyebrow mb-4">How It All Began</p>
          <h2 className="text-4xl font-light md:text-6xl">Our Love Journey</h2>
        </Reveal>

        <div ref={ref} className="relative space-y-20 md:space-y-32">
          {/* Track + animated fill */}
          <div className="absolute bottom-0 left-[21px] top-0 w-px bg-sage/20 md:left-1/2" />
          <motion.div style={{ scaleY: progress }} className="absolute bottom-0 left-[21px] top-0 w-px origin-top bg-gradient-to-b from-gold via-sage to-gold md:left-1/2" />
          {/* Travelling heart */}
          <motion.div style={{ top: heartY }} className="absolute left-[21px] z-20 -translate-x-1/2 -translate-y-1/2 text-gold md:left-1/2">
            <Heart size={14} className="fill-gold" />
          </motion.div>

          {MILESTONES.map((m, i) => (
            <Milestone key={m.year} m={m} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

