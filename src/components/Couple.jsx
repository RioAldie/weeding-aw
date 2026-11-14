import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from './Reveal.jsx';
import BloomingLily from './BloomingLily.jsx';

// Note: source.unsplash.com is deprecated; direct images.unsplash.com URLs are used instead.
const PEOPLE = [
  {
    role: 'The Bride',
    name: 'Prasyugi Endang Ambarwati',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    text: 'A lover of quiet mornings, wildflowers and old books. Ambar believes the best stories are written slowly, one page at a time.',
  },
  {
    role: 'The Groom',
    name: 'Wildan E',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    text: 'An architect who sketches on napkins and hikes on weekends. Wildan found his favourite design the day he met Ambar.',
  },
];

/** Image with a clip-path mask that opens as you scroll, plus inner parallax. */
function ParallaxImage({ src, alt, reverse }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const clip = useTransform(
    scrollYProgress,
    [0, 0.4],
    reverse ? ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'] : ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)']
  );
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.3, 1.1]);

  return (
    <motion.div ref={ref} style={{ clipPath: clip }} className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full shadow-xl">
      <motion.img src={src} alt={alt} loading="lazy" style={{ y, scale }} className="h-full w-full object-cover" />
      <div className="absolute inset-0 ring-1 ring-inset ring-gold/30 rounded-t-full" />
    </motion.div>
  );
}

export default function Couple() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgTextY = useTransform(scrollYProgress, [0, 1], ['-30%', '30%']);

  return (
    <section id="couple" ref={sectionRef} className="relative overflow-hidden bg-ivory py-24 md:py-36">
      {/* Background decorative word moving at a different speed */}
      <motion.div
        style={{ y: bgTextY }}
        className="pointer-events-none absolute inset-x-0 top-1/3 select-none text-center font-serif text-[22vw] italic leading-none text-sage/[0.07]"
      >
        Together
      </motion.div>

      {/* Blooming lilies framing the section */}
      <BloomingLily className="pointer-events-none absolute -left-10 top-10 w-32 opacity-90 md:left-0 md:w-48" />
      <BloomingLily flip delay={0.4} className="pointer-events-none absolute -right-10 bottom-24 w-28 opacity-90 md:right-4 md:w-44" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mb-20 text-center">
          <p className="section-eyebrow mb-4">Our Story</p>
          <h2 className="text-4xl font-light md:text-6xl">The Couple</h2>
        </Reveal>

        <div className="space-y-24 md:space-y-36">
          {PEOPLE.map((p, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={p.name}
                className={`flex flex-col items-center gap-10 md:gap-20 ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                <div className="w-full max-w-sm md:w-1/2">
                  <ParallaxImage src={p.img} alt={p.name} reverse={reverse} />
                </div>
                <Reveal className="text-center md:w-1/2 md:text-left" delay={0.15}>
                  <p className="section-eyebrow mb-3">{p.role}</p>
                  <h3 className="mb-6 text-4xl md:text-5xl">{p.name}</h3>
                  <div className="mx-auto mb-6 h-px w-16 bg-gold md:mx-0" />
                  <p className="text-lg font-light leading-relaxed text-forest/70">{p.text}</p>
                </Reveal>
              </div>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-28 max-w-2xl text-center">
          <p className="font-serif text-2xl italic leading-relaxed text-forest/80 md:text-3xl">
            “Whatever our souls are made of, his and mine are the same.”
          </p>
          <p className="mt-4 text-sm tracking-widest text-sage">— Emily Brontë</p>
        </Reveal>
      </div>
    </section>
  );
}

