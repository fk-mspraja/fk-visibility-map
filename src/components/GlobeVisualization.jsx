import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { Color as ThreeColor } from 'three';
import { getRealFacilities, getRealRoutes } from '../data/dataTransformer';
import StarField from './StarField';
import StatsPanel from './StatsPanel';
import Legend from './Legend';
import ShipmentTicker from './ShipmentTicker';

// ---------------------------------------------------------------------------
// Theme definitions
// ---------------------------------------------------------------------------
export const THEMES = {
  dark: {
    key: 'dark',
    bg: '#060612',
    panel: 'rgba(6,6,18,0.78)',
    panelBorder: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.4)',
    textSubtle: 'rgba(255,255,255,0.25)',
    globeImg: '//unpkg.com/three-globe/example/img/earth-night.jpg',
    bumpImg: '//unpkg.com/three-globe/example/img/earth-topology.png',
    atmosphere: '#1a4a8e',
    atmosphereAlt: 0.25,
    starField: true,
  },
  light: {
    key: 'light',
    bg: '#c8dff5',
    panel: 'rgba(255,255,255,0.82)',
    panelBorder: 'rgba(0,0,80,0.1)',
    text: '#0a1628',
    textMuted: 'rgba(10,22,40,0.55)',
    textSubtle: 'rgba(10,22,40,0.3)',
    globeImg: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bumpImg: '//unpkg.com/three-globe/example/img/earth-topology.png',
    atmosphere: '#4a90d9',
    atmosphereAlt: 0.15,
    starField: false,
  },
};

// ---------------------------------------------------------------------------
// Vehicle SVG icon generator — small, clean, glowing
// ---------------------------------------------------------------------------
function getVehicleIcon(mode, color) {
  const [r, g, b] = color;
  const hex = `rgb(${r},${g},${b})`;
  const glow = `drop-shadow(0 0 4px ${hex}) drop-shadow(0 0 8px rgba(${r},${g},${b},0.5))`;

  // All icons are top-down / side views matching real tracking apps
  // 20×20px — visible on globe at altitude 2.2
  const icons = {

    // Ship — top-down cargo container vessel (MSC/Maersk style, facing up = bow)
    ship: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 48" style="filter:${glow}">
      <!-- Hull outline: pointed bow top, squared stern bottom -->
      <path fill="${hex}" d="M12 1 L19 7 L20 40 L12 44 L4 40 L4 7 Z"/>
      <!-- Container rows stacked on deck -->
      <rect fill="rgba(0,0,0,0.4)" x="5.5" y="9"  width="13" height="4" rx="0.5"/>
      <rect fill="rgba(0,0,0,0.4)" x="5.5" y="14" width="13" height="4" rx="0.5"/>
      <rect fill="rgba(0,0,0,0.4)" x="5.5" y="19" width="13" height="4" rx="0.5"/>
      <rect fill="rgba(0,0,0,0.4)" x="5.5" y="24" width="13" height="4" rx="0.5"/>
      <!-- Container grid lines -->
      <line x1="9"  y1="9" x2="9"  y2="28" stroke="rgba(0,0,0,0.5)" stroke-width="0.5"/>
      <line x1="12" y1="9" x2="12" y2="28" stroke="rgba(0,0,0,0.5)" stroke-width="0.5"/>
      <line x1="15" y1="9" x2="15" y2="28" stroke="rgba(0,0,0,0.5)" stroke-width="0.5"/>
      <!-- Bridge/superstructure at stern -->
      <rect fill="rgba(${r},${g},${b},0.9)" x="7" y="31" width="10" height="7" rx="1"/>
      <rect fill="rgba(0,0,0,0.5)" x="8.5" y="32" width="3" height="2" rx="0.3"/>
      <rect fill="rgba(0,0,0,0.5)" x="12.5" y="32" width="3" height="2" rx="0.3"/>
      <!-- Funnel/chimney -->
      <rect fill="rgba(${r},${g},${b},0.7)" x="10.5" y="29" width="3" height="3" rx="0.5"/>
    </svg>`,

    // Plane — top-down aircraft
    plane: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" style="filter:${glow}">
      <ellipse fill="${hex}" cx="16" cy="16" rx="2.5" ry="11"/>
      <path fill="${hex}" d="M16 13 L4 19 L4 21 L16 18 L28 21 L28 19 Z"/>
      <path fill="${hex}" d="M16 24 L10 28 L10 29 L16 27 L22 29 L22 28 Z"/>
      <ellipse fill="rgba(${r},${g},${b},0.7)" cx="16" cy="5.5" rx="1.5" ry="2"/>
    </svg>`,

    // Truck — side-on semi truck
    truck: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 22" style="filter:${glow}">
      <rect fill="${hex}" x="1" y="4" width="20" height="11" rx="1.5"/>
      <path fill="${hex}" d="M21 6 L28 6 C30 6 32 8 33 10 L33 15 L21 15 Z"/>
      <path fill="rgba(${r},${g},${b},0.35)" d="M22 7.5 L28 7.5 C29.5 7.5 31 9 31.5 10.5 L22 10.5 Z"/>
      <circle fill="rgba(${r},${g},${b},0.9)" cx="7" cy="17" r="3"/>
      <circle fill="rgba(0,0,0,0.5)" cx="7" cy="17" r="1.5"/>
      <circle fill="rgba(${r},${g},${b},0.9)" cx="16" cy="17" r="3"/>
      <circle fill="rgba(0,0,0,0.5)" cx="16" cy="17" r="1.5"/>
      <circle fill="rgba(${r},${g},${b},0.9)" cx="28" cy="17" r="3"/>
      <circle fill="rgba(0,0,0,0.5)" cx="28" cy="17" r="1.5"/>
    </svg>`,

    // Train — side-on locomotive
    train: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 40 22" style="filter:${glow}">
      <rect fill="${hex}" x="2" y="4" width="34" height="12" rx="3"/>
      <path fill="rgba(${r},${g},${b},0.85)" d="M30 4 L36 4 C38 4 39 6 39 8 L39 14 C39 15 38 16 36 16 L30 16 Z"/>
      <rect fill="rgba(0,0,0,0.45)" x="5"  y="7" width="5" height="4" rx="1"/>
      <rect fill="rgba(0,0,0,0.45)" x="13" y="7" width="5" height="4" rx="1"/>
      <rect fill="rgba(0,0,0,0.45)" x="21" y="7" width="5" height="4" rx="1"/>
      <circle fill="rgba(255,255,200,0.9)" cx="37" cy="10" r="1.5"/>
      <circle fill="rgba(${r},${g},${b},0.9)" cx="9"  cy="18" r="3"/>
      <circle fill="rgba(0,0,0,0.5)" cx="9"  cy="18" r="1.5"/>
      <circle fill="rgba(${r},${g},${b},0.9)" cx="20" cy="18" r="3"/>
      <circle fill="rgba(0,0,0,0.5)" cx="20" cy="18" r="1.5"/>
      <circle fill="rgba(${r},${g},${b},0.9)" cx="31" cy="18" r="3"/>
      <circle fill="rgba(0,0,0,0.5)" cx="31" cy="18" r="1.5"/>
    </svg>`,
  };

  return `<div style="pointer-events:none;line-height:0;width:20px;height:20px;">${icons[mode] || icons.ship}</div>`;
}

// ---------------------------------------------------------------------------
// Great circle interpolation
// ---------------------------------------------------------------------------
function interpolateGreatCircle(lat1, lng1, lat2, lng2, t) {
  const toRad = d => (d * Math.PI) / 180;
  const toDeg = r => (r * 180) / Math.PI;

  const phi1 = toRad(lat1);
  const lam1 = toRad(lng1);
  const phi2 = toRad(lat2);
  const lam2 = toRad(lng2);

  const dLam = lam2 - lam1;
  const cosP2 = Math.cos(phi2);
  const sinP2 = Math.sin(phi2);
  const cosP1 = Math.cos(phi1);
  const sinP1 = Math.sin(phi1);

  const a = cosP2 * Math.sin(dLam);
  const b = cosP1 * sinP2 - sinP1 * cosP2 * Math.cos(dLam);
  const d = Math.atan2(
    Math.sqrt(a * a + b * b),
    sinP1 * sinP2 + cosP1 * cosP2 * Math.cos(dLam)
  );

  if (Math.abs(d) < 1e-10) {
    return { lat: lat1, lng: lng1 };
  }

  const A = Math.sin((1 - t) * d) / Math.sin(d);
  const B = Math.sin(t * d) / Math.sin(d);

  const x = A * cosP1 * Math.cos(lam1) + B * cosP2 * Math.cos(lam2);
  const y = A * cosP1 * Math.sin(lam1) + B * cosP2 * Math.sin(lam2);
  const z = A * sinP1 + B * sinP2;

  return {
    lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
    lng: toDeg(Math.atan2(y, x)),
  };
}

// ---------------------------------------------------------------------------
// Altitude config per transport mode (react-globe.gl units, 0-1 relative to globe radius)
// ---------------------------------------------------------------------------
const ARC_ALT = { air: 0.12, ocean: 0.06, truck: 0.003, rail: 0.015 };
const VEHICLE_SPEED = { ocean: 0.00012, air: 0.0004, truck: 0.0002, rail: 0.00015 };

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function GlobeVisualization() {
  const globeRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [vehicles, setVehicles] = useState([]);
  const [activeMode, setActiveMode] = useState(null); // null = all modes
  const [theme, setTheme] = useState(THEMES.dark);
  const vehicleStateRef = useRef(null);
  const animFrameRef = useRef(null);

  const ALL_FACILITIES = useMemo(() => getRealFacilities(), []);
  const ALL_ROUTES = useMemo(() => getRealRoutes(), []);

  // Handle window resize
  useEffect(() => {
    const onResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Initialize globe camera + controls
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Set initial viewpoint
    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 }, 0);

    // Configure controls — butter-smooth zoom + rotation
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;   // higher = smoother deceleration
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.4;        // slower zoom = buttery feel
    controls.panSpeed = 0.5;
    controls.minDistance = 101;
    controls.maxDistance = 350;
    controls.screenSpacePanning = false;

    // Keyboard region shortcuts — number keys fly to regions
    const onKey = (e) => {
      const g = globeRef.current;
      if (!g) return;
      const transitions = {
        '1': { lat: 22,  lng: 95,  altitude: 1.8 },  // Asia (India + SE Asia centered)
        '2': { lat: 50,  lng: 10,  altitude: 1.8 },  // Europe
        '3': { lat: 38,  lng: -95, altitude: 1.8 },  // Americas
        '4': { lat: 24,  lng: 54,  altitude: 1.8 },  // Middle East
        '0': { lat: 20,  lng: 10,  altitude: 2.5 },  // Global reset
      };
      if (transitions[e.key]) {
        controls.autoRotate = false;
        g.pointOfView(transitions[e.key], 1200);
        setTimeout(() => { controls.autoRotate = true; }, 6000);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);

  }, []);

  // Set globe material for the "lit from within" Kaspersky look
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Defer material adjustment to let globe mesh initialize
    const timer = setTimeout(() => {
      try {
        const globeMaterial = globe.globeMaterial();
        if (globeMaterial) {
          globeMaterial.bumpScale = 3;
          globeMaterial.emissive = new ThreeColor('#061428');
          globeMaterial.emissiveIntensity = 0.12;
        }
      } catch {
        // Silently ignore if Three.js material not ready
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Initialize vehicle animation state
  useEffect(() => {
    if (vehicleStateRef.current) return; // prevent double init in StrictMode

    const state = ALL_ROUTES.flatMap((route, routeIdx) => {
      // 1 vehicle per route; skip low-volume truck routes to reduce clutter
      if (route.mode === 'truck' && (route.volume || 0) < 200) return [];
      return [{
        routeIdx,
        route,
        progress: Math.random(),
        speed: VEHICLE_SPEED[route.mode],
      }];
    });
    vehicleStateRef.current = state;

    const animate = () => {
      const vs = vehicleStateRef.current;
      if (!vs) return;

      vs.forEach(v => {
        v.progress = (v.progress + v.speed) % 1;
      });

      const newVehicles = vs.map((v, idx) => {
        const t = v.progress;
        const t2 = Math.min(t + 0.01, 0.999);

        const pos = interpolateGreatCircle(
          v.route.fromLat, v.route.fromLng,
          v.route.toLat, v.route.toLng,
          t
        );
        const pos2 = interpolateGreatCircle(
          v.route.fromLat, v.route.fromLng,
          v.route.toLat, v.route.toLng,
          t2
        );

        // Parabolic altitude — trucks/rail stay near surface, air/ocean arc higher
        const modeAlt = ARC_ALT[v.route.mode] || 0.08;
        const minAlt = (v.route.mode === 'truck' || v.route.mode === 'rail') ? 0.002 : 0.01;
        const alt = minAlt + Math.sin(Math.PI * t) * modeAlt;

        const dLng = pos2.lng - pos.lng;
        const dLat = pos2.lat - pos.lat;
        const bearing = Math.atan2(dLng, dLat) * 180 / Math.PI;

        // icon key for SVG ('ship','plane','truck','train')
        const iconKey = v.route.icon || { ocean:'ship', air:'plane', truck:'truck', rail:'train' }[v.route.mode] || 'ship';

        return {
          id: `v-${v.routeIdx}-${idx}`,
          lat: pos.lat,
          lng: pos.lng,
          altitude: alt,
          bearing,
          mode: iconKey,       // for SVG icon rendering
          routeMode: v.route.mode, // for mode filter buttons ('ocean','air','truck','rail')
          color: v.route.color,
        };
      });

      setVehicles(newVehicles);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Prepare facility points with consistent IDs for rings
  const facilitiesWithId = useMemo(() =>
    ALL_FACILITIES.map((f, i) => ({ ...f, id: `fac-${i}` })),
    []
  );

  // Prepare ring data — dedicated major hub pulses (staggered)
  const HUB_PULSES = useMemo(() => [
    {lat:31.2304, lng:121.4737, color:[0,229,255]},    // Shanghai
    {lat:1.2897,  lng:103.8501, color:[0,229,255]},    // Singapore
    {lat:51.9244, lng:4.4777,   color:[0,229,255]},    // Rotterdam
    {lat:24.9854, lng:55.0272,  color:[0,229,255]},    // Dubai
    {lat:41.8781, lng:-87.6298, color:[0,230,118]},    // Chicago
    {lat:33.7395, lng:-118.2763,color:[0,229,255]},    // Los Angeles
    {lat:53.5753, lng:9.9408,   color:[0,229,255]},    // Hamburg
    {lat:22.3080, lng:113.9185, color:[0,229,255]},    // Hong Kong
  ], []);

  // Prepare arcs data — dim inactive modes when a filter is active
  const arcsData = useMemo(() =>
    ALL_ROUTES.map((r, i) => ({
      ...r,
      id: `arc-${i}`,
      _active: !activeMode || r.mode === activeMode,
    })),
    [activeMode]
  );

  // htmlElement callback — must return a fresh DOM element per datum
  const htmlElementFn = useCallback((d) => {
    const el = document.createElement('div');
    el.innerHTML = getVehicleIcon(d.mode, d.color);
    el.style.pointerEvents = 'none';
    el.style.transform = `rotate(${d.bearing || 0}deg)`;
    return el;
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: theme.bg,
      overflow: 'hidden',
    }}>
      {/* Star field background */}
      {theme.starField && <StarField />}

      {/* Globe */}
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"

        // Earth textures — switchable via theme
        globeImageUrl={theme.globeImg}
        bumpImageUrl={theme.bumpImg}

        // Atmosphere
        showAtmosphere={true}
        atmosphereColor={theme.atmosphere}
        atmosphereAltitude={theme.atmosphereAlt}

        // No graticules — cleaner look
        showGraticules={false}

        // ---- Facility Points ----
        pointsData={facilitiesWithId}
        pointLat="lat"
        pointLng="lng"
        pointColor={d => {
          const [r, g, b] = d.color;
          return `rgba(${r},${g},${b},0.9)`;
        }}
        pointAltitude={0.005}
        pointRadius={d => d.size * 0.04}
        pointsMerge={false}

        // ---- Ring Pulses at Major Hubs ----
        ringsData={HUB_PULSES}
        ringLat="lat"
        ringLng="lng"
        ringColor={d => t => {
          const [r, g, b] = d.color;
          return `rgba(${r},${g},${b},${((1-t)*0.6).toFixed(3)})`;
        }}
        ringMaxRadius={1.8}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={2800}

        // ---- Animated Arcs ----
        arcsData={arcsData}
        arcStartLat="fromLat"
        arcStartLng="fromLng"
        arcEndLat="toLat"
        arcEndLng="toLng"
        arcColor={d => {
          const [r, g, b] = d.color;
          const alpha = d._active ? 0.55 : 0;
          const edge  = d._active ? 0.06 : 0;
          return [`rgba(${r},${g},${b},${edge})`, `rgba(${r},${g},${b},${alpha})`, `rgba(${r},${g},${b},${edge})`];
        }}
        arcAltitude={d => ARC_ALT[d.mode] || 0.08}
        arcAltitudeAutoScale={0.4}
        arcStroke={d => d.mode === 'ocean' ? 0.5 : 0.35}
        arcDashLength={0.15}
        arcDashGap={0.85}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={d => {
          if (d.mode === 'air')   return 1500;
          if (d.mode === 'ocean') return 5000;
          if (d.mode === 'truck') return 2500;
          return 3500; // rail
        }}

        // ---- Vehicle HTML Markers (filtered by activeMode) ----
        htmlElementsData={activeMode ? vehicles.filter(v => v.routeMode === activeMode) : vehicles}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude="altitude"
        htmlElement={htmlElementFn}
      />

      {/* Vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 48%, transparent 30%, rgba(6,6,18,0.65) 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* HUD Panels */}
      <BrandingPanel theme={theme} />
      <StatsPanel theme={theme} />
      <Legend theme={theme} />
      <ShipmentTicker theme={theme} />
      <PoweredByBadge theme={theme} />
      <ThemeToggle theme={theme} onToggle={() => setTheme(t => t.key === 'dark' ? THEMES.light : THEMES.dark)} />
      <ModeSwitcher activeMode={activeMode} onSelect={setActiveMode} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Branding Panel — top left
// ---------------------------------------------------------------------------
function BrandingPanel({ theme }) {
  return (
    <div style={{
      position: 'absolute',
      top: 24,
      left: 28,
      zIndex: 10,
      background: theme.panel,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${theme.panelBorder}`,
      borderRadius: 12,
      padding: '14px 22px',
    }}>
      <div style={{
        fontSize: 24,
        fontWeight: 800,
        color: '#0052CC',
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}>
        FourKites
      </div>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: theme.textMuted,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginTop: 5,
      }}>
        Global Visibility Network
      </div>
      {/* Region shortcuts hint */}
      <div style={{
        marginTop: 10,
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
      }}>
        {[['1','Asia'],['2','Europe'],['3','Americas'],['4','Mid East'],['0','Reset']].map(([k,label]) => (
          <div key={k} style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 9, color: theme.textMuted,
          }}>
            <span style={{
              background: theme.panelBorder,
              border: `1px solid ${theme.panelBorder}`,
              borderRadius: 3,
              padding: '1px 4px',
              fontWeight: 700,
              fontSize: 8,
              color: theme.text,
            }}>{k}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Powered By — bottom right
// ---------------------------------------------------------------------------
function PoweredByBadge({ theme }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      right: 28,
      zIndex: 10,
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: theme.textSubtle,
    }}>
      Powered by{' '}
      <span style={{ color: '#0052CC', fontWeight: 700 }}>FourKites</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Theme Toggle — top right, left of StatsPanel
// ---------------------------------------------------------------------------
function ThemeToggle({ theme, onToggle }) {
  const isDark = theme.key === 'dark';
  return (
    <button
      onClick={onToggle}
      style={{
        position: 'absolute',
        top: 24,
        right: 340,
        zIndex: 20,
        background: theme.panel,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${theme.panelBorder}`,
        borderRadius: 10,
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: 18,
        lineHeight: 1,
        color: theme.text,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        outline: 'none',
        transition: 'all 0.3s ease',
      }}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      <span>{isDark ? '☀️' : '🌙'}</span>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', color: theme.textMuted }}>
        {isDark ? 'LIGHT' : 'DARK'}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Mode Switcher — vertical strip on the right side, doesn't block globe
// ---------------------------------------------------------------------------
const MODES = [
  { key: null,    label: 'ALL',   icon: '🌐', color: '#ffffff',  glow: '255,255,255' },
  { key: 'ocean', label: 'OCEAN', icon: '🛳️', color: '#00E5FF',  glow: '0,229,255'   },
  { key: 'air',   label: 'AIR',   icon: '✈️', color: '#FFD600',  glow: '255,214,0'   },
  { key: 'truck', label: 'TRUCK', icon: '🚛', color: '#00E676',  glow: '0,230,118'   },
  { key: 'rail',  label: 'RAIL',  icon: '🚂', color: '#E040FB',  glow: '224,64,251'  },
];

function ModeSwitcher({ activeMode, onSelect }) {
  return (
    <div style={{
      position: 'absolute',
      right: 20,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      background: 'rgba(6,6,18,0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: '10px 8px',
    }}>
      {MODES.map((m, idx) => {
        const isActive = activeMode === m.key;
        return (
          <button
            key={m.key ?? 'all'}
            onClick={() => onSelect(m.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: isActive
                ? `rgba(${m.glow},0.18)`
                : 'transparent',
              border: isActive
                ? `1px solid rgba(${m.glow},0.6)`
                : '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              padding: '8px 10px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              outline: 'none',
              width: 58,
              position: 'relative',
              boxShadow: isActive
                ? `0 0 12px rgba(${m.glow},0.35), inset 0 0 8px rgba(${m.glow},0.1)`
                : 'none',
            }}
          >
            {/* Number badge */}
            <div style={{
              position: 'absolute',
              top: -6,
              fontSize: 9,
              fontWeight: 700,
              color: isActive ? m.color : 'rgba(255,255,255,0.3)',
              letterSpacing: '0.05em',
              lineHeight: 1,
              transition: 'color 0.25s ease',
            }}>
              {idx === 0 ? '●' : idx}
            </div>
            {/* Icon */}
            <span style={{ fontSize: 20, lineHeight: 1 }}>{m.icon}</span>
            {/* Label */}
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: isActive ? m.color : 'rgba(255,255,255,0.4)',
              transition: 'color 0.25s ease',
            }}>
              {m.label}
            </span>
            {/* Active indicator bar */}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: -1,
                left: '15%',
                right: '15%',
                height: 2,
                borderRadius: 2,
                background: m.color,
                boxShadow: `0 0 6px rgba(${m.glow},0.8)`,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
