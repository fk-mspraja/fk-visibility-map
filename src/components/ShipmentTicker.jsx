import { useState, useEffect } from 'react';

// Live shipment events — rich multi-modal content with real vessel/flight names
const EVENTS = [
  { icon: 'ship',  color: [0, 229, 255],  text: 'Vessel MSC AURORA -- Shanghai \u2192 Rotterdam -- ETA 12 days' },
  { icon: 'plane', color: [255, 214, 0],  text: 'Flight CX-2204 -- Hong Kong \u2192 Memphis -- Departed 3hrs ago' },
  { icon: 'truck', color: [0, 230, 118],  text: 'Truck TRK-8823 -- Chicago \u2192 Dallas -- On Schedule' },
  { icon: 'train', color: [224, 64, 251], text: 'Train CR-7701 -- Chongqing \u2192 Duisburg -- Day 8 of 18' },
  { icon: 'ship',  color: [0, 229, 255],  text: 'Vessel EVER GIVEN -- Busan \u2192 Los Angeles -- ETA 9 days' },
  { icon: 'plane', color: [255, 214, 0],  text: 'Flight EK-9302 -- Dubai \u2192 Frankfurt -- In Flight' },
  { icon: 'truck', color: [0, 230, 118],  text: 'Truck LTL-4421 -- Rotterdam \u2192 Warsaw -- On Schedule' },
  { icon: 'ship',  color: [0, 229, 255],  text: 'Vessel ONE STORK -- Singapore \u2192 Rotterdam -- Suez Transit' },
  { icon: 'train', color: [224, 64, 251], text: 'Train KTZ-2201 -- Moscow \u2192 Hamburg -- Day 4 of 12' },
  { icon: 'plane', color: [255, 214, 0],  text: 'Flight QF-7824 -- Sydney \u2192 Los Angeles -- Overnight' },
  { icon: 'truck', color: [0, 230, 118],  text: 'Truck FTL-9102 -- Los Angeles \u2192 Chicago -- In Transit' },
  { icon: 'ship',  color: [0, 229, 255],  text: 'Vessel COSCO SHIPPING -- Ningbo \u2192 New York -- ETA 21 days' },
  { icon: 'train', color: [224, 64, 251], text: 'Train YUXINOU-405 -- Chongqing \u2192 Duisburg -- China-Europe Rail' },
  { icon: 'plane', color: [255, 214, 0],  text: 'Flight FX-9811 -- Memphis \u2192 Frankfurt -- Cargo 48 tons' },
  { icon: 'ship',  color: [0, 229, 255],  text: 'Vessel MSC OSCAR -- Jebel Ali \u2192 Felixstowe -- Red Sea Route' },
  { icon: 'truck', color: [0, 230, 118],  text: 'Truck EC-3345 -- Guayaquil \u2192 Lima -- Cross-Border' },
];

const MODE_LABELS = {
  ship:  'OCEAN',
  plane: 'AIR',
  truck: 'ROAD',
  train: 'RAIL',
};

export default function ShipmentTicker() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('in'); // 'in' | 'visible' | 'out'

  useEffect(() => {
    let timer;

    if (phase === 'in') {
      timer = setTimeout(() => setPhase('visible'), 400);
    } else if (phase === 'visible') {
      timer = setTimeout(() => setPhase('out'), 2800);
    } else if (phase === 'out') {
      timer = setTimeout(() => {
        setCurrentIdx(i => (i + 1) % EVENTS.length);
        setPhase('in');
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  const event = EVENTS[currentIdx];
  const [r, g, b] = event.color;

  const opacity = phase === 'visible' ? 1 : 0;
  const translateY = phase === 'in' ? 6 : phase === 'out' ? -6 : 0;

  return (
    <div style={{
      position: 'absolute',
      bottom: 68,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'rgba(6,6,18,0.65)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 8,
      padding: '8px 16px',
      whiteSpace: 'nowrap',
      opacity,
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      willChange: 'opacity, transform',
      ...(translateY !== 0 ? {
        transform: `translateX(-50%) translateY(${translateY}px)`,
      } : {
        transform: 'translateX(-50%) translateY(0)',
      }),
    }}>
      {/* Mode badge */}
      <span style={{
        display: 'inline-block',
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: `rgb(${r},${g},${b})`,
        background: `rgba(${r},${g},${b},0.12)`,
        border: `1px solid rgba(${r},${g},${b},0.25)`,
      }}>
        {MODE_LABELS[event.icon] || 'LIVE'}
      </span>

      {/* Event text */}
      <span style={{
        fontSize: 11,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: '0.02em',
      }}>
        {event.text}
      </span>

      {/* Live dot */}
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#00e676',
        boxShadow: '0 0 6px rgba(0,230,118,0.6)',
        animation: 'subtle-glow 2s ease-in-out infinite',
        flexShrink: 0,
      }} />
    </div>
  );
}
