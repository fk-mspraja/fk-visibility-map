import { FACILITY_COLORS } from '../data/facilities';

const MODES = [
  { label: 'Ocean Freight', color: FACILITY_COLORS.port, icon: 'ship' },
  { label: 'Air Cargo', color: FACILITY_COLORS.airport, icon: 'plane' },
  { label: 'Road / Truck', color: FACILITY_COLORS.warehouse, icon: 'truck' },
  { label: 'Rail', color: FACILITY_COLORS.rail, icon: 'train' },
];

export default function Legend() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: 28,
      zIndex: 10,
      background: 'rgba(6,6,18,0.72)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      padding: '12px 18px',
      display: 'flex',
      gap: 18,
    }}>
      {MODES.map(({ label, color }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            boxShadow: `0 0 6px rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6), 0 0 12px rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`,
          }} />
          <span style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
          }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
