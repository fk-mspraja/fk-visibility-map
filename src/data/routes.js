// FourKites GSKO Globe — Route Data
// Each route: from/to positions, mode, color, width, altScale

import { FACILITY_COLORS } from './facilities';

const MODE_CONFIG = {
  ocean: { color: FACILITY_COLORS.port, width: 3, altScale: 0.15, icon: 'ship' },
  air: { color: FACILITY_COLORS.airport, width: 2, altScale: 0.4, icon: 'plane' },
  truck: { color: FACILITY_COLORS.warehouse, width: 2, altScale: 0.1, icon: 'truck' },
  rail: { color: FACILITY_COLORS.rail, width: 2, altScale: 0.08, icon: 'train' },
};

export { MODE_CONFIG };

// Helper: define route with named endpoints
function r(mode, fromLat, fromLng, toLat, toLng) {
  const cfg = MODE_CONFIG[mode];
  return {
    mode,
    fromLat, fromLng, toLat, toLng,
    color: cfg.color,
    width: cfg.width,
    altScale: cfg.altScale,
    icon: cfg.icon,
  };
}

const OCEAN_ROUTES = [
  // Trans-Pacific
  r('ocean', 31.2304, 121.4737, 33.7395, -118.2763),    // Shanghai -> LA
  r('ocean', 31.2304, 121.4737, 51.9244, 4.4777),        // Shanghai -> Rotterdam
  r('ocean', 31.2304, 121.4737, 31.9993, -81.0982),      // Shanghai -> Savannah
  r('ocean', 1.2897, 103.8501, 51.9244, 4.4777),         // Singapore -> Rotterdam
  r('ocean', 1.2897, 103.8501, 33.7395, -118.2763),      // Singapore -> LA
  r('ocean', 35.1796, 129.0756, 33.7395, -118.2763),     // Busan -> LA
  r('ocean', 35.1796, 129.0756, 51.9244, 4.4777),        // Busan -> Rotterdam
  r('ocean', 35.4437, 139.638, 33.7395, -118.2763),      // Tokyo -> LA
  // Indian Ocean & Middle East
  r('ocean', 18.922, 72.9141, 51.9244, 4.4777),          // Mumbai -> Rotterdam
  r('ocean', 18.922, 72.9141, 1.2897, 103.8501),         // Mumbai -> Singapore
  r('ocean', 24.9854, 55.0272, 51.9244, 4.4777),         // Dubai -> Rotterdam
  r('ocean', 24.9854, 55.0272, 1.2897, 103.8501),        // Dubai -> Singapore
  // South America & South Asia
  r('ocean', -23.9608, -46.3336, 51.9244, 4.4777),       // Santos -> Rotterdam
  r('ocean', 6.9271, 79.8612, 51.9244, 4.4777),          // Colombo -> Rotterdam
  r('ocean', 6.9271, 79.8612, 1.2897, 103.8501),         // Colombo -> Singapore
  r('ocean', 13.0818, 100.8831, 1.2897, 103.8501),       // Laem Chabang -> Singapore
  r('ocean', 1.3628, 103.5596, 51.9244, 4.4777),         // Tanjung Pelepas -> Rotterdam
  // Intra-Europe
  r('ocean', 51.9539, 1.3518, 51.9244, 4.4777),          // Felixstowe -> Rotterdam
  r('ocean', 53.5753, 9.9408, 51.9244, 4.4777),          // Hamburg -> Rotterdam
  // Additional trans-Pacific & intra-Asia
  r('ocean', 33.7395, -118.2763, 35.4437, 139.638),      // LA -> Tokyo
  r('ocean', 1.2897, 103.8501, 35.1796, 129.0756),       // Singapore -> Busan
  r('ocean', 31.2304, 121.4737, 1.2897, 103.8501),       // Shanghai -> Singapore
  r('ocean', 35.1796, 129.0756, 31.2304, 121.4737),      // Busan -> Shanghai
  r('ocean', 6.9271, 79.8612, 18.922, 72.9141),          // Colombo -> Mumbai
  r('ocean', -23.9608, -46.3336, 31.9993, -81.0982),     // Santos -> Savannah
  r('ocean', 53.5753, 9.9408, 51.9539, 1.3518),          // Hamburg -> Felixstowe
  r('ocean', 33.7395, -118.2763, 31.9993, -81.0982),     // LA -> Savannah (Panama canal)
  r('ocean', 24.9854, 55.0272, 18.922, 72.9141),         // Dubai -> Mumbai
  r('ocean', 13.0818, 100.8831, 31.2304, 121.4737),      // Laem Chabang -> Shanghai
];

const AIR_ROUTES = [
  r('air', 22.308, 113.9185, 41.9742, -87.9073),         // Hong Kong -> Chicago ORD
  r('air', 31.1443, 121.8083, 51.4775, -0.4614),         // Shanghai PVG -> London LHR
  r('air', 25.2532, 55.3657, 50.0379, 8.5622),           // Dubai DXB -> Frankfurt FRA
  r('air', 1.3644, 103.9915, 51.4775, -0.4614),          // Singapore SIN -> London LHR
  r('air', 22.308, 113.9185, 35.0421, -89.9767),         // Hong Kong -> Memphis MEM
  r('air', 61.1743, -149.9963, 41.9742, -87.9073),       // Anchorage -> Chicago ORD
  r('air', 50.0379, 8.5622, 41.9742, -87.9073),          // Frankfurt -> Chicago ORD
  r('air', 25.2532, 55.3657, 51.4775, -0.4614),          // Dubai DXB -> London LHR
  r('air', 1.3644, 103.9915, 50.0379, 8.5622),           // Singapore SIN -> Frankfurt
  r('air', 38.1744, -85.736, 50.0379, 8.5622),           // Louisville SDF -> Frankfurt
  // Additional air routes
  r('air', 22.308, 113.9185, 61.1743, -149.9963),        // Hong Kong -> Anchorage
  r('air', 51.4775, -0.4614, 22.308, 113.9185),          // London -> Hong Kong
  r('air', 35.0421, -89.9767, 50.0379, 8.5622),          // Memphis -> Frankfurt
  r('air', 41.9742, -87.9073, 25.2532, 55.3657),         // Chicago -> Dubai
  r('air', 50.0379, 8.5622, 1.3644, 103.9915),           // Frankfurt -> Singapore
  r('air', 51.4775, -0.4614, 41.9742, -87.9073),         // London -> Chicago
  r('air', 25.2532, 55.3657, 22.308, 113.9185),          // Dubai -> Hong Kong
  r('air', 38.1744, -85.736, 22.308, 113.9185),          // Louisville -> Hong Kong
  r('air', 61.1743, -149.9963, 31.1443, 121.8083),       // Anchorage -> Shanghai PVG
  r('air', 1.3644, 103.9915, 25.2532, 55.3657),          // Singapore -> Dubai
];

const TRUCK_ROUTES = [
  // North America
  r('truck', 41.8781, -87.6298, 32.7767, -96.797),       // Chicago -> Dallas
  r('truck', 32.7767, -96.797, 33.749, -84.388),         // Dallas -> Atlanta
  r('truck', 33.749, -84.388, 31.9993, -81.0982),        // Atlanta -> Savannah
  r('truck', 33.7395, -118.2763, 41.8781, -87.6298),     // LA -> Chicago
  r('truck', 41.8781, -87.6298, 35.0421, -89.9767),      // Chicago -> Memphis
  r('truck', 32.7767, -96.797, 29.7041, -95.3698),       // Dallas -> Houston
  r('truck', 33.749, -84.388, 35.2271, -80.8431),        // Atlanta -> Charlotte
  // Europe
  r('truck', 50.1109, 8.6821, 53.5753, 9.9408),          // Frankfurt -> Hamburg
  r('truck', 50.1109, 8.6821, 51.9244, 4.4777),          // Frankfurt -> Rotterdam
  r('truck', 51.9244, 4.4777, 48.8566, 2.3522),          // Rotterdam -> Paris
  r('truck', 48.8566, 2.3522, 40.4168, -3.7038),         // Paris -> Madrid
  r('truck', 53.5753, 9.9408, 52.2297, 21.0122),         // Hamburg -> Warsaw
  // Additional
  r('truck', 35.0421, -89.9767, 38.1744, -85.736),       // Memphis -> Louisville
  r('truck', 38.1744, -85.736, 41.8781, -87.6298),       // Louisville -> Chicago
  r('truck', 29.7041, -95.3698, 33.7395, -118.2763),     // Houston -> LA
  r('truck', 35.2271, -80.8431, 31.9993, -81.0982),      // Charlotte -> Savannah
  r('truck', 52.2297, 21.0122, 55.7558, 37.6173),        // Warsaw -> Moscow
  r('truck', 40.4168, -3.7038, 51.9244, 4.4777),         // Madrid -> Rotterdam
  r('truck', 19.076, 72.8777, 28.6139, 77.209),          // Mumbai -> Delhi
  r('truck', 28.6139, 77.209, 19.076, 72.8777),          // Delhi -> Mumbai
  r('truck', -23.5505, -46.6333, -23.9608, -46.3336),    // Sao Paulo -> Santos
  r('truck', 35.6762, 139.6503, 35.4437, 139.638),       // Tokyo WH -> Tokyo port
];

const RAIL_ROUTES = [
  // China-Europe express
  r('rail', 29.563, 106.5516, 51.4344, 6.7623),          // Chongqing -> Duisburg
  r('rail', 29.563, 106.5516, 55.7558, 37.6173),         // Chongqing -> Moscow
  r('rail', 55.7558, 37.6173, 51.4344, 6.7623),          // Moscow -> Duisburg
  // North America
  r('rail', 41.8781, -87.6298, 39.0997, -94.5786),       // Chicago -> Kansas City
  r('rail', 39.0997, -94.5786, 33.7701, -118.1937),      // Kansas City -> LA/Long Beach
  r('rail', 33.7701, -118.1937, 41.8781, -87.6298),      // LA/Long Beach -> Chicago
  // India
  r('rail', 28.6139, 77.209, 18.922, 72.9141),           // Delhi -> Mumbai/JNPT
  // Europe
  r('rail', 55.7558, 37.6173, 53.5753, 9.9408),          // Moscow -> Hamburg
  r('rail', 51.4344, 6.7623, 53.5753, 9.9408),           // Duisburg -> Hamburg
  // Additional
  r('rail', 39.0997, -94.5786, 41.8781, -87.6298),       // Kansas City -> Chicago
  r('rail', 41.8781, -87.6298, 33.7701, -118.1937),      // Chicago -> LA rail
  r('rail', 53.5753, 9.9408, 51.4344, 6.7623),           // Hamburg -> Duisburg
  r('rail', 29.563, 106.5516, 28.6139, 77.209),          // Chongqing -> Delhi (silk road)
];

// Assign unique IDs
let idCounter = 0;
function assignIds(routes) {
  return routes.map(route => ({ ...route, id: `route-${idCounter++}` }));
}

export const OCEAN = assignIds(OCEAN_ROUTES);
export const AIR = assignIds(AIR_ROUTES);
export const TRUCK = assignIds(TRUCK_ROUTES);
export const RAIL = assignIds(RAIL_ROUTES);
export const ALL_ROUTES = [...OCEAN, ...AIR, ...TRUCK, ...RAIL];
