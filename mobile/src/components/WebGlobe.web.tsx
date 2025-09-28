import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

interface TripData {
  id: string;
  lat: number;
  lng: number;
  location: string;
  duration: number;
  occasion: string;
}

const WebGlobe: React.FC = () => {
  const globeRef = useRef<any>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [points] = useState<TripData[]>([
    { id: '1', lat: 35.6762, lng: 139.6503, location: 'Tokyo', duration: 7, occasion: 'Solo' },
    { id: '2', lat: 48.8566, lng: 2.3522, location: 'Paris', duration: 5, occasion: 'Honeymoon' },
    { id: '3', lat: 40.7128, lng: -74.006, location: 'New York', duration: 4, occasion: 'Vacation' },
    { id: '4', lat: -33.8688, lng: 151.2093, location: 'Sydney', duration: 6, occasion: 'Family' },
  ]);
  const [selected, setSelected] = useState<TripData | null>(null);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.4 }, 0);
  }, []);

  // Resize listener to keep globe centered and responsive
  useEffect(() => {
    const onResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Re-center POV based on size changes
  useEffect(() => {
    if (!globeRef.current) return;
    const altitude = size.width < 640 ? 3.0 : size.width < 1024 ? 2.6 : 2.4;
    globeRef.current.pointOfView({ lat: 0, lng: 0, altitude }, 0);
  }, [size]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'transparent', width: '100vw', height: '100vh' }}>
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        showAtmosphere={false}
        enablePointerInteraction={true}
        pointsData={points}
        pointAltitude={0.06}
        pointColor={() => '#4ade80'}
        pointRadius={0.7}
        pointResolution={8}
        pointLabel={(p: any) => `${p.location} - ${p.occasion}`}
        onPointClick={(p: any) => setSelected(p as TripData)}
      />
      {selected && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setSelected(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
          <div
            style={{
              position: 'relative',
              width: 340,
              maxWidth: '90vw',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderRadius: 16,
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              color: '#fff',
              padding: 16,
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', top: 8, right: 10, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 999, width: 28, height: 28, cursor: 'pointer' }}
              aria-label="Close"
            >
              ×
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{selected.location}</div>
              <div style={{ opacity: 0.85 }}>Occasion: {selected.occasion}</div>
              <div style={{ opacity: 0.85 }}>Duration: {selected.duration} days</div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
                Tip: Click outside or the × to close.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebGlobe;
