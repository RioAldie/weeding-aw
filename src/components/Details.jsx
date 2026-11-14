import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CalendarHeart, Clock, MapPin, Navigation, ExternalLink, CalendarPlus } from 'lucide-react';
import Reveal from './Reveal.jsx';
import BloomingLily from './BloomingLily.jsx';

const WEDDING_DATE = new Date('2027-06-12T16:00:00');
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Willow+Garden+Estate+Napa';
const GCAL_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ambar+%26+Wildan+Wedding&dates=20270612T160000/20270612T220000&location=Willow+Garden+Estate,+123+Meadow+Lane,+Napa';

function getTimeLeft() {
  const diff = Math.max(0, WEDDING_DATE - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/** Live countdown strip with subtle flip-in numbers. */
function Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Mins', value: time.minutes },
    { label: 'Secs', value: time.seconds },
  ];

  return (
    <Reveal delay={0.1} className="mx-auto mb-16 max-w-xl">
      <div className="glass grid grid-cols-4 divide-x divide-sage/20 rounded-2xl py-5 px-2 text-center">
        {units.map(({ label, value }) => (
          <div key={label} className="px-2">
            <motion.span
              key={value}
              initial={{ y: -6, opacity: 0.4 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="block font-serif text-3xl font-light text-forest sm:text-4xl"
            >
              {String(value).padStart(2, '0')}
            </motion.span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.25em] text-sage">{label}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/** Animated clock icon gimmick: hands tick continuously. */
function AnimatedClock() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-white">
      <Clock size={26} strokeWidth={1.25} className="opacity-25" />
      {/* Hour hand */}
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/2 left-1/2 h-3.5 w-[1.5px] -translate-x-1/2 origin-bottom rounded-full bg-current"
      />
      {/* Minute hand */}
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/2 left-1/2 h-5 w-[1.5px] -translate-x-1/2 origin-bottom rounded-full bg-current"
      />
      <span className="absolute h-1.5 w-1.5 rounded-full bg-current" />
    </div>
  );
}

/** Pulsing radar rings behind the MapPin icon. */
function PulsingPin() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      {[0, 1].map((ring) => (
        <motion.span
          key={ring}
          animate={{ scale: [1, 1.75], opacity: [0.55, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: ring * 1.1, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border border-gold/50"
        />
      ))}
      <motion.div
        whileHover={{ y: -4 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-white/60 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-white"
      >
        <MapPin size={26} strokeWidth={1.25} />
      </motion.div>
    </div>
  );
}

export default function Details() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const blob1 = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const blob2 = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section id="details" ref={ref} className="relative overflow-hidden bg-white py-24 md:py-36">
      <motion.div style={{ y: blob1 }} className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-sage/25 blur-3xl" />
      <motion.div style={{ y: blob2 }} className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mb-12 text-center">
          <p className="section-eyebrow mb-4">When &amp; Where</p>
          <h2 className="text-4xl font-light md:text-6xl">Event Details</h2>
          <BloomingLily className="mx-auto mt-4 h-24 w-16" delay={0.2} />
        </Reveal>

        <Countdown />

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1: The Date */}
          <Reveal delay={0}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
              <motion.div
                whileHover={{ y: -12, scale: 1.02, boxShadow: '0 30px 60px -15px rgba(44,76,59,0.22)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="glass group relative flex h-full flex-col items-center overflow-hidden rounded-3xl p-10 text-center"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-white"
                >
                  <CalendarHeart size={26} strokeWidth={1.25} />
                </motion.div>
                <p className="section-eyebrow mb-3">The Date</p>
                <h3 className="mb-2 text-3xl">Saturday</h3>
                <p className="mb-6 font-light text-forest/70">June 12th, 2027</p>
                <div className="mb-6 h-px w-10 bg-gold/60" />
                <motion.a
                  href={GCAL_URL}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 rounded-full border border-sage/40 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white"
                >
                  <CalendarPlus size={14} /> Add to Calendar
                </motion.a>
              </motion.div>
            </motion.div>
          </Reveal>

          {/* Card 2: The Time */}
          <Reveal delay={0.15}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}>
              <motion.div
                whileHover={{ y: -12, scale: 1.02, boxShadow: '0 30px 60px -15px rgba(44,76,59,0.22)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="glass group flex h-full flex-col items-center rounded-3xl p-10 text-center"
              >
                <div className="mb-6">
                  <AnimatedClock />
                </div>
                <p className="section-eyebrow mb-3">The Time</p>
                <h3 className="mb-2 text-3xl">4:00 PM</h3>
                <p className="mb-6 font-light text-forest/70">Ceremony begins</p>
                <div className="mb-6 h-px w-10 bg-gold/60" />
                <p className="text-sm italic text-sage">Reception to follow at 6:00 PM</p>
              </motion.div>
            </motion.div>
          </Reveal>

          {/* Card 3: The Venue + Direct Maps Button */}
          <Reveal delay={0.3}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}>
              <motion.div
                whileHover={{ y: -12, scale: 1.02, boxShadow: '0 30px 60px -15px rgba(44,76,59,0.22)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="glass group flex h-full flex-col items-center rounded-3xl p-10 text-center"
              >
                <div className="mb-6">
                  <PulsingPin />
                </div>
                <p className="section-eyebrow mb-3">The Venue</p>
                <h3 className="mb-2 text-3xl">Willow Garden Estate</h3>
                <p className="mb-6 font-light text-forest/70">123 Meadow Lane, Napa</p>
                <div className="mb-6 h-px w-10 bg-gold/60" />
                <motion.a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-forest px-6 py-3 text-xs uppercase tracking-[0.2em] text-white shadow-md transition-colors hover:bg-sage"
                >
                  {/* Shine sweep gimmick */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                  <Navigation size={14} className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  <span>Open in Maps</span>
                  <ExternalLink size={12} className="opacity-70" />
                </motion.a>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
