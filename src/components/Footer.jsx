import { Heart } from 'lucide-react';
import { COUPLE } from './Hero.jsx';

export default function Footer() {
  return (
    <footer className="bg-forest py-14 text-center text-white/80">
      <p className="font-serif text-3xl text-white">
        {COUPLE.name1} <span className="italic text-gold">&amp;</span> {COUPLE.name2}
      </p>
      <p className="mt-3 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em]">
        Made with <Heart size={12} className="fill-gold text-gold" /> · 2027
      </p>
    </footer>
  );
}

