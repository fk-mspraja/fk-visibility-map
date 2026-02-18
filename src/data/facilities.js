// FourKites GSKO Globe — Facility Data
// All coordinates verified. Colors are RGBA arrays for deck.gl.

export const FACILITY_COLORS = {
  port: [0, 229, 255],       // cyan
  airport: [255, 214, 0],    // amber
  warehouse: [0, 230, 118],  // green
  rail: [224, 64, 251],      // purple
};

export const PORTS = [
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, size: 3 },
  { name: 'Singapore', lat: 1.2897, lng: 103.8501, size: 3 },
  { name: 'Rotterdam', lat: 51.9244, lng: 4.4777, size: 2.5 },
  { name: 'Los Angeles', lat: 33.7395, lng: -118.2763, size: 2.5 },
  { name: 'Dubai/Jebel Ali', lat: 24.9854, lng: 55.0272, size: 2 },
  { name: 'Hamburg', lat: 53.5753, lng: 9.9408, size: 2 },
  { name: 'Busan', lat: 35.1796, lng: 129.0756, size: 2 },
  { name: 'Mumbai/JNPT', lat: 18.922, lng: 72.9141, size: 2 },
  { name: 'Savannah', lat: 31.9993, lng: -81.0982, size: 1.5 },
  { name: 'Felixstowe', lat: 51.9539, lng: 1.3518, size: 1.5 },
  { name: 'Tokyo', lat: 35.4437, lng: 139.638, size: 2 },
  { name: 'Santos', lat: -23.9608, lng: -46.3336, size: 1.5 },
  { name: 'Laem Chabang', lat: 13.0818, lng: 100.8831, size: 1.5 },
  { name: 'Colombo', lat: 6.9271, lng: 79.8612, size: 1.5 },
  { name: 'Tanjung Pelepas', lat: 1.3628, lng: 103.5596, size: 1.5 },
].map(f => ({ ...f, type: 'port', color: FACILITY_COLORS.port }));

export const AIRPORTS = [
  { name: 'Hong Kong HKG', lat: 22.308, lng: 113.9185 },
  { name: 'Memphis MEM', lat: 35.0421, lng: -89.9767 },
  { name: 'Shanghai PVG', lat: 31.1443, lng: 121.8083 },
  { name: 'Louisville SDF', lat: 38.1744, lng: -85.736 },
  { name: 'Anchorage ANC', lat: 61.1743, lng: -149.9963 },
  { name: 'Dubai DXB', lat: 25.2532, lng: 55.3657 },
  { name: 'Singapore SIN', lat: 1.3644, lng: 103.9915 },
  { name: 'London LHR', lat: 51.4775, lng: -0.4614 },
  { name: 'Frankfurt FRA', lat: 50.0379, lng: 8.5622 },
  { name: 'Chicago ORD', lat: 41.9742, lng: -87.9073 },
].map(f => ({ ...f, size: 1.5, type: 'airport', color: FACILITY_COLORS.airport }));

export const WAREHOUSES = [
  { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Dallas', lat: 32.7767, lng: -96.797 },
  { name: 'Atlanta', lat: 33.749, lng: -84.388 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Shanghai WH', lat: 31.2304, lng: 121.4737 },
  { name: 'Frankfurt WH', lat: 50.1109, lng: 8.6821 },
  { name: 'Sao Paulo', lat: -23.5505, lng: -46.6333 },
  { name: 'Tokyo WH', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai WH', lat: 25.2048, lng: 55.2708 },
].map(f => ({ ...f, size: 1.2, type: 'warehouse', color: FACILITY_COLORS.warehouse }));

export const RAIL_TERMINALS = [
  { name: 'Chicago Rail', lat: 41.8781, lng: -87.6298 },
  { name: 'Kansas City', lat: 39.0997, lng: -94.5786 },
  { name: 'LA/Long Beach Rail', lat: 33.7701, lng: -118.1937 },
  { name: 'Hamburg Rail', lat: 53.5753, lng: 9.9408 },
  { name: 'Chongqing', lat: 29.563, lng: 106.5516 },
  { name: 'Duisburg', lat: 51.4344, lng: 6.7623 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Delhi Rail', lat: 28.6139, lng: 77.209 },
].map(f => ({ ...f, size: 1.3, type: 'rail', color: FACILITY_COLORS.rail }));

export const ALL_FACILITIES = [...PORTS, ...AIRPORTS, ...WAREHOUSES, ...RAIL_TERMINALS];
