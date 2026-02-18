import { useCountUp } from '../hooks/useCountUp';

const TOP_STAT = { value: 2430024, label: 'Active Shipments Live Now', suffix: '+', delay: 0 };

const MODE_ROWS = [
  { label: 'Truck Loads',     count: 4067800, color: [0, 230, 118],   suffix: '+', delay: 200 },
  { label: 'Ocean Shipments', count: 62993,   color: [0, 229, 255],   suffix: '+', delay: 400 },
  { label: 'Rail Shipments',  count: 25484,   color: [224, 64, 251],  suffix: '+', delay: 600 },
  { label: 'Air Shipments',   count: 8420,    color: [255, 214, 0],   suffix: '+', delay: 800 },
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
        fontSize: 24,
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
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: theme.textMuted,
        marginTop: 2,
      }}>
        {label}
      </div>
    </div>
  );
}

function ModeStatRow({ label, count, color, suffix, delay, theme }) {
  const [r, g, b] = color;
  const raw = useCountUp(count, 2800, delay);
  const display = raw.toLocaleString();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
      paddingLeft: 8,
      borderLeft: `2px solid rgba(${r},${g},${b},0.7)`,
    }}>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
          color: `rgb(${r},${g},${b})`,
          lineHeight: 1.2,
        }}>
          {display}
          <span style={{ fontWeight: 600, opacity: 0.8 }}>{suffix}</span>
        </div>
        <div style={{
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: theme.textMuted,
          marginTop: 1,
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export default function StatsPanel({ theme = DEFAULT_THEME }) {
  return (
    <div style={{
      position: 'absolute',
      top: 24,
      right: 100,
      zIndex: 10,
      background: theme.panel,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${theme.panelBorder}`,
      borderRadius: 12,
      padding: '18px 22px 12px',
      minWidth: 190,
    }}>
      <TopStatItem {...TOP_STAT} theme={theme} />

      <div style={{
        borderTop: `1px solid ${theme.panelBorder}`,
        paddingTop: 10,
        marginTop: 2,
      }}>
        {MODE_ROWS.map(row => (
          <ModeStatRow key={row.label} {...row} theme={theme} />
        ))}
      </div>
    </div>
  );
}
