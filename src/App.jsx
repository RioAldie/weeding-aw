import { useEffect, useState } from 'react';
import Hero from './components/Hero.jsx';
import Couple from './components/Couple.jsx';
import LoveJourney from './components/LoveJourney.jsx';
import Gallery from './components/Gallery.jsx';
import Details from './components/Details.jsx';
import RSVP from './components/RSVP.jsx';
import Footer from './components/Footer.jsx';
import FallingPetals from './components/FallingPetals.jsx';
import Envelope from './components/Envelope.jsx';

const PRELOAD_IMAGES = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
];

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

/** Root layout — envelope intro first, then the invitation sections. */
export default function App() {
  const [opened, setOpened] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Preload 3D chunk, fonts, and key photos while the guest looks at the envelope
  useEffect(() => {
    const safety = setTimeout(() => setAssetsReady(true), 5000);
    Promise.all([
      import('./components/Scene3D.jsx'),
      document.fonts?.ready ?? Promise.resolve(),
      ...PRELOAD_IMAGES.map(preloadImage),
    ]).then(() => {
      clearTimeout(safety);
      setAssetsReady(true);
    });
    return () => clearTimeout(safety);
  }, []);

  return (
    <main className="overflow-x-hidden">
      {!opened && <Envelope assetsReady={assetsReady} onOpen={() => setOpened(true)} />}

      {/* Lily petals drift over both the envelope and the site */}
      <FallingPetals count={isMobile ? 8 : 16} />

      {/* Mount the site after opening so the hero intro animations play fresh */}
      {opened && (
        <>
          <Hero />
          <Couple />
          <LoveJourney />
          <Gallery />
          <Details />
          <RSVP />
          <Footer />
        </>
      )}
    </main>
  );
}
