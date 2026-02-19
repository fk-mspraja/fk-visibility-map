import { useCountUp } from '../hooks/useCountUp';

// ── Real data from FourKites Platform Metrics (Jan 2025 – Feb 2026) ──────────
const TOP_STAT = { value: 2816927, label: 'Total Active Loads', suffix: '', delay: 0 };

// Active Loads by Mode (exact from PDF)
const MODE_ROWS = [
  { label: 'Truck Loads',     count: 2400000, color: [0, 230, 118],  suffix: '',  delay: 150 },
  { label: 'Intermodal',      count: 211597,  color: [0, 200, 180],  suffix: '',  delay: 300 },
  { label: 'Ocean Shipments', count: 201306,  color: [0, 229, 255],  suffix: '',  delay: 450 },
  { label: 'Rail Shipments',  count: 24638,   color: [224, 64, 251], suffix: '',  delay: 600 },
  { label: 'Air Shipments',   count: 5828,    color: [255, 214, 0],  suffix: '',  delay: 750 },
];

// Platform scale metrics (bottom section)
const PLATFORM_ROWS = [
  { label: 'Tracking Pings / yr',  value: '9.74B',  color: [0, 229, 255] },
  { label: 'Carrier Files / yr',   value: '~4.9B',  color: [0, 230, 118] },
  { label: 'Daily Tracking Pings', value: '26.7M',  color: [224, 64, 251] },
  { label: 'Loads Created / yr',   value: '120.2M', color: [255, 214, 0] },
];

const DEFAULT_THEME = {
  panel: 'rgba(6,6,18,0.72)',
  panelBorder: 'rgba(255,255,255,0.08)',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.4)',
};

function TopStatItem({ value, label, suffix, delay, theme }) {
  const raw = useCountUp(value, 2800, delay);
  const display = raw.toLocaleString();
  return (
    <div style={{ textAlign: 'right', marginBottom: 10 }}>
      <div style={{
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        fontVariantNumeric: 'tabular-nums',
        color: theme.text,
      }}>
        {display}
        <span style={{ color: theme.textMuted, fontWeight: 500, fontSize: 16 }}>{suffix}</span>
      </div>
      <div style={{
        fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: theme.textMuted, marginTop: 2,
      }}>
        {label}
      </div>
    </div>
  );
}

function ModeStatRow({ label, count, color, suffix, delay, theme }) {
  const [r, g, b] = color;
  const raw = useCountUp(count, 2500, delay);
  const display = raw.toLocaleString();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      marginBottom: 7, paddingLeft: 8,
      borderLeft: `2px solid rgba(${r},${g},${b},0.7)`,
    }}>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
          color: `rgb(${r},${g},${b})`, lineHeight: 1.2,
        }}>
          {display}<span style={{ fontWeight: 600, opacity: 0.8 }}>{suffix}</span>
        </div>
        <div style={{
          fontSize: 8, fontWeight: 500, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: theme.textMuted, marginTop: 1,
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function PlatformMetricRow({ label, value, color, theme }) {
  const [r, g, b] = color;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 5, gap: 8,
    }}>
      <div style={{
        fontSize: 8, fontWeight: 500, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: theme.textMuted, flex: 1,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 12, fontWeight: 700,
        color: `rgb(${r},${g},${b})`,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
    </div>
  );
}

export default function StatsPanel({ theme = DEFAULT_THEME }) {
  return (
    <div style={{
      position: 'absolute', top: 24, right: 100,
      zIndex: 10,
      background: theme.panel,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${theme.panelBorder}`,
      borderRadius: 12, padding: '16px 20px 12px',
      minWidth: 200,
    }}>
      {/* Total Active Loads */}
      <TopStatItem {...TOP_STAT} theme={theme} />

      {/* Active Loads by Mode */}
      <div style={{
        borderTop: `1px solid ${theme.panelBorder}`, paddingTop: 10, marginTop: 2,
      }}>
        {MODE_ROWS.map(row => (
          <ModeStatRow key={row.label} {...row} theme={theme} />
        ))}
      </div>

      {/* Platform Scale Metrics */}
      <div style={{
        borderTop: `1px solid ${theme.panelBorder}`, paddingTop: 8, marginTop: 6,
      }}>
        <div style={{
          fontSize: 8, fontWeight: 700, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: theme.textMuted,
          marginBottom: 6, opacity: 0.7,
        }}>
          Platform Scale
        </div>
        {PLATFORM_ROWS.map(row => (
          <PlatformMetricRow key={row.label} {...row} theme={theme} />
        ))}
      </div>
    </div>
  );
}
