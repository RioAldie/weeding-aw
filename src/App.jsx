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

/** Root layout â€” envelope intro first, then the invitation sections. */
export default function App() {
  const [opened, setOpened] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Preload the heavy 3D chunk while the guest looks at the envelope
  useEffect(() => {
    import('./components/Scene3D.jsx');
  }, []);

  return (
    <main className="overflow-x-hidden">
      {!opened && <Envelope onOpen={() => setOpened(true)} />}

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

