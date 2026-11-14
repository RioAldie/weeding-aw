import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Send } from 'lucide-react';
import Reveal from './Reveal.jsx';
import BloomingLily from './BloomingLily.jsx';

const OPTIONS = [
  { value: 'attend', label: 'Will Attend' },
  { value: 'decline', label: 'Regretfully Decline' },
];

/** RSVP form — UI only. Submission is simulated with a timeout. */
export default function RSVP() {
  const [form, setForm] = useState({ name: '', attendance: 'attend', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1800);
  };

  const reset = () => {
    setForm({ name: '', attendance: 'attend', message: '' });
    setStatus('idle');
  };

  return (
    <section id="rsvp" className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <BloomingLily className="pointer-events-none absolute -left-8 bottom-0 w-36 md:left-6 md:w-56" />
      <BloomingLily flip delay={0.5} className="pointer-events-none absolute -right-8 top-16 hidden w-44 sm:block md:right-6" />

      <div className="relative mx-auto max-w-2xl px-6">
        <Reveal className="mb-14 text-center">
          <p className="section-eyebrow mb-4">Kindly Reply by May 1st</p>
          <h2 className="text-4xl font-light md:text-6xl">RSVP</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="glass space-y-10 rounded-3xl p-8 md:p-14">
            <div>
              <label htmlFor="name" className="section-eyebrow">Full Name</label>
              <input
                id="name"
                required
                value={form.name}
                onChange={update('name')}
                placeholder="Your name"
                className="input-field text-lg"
                disabled={status !== 'idle'}
              />
            </div>

            <fieldset>
              <legend className="section-eyebrow mb-4">Attendance</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {OPTIONS.map((o) => {
                  const active = form.attendance === o.value;
                  return (
                    <label
                      key={o.value}
                      className={`relative flex cursor-pointer items-center gap-3 rounded-full border px-5 py-3 transition-all duration-300 ${
                        active ? 'border-forest bg-forest text-white' : 'border-sage/40 hover:border-sage'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={o.value}
                        checked={active}
                        onChange={update('attendance')}
                        className="sr-only"
                        disabled={status !== 'idle'}
                      />
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${active ? 'border-gold' : 'border-sage'}`}>
                        {active && <motion.span layoutId="radio-dot" className="h-2 w-2 rounded-full bg-gold" />}
                      </span>
                      <span className="text-sm tracking-wide">{o.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="message" className="section-eyebrow">Message for the Couple</label>
              <textarea
                id="message"
                rows={3}
                value={form.message}
                onChange={update('message')}
                placeholder="Share your wishes…"
                className="input-field resize-none"
                disabled={status !== 'idle'}
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <motion.button
                type="submit"
                whileHover={status === 'idle' ? { scale: 1.03 } : {}}
                whileTap={status === 'idle' ? { scale: 0.97 } : {}}
                animate={{ width: status === 'idle' ? 220 : 64 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`relative flex h-14 items-center justify-center overflow-hidden rounded-full text-white shadow-lg transition-colors duration-500 ${
                  status === 'success' ? 'bg-gold' : 'bg-forest hover:bg-sage'
                }`}
                aria-live="polite"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'idle' && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 whitespace-nowrap text-sm uppercase tracking-[0.25em]">
                      Send RSVP <Send size={16} />
                    </motion.span>
                  )}
                  {status === 'loading' && (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 className="animate-spin" size={22} />
                    </motion.span>
                  )}
                  {status === 'success' && (
                    <motion.span key="success" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <Check size={26} strokeWidth={2.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                    <p className="font-serif text-2xl italic">
                      {form.attendance === 'attend' ? 'We can’t wait to celebrate with you!' : 'You will be missed — thank you for letting us know.'}
                    </p>
                    <button type="button" onClick={reset} className="mt-2 text-xs uppercase tracking-widest text-sage hover:text-forest">
                      Submit another response
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

