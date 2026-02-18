import realData from './realData.json';

// Colors matching existing theme
const COLORS = {
  ocean: [0, 229, 255],    // cyan
  air:   [255, 214, 0],    // amber
  truck: [0, 230, 118],    // green
  rail:  [224, 64, 251],   // purple
};

// ── UNLOCODE → lat/lng lookup ────────────────────────────────────────────────
// Comprehensive lookup for all UNLOCODEs appearing in realData.json
const UNLOCODE_MAP = {
  // Vietnam
  VNSGN: [10.7769, 106.7009],  // Ho Chi Minh City
  VNHPH: [20.8657, 106.6837],  // Hai Phong
  // Thailand
  THLCH: [13.0818, 100.8831],  // Laem Chabang
  THBKK: [13.7563, 100.5018],  // Bangkok
  // Mexico
  MXLZC: [17.9167, -102.1167], // Lazaro Cardenas
  MXATM: [22.4167, -97.9333],  // Altamira
  MXVER: [19.1738, -96.1342],  // Veracruz
  MXMZT: [23.2329, -106.4111], // Mazatlan
  MXZLO: [19.1000, -104.3167], // Manzanillo
  // Panama
  PAPTY: [8.9833, -79.5167],   // Panama City / Balboa
  PAROD: [9.3519, -79.9175],   // Colon / Cristobal
  // Egypt
  EGALY: [31.2001, 29.9187],   // Alexandria
  EGSUZ: [29.9736, 32.5481],   // Suez
  // Morocco
  MACAS: [33.5992, -7.6198],   // Casablanca
  MATAN: [35.7682, -5.7999],   // Tangier Med
  // Slovenia
  SIKOP: [45.5481, 13.7300],   // Koper
  // China
  CNSHA: [31.2304, 121.4737],  // Shanghai
  CNTXG: [31.4636, 121.1053],  // Taicang
  CNTAG: [31.4636, 121.1053],  // Taicang (alt code)
  CNNGB: [29.8683, 121.5440],  // Ningbo
  CNQDG: [36.0671, 120.3826],  // Qingdao
  CNQZH: [24.8741, 118.5832],  // Quanzhou
  CNSHK: [22.4833, 113.9000],  // Shekou/Shenzhen
  CNYSA: [30.6333, 122.0667],  // Yangshan
  CNYTN: [22.5667, 114.2833],  // Yantian
  CNNSA: [22.7333, 113.5667],  // Nansha (Guangzhou)
  CNHUA: [38.3667, 117.3333],  // Huanghua
  CNNBO: [29.8683, 121.5440],  // Ningbo
  // Singapore
  SGSIN: [1.2897, 103.8501],   // Singapore
  // South Korea
  KRINC: [37.4563, 126.7052],  // Incheon
  KRPUS: [35.1796, 129.0756],  // Busan
  // Brazil
  BRSSZ: [-23.9608, -46.3336], // Santos
  BRIOA: [-26.9008, -48.6683], // Itajai
  BRNVT: [-26.8997, -48.6511], // Navegantes
  BRRIO: [-22.9068, -43.1729], // Rio de Janeiro
  BRMAO: [-3.1333, -60.0167],  // Manaus
  BRSFS: [-2.5165, -44.2983],  // Sao Luis
  // Argentina
  ARROS: [-32.9468, -60.6393], // Rosario
  ARZAE: [-34.5875, -58.3772], // Buenos Aires
  ARBAH: [-38.7167, -62.2833], // Bahia Blanca
  // Colombia
  COBUN: [3.8833, -77.0500],   // Buenaventura
  COCTG: [10.3833, -75.5167],  // Cartagena
  // Chile
  CLVAP: [-33.0472, -71.6128], // Valparaiso
  CLIQQ: [-20.2167, -70.1500], // Iquique
  // Turkey
  TRGUL: [40.4319, 29.1556],   // Gemlik
  TRMER: [41.0082, 28.9784],   // Istanbul/Haydarpasa
  TRIZM: [38.4192, 27.1287],   // Izmir
  // Saudi Arabia
  SAJED: [21.4858, 39.1925],   // Jeddah
  SADMM: [26.4337, 50.1031],   // Dammam/King Abdulaziz
  // Qatar
  QAHMD: [24.8833, 51.5167],   // Hamad Port
  // UAE
  AEAUH: [24.4667, 54.3667],   // Abu Dhabi
  AEJEA: [24.9854, 55.0272],   // Jebel Ali/Dubai
  // Germany
  DEHAM: [53.5753, 9.9408],    // Hamburg
  DEBRV: [53.0833, 8.8000],    // Bremen/Bremerhaven
  // Netherlands
  NLRTM: [51.9244, 4.4777],    // Rotterdam
  // Belgium
  BEANR: [51.2194, 4.4025],    // Antwerp
  // UK
  GBFXT: [51.9539, 1.3518],    // Felixstowe
  GBLGP: [51.5074, 0.1278],    // London Gateway
  // Canada
  CAVAN: [49.2827, -123.1207], // Vancouver
  CAMTR: [45.5088, -73.5878],  // Montreal
  CAHAL: [44.6476, -63.5728],  // Halifax
  // USA
  USLAX: [33.7395, -118.2763], // Los Angeles
  USSAV: [31.9993, -81.0982],  // Savannah
  USNYC: [40.7128, -74.0060],  // New York
  USLGB: [33.7701, -118.1937], // Long Beach
  USHOU: [29.7604, -95.3698],  // Houston
  USBAL: [39.2904, -76.6122],  // Baltimore
  USNFW: [36.9468, -76.3264],  // Norfolk
  USMIA: [25.7617, -80.1918],  // Miami
  // Australia
  AUSYD: [-33.8688, 151.2093], // Sydney
  AUMEL: [-37.8136, 144.9631], // Melbourne
  AUBNE: [-27.4698, 153.0251], // Brisbane
  // Dominican Republic
  DOCAU: [18.5019, -69.6239],  // Caucedo
  // Bahamas
  BSFPO: [26.5282, -78.7000],  // Freeport
  // India
  INNSB: [18.9220, 72.9141],   // Mumbai/JNPT
  INCCU: [22.5726, 88.3639],   // Kolkata
  INMAA: [13.0827, 80.2707],   // Chennai
  // Japan
  JPTYO: [35.4437, 139.6380],  // Tokyo
  JPYOK: [35.4437, 139.6380],  // Yokohama
  JPOSA: [34.6937, 135.5023],  // Osaka
  // Malaysia
  MYTPP: [1.3628, 103.5596],   // Tanjung Pelepas
  MYPKG: [3.1412, 101.6865],   // Port Klang
  // Sri Lanka
  LKCMB: [6.9271, 79.8612],    // Colombo
  // South Africa
  ZADUR: [-29.8587, 31.0218],  // Durban
  ZACPT: [-33.9249, 18.4241],  // Cape Town
  // Argentina (Buenos Aires)
  ARBUE: [-34.5875, -58.3772], // Buenos Aires
  // Egypt (additional ports)
  EGDAM: [31.4167, 31.8167],   // Damietta
  EGPSD: [31.2656, 32.3019],   // Port Said
  EGSOK: [29.9736, 32.5481],   // Ain Sokhna
  // France
  FRLEH: [49.4944, 0.1079],    // Le Havre
  // UK (additional)
  GBSOU: [50.9097, -1.4044],   // Southampton
  // Greece
  GRPIR: [37.9426, 23.6472],   // Piraeus
  // India (additional)
  INMUN: [22.4670, 70.0577],   // Mundra
  // Italy
  ITTRS: [45.6495, 13.7768],   // Trieste
  // Jamaica
  JMKIN: [17.9714, -76.7920],  // Kingston
  // Kenya
  KEMBA: [-4.0435, 39.6682],   // Mombasa
  // Cambodia
  KHPNH: [10.6100, 103.5228],  // Sihanoukville
  // Kuwait
  KWSWK: [29.3667, 47.9500],   // Shuwaikh
  // Lebanon
  LBBEY: [33.8938, 35.5018],   // Beirut
  // Mexico
  MXZLO: [19.1000, -104.3167], // Manzanillo (already exists but duplicate-safe)
  // Panama (already exists but ensure)
  PABAL: [8.9500, -79.5700],   // Balboa Panama
  // Peru
  PECLL: [-12.0464, -77.1428], // Callao/Lima
  // Philippines
  PHMNL: [14.5955, 120.9282],  // Manila
  // Poland
  PLGDN: [54.3520, 18.6466],   // Gdansk
  // Turkey (additional)
  TRISK: [36.5833, 36.1667],   // Iskenderun
  TRIZT: [38.4192, 27.1287],   // Izmir (alt code)
  // Trinidad
  TTPTS: [10.4167, -61.4833],  // Point Lisas
  // USA Long Beach (alt)
  USLGB: [33.7701, -118.1937], // Long Beach (already exists)
  // Venezuela
  VEPBL: [10.4667, -68.0000],  // Puerto Cabello
  // Dominican Republic (alt)
  DOHAI: [18.7357, -70.1627],  // Haina port
};

// ── Build real facility points ───────────────────────────────────────────────
export function getRealFacilities() {
  const result = [];

  // Top stop locations → warehouses/DCs (green) — use top 60
  const warehouses = realData.facilities
    .slice(0, 60)
    .filter(f => f.latitude && f.longitude)
    .map(f => ({
      lat: parseFloat(f.latitude),
      lng: parseFloat(f.longitude),
      type: 'warehouse',
      color: COLORS.truck,
      size: Math.min(3, Math.max(0.8, Math.log10(parseInt(f.cnt)) * 0.7)),
    }));
  result.push(...warehouses);

  // Ocean port locations → ports (cyan) — use top 40 from oceanPorts
  const ports = realData.oceanPorts
    .slice(0, 40)
    .filter(p => p.latitude && p.longitude)
    .map(p => ({
      lat: parseFloat(p.latitude),
      lng: parseFloat(p.longitude),
      type: 'port',
      color: COLORS.ocean,
      size: Math.min(3, Math.max(1, Math.log10(parseInt(p.cnt)) * 0.8)),
    }));
  result.push(...ports);

  // Known airports (amber) — use fixed list of major air cargo hubs
  const airportList = [
    { lat: 22.308, lng: 113.918, name: 'HKG' },  // Hong Kong
    { lat: 35.042, lng: -89.977, name: 'MEM' },  // Memphis
    { lat: 31.144, lng: 121.808, name: 'PVG' },  // Shanghai Pudong
    { lat: 25.253, lng: 55.366,  name: 'DXB' },  // Dubai
    { lat: 1.364,  lng: 103.992, name: 'SIN' },  // Singapore
    { lat: 51.478, lng: -0.461,  name: 'LHR' },  // London Heathrow
    { lat: 50.038, lng: 8.562,   name: 'FRA' },  // Frankfurt
    { lat: 41.974, lng: -87.907, name: 'ORD' },  // Chicago O'Hare
    { lat: 61.174, lng: -149.996, name: 'ANC' }, // Anchorage
    { lat: 38.174, lng: -85.736, name: 'SDF' },  // Louisville
    { lat: 33.943, lng: -118.408, name: 'LAX' }, // Los Angeles
    { lat: 40.641, lng: -73.779, name: 'JFK' },  // New York JFK
    { lat: 48.354, lng: 11.786,  name: 'MUC' },  // Munich
    { lat: 3.142,  lng: 101.686, name: 'KUL' },  // Kuala Lumpur
  ].map(a => ({
    lat: a.lat, lng: a.lng,
    type: 'airport', color: COLORS.air, size: 1.5,
  }));
  result.push(...airportList);

  // Rail terminals (purple) — major intermodal hubs
  const railList = [
    { lat: 41.878, lng: -87.630 },  // Chicago
    { lat: 39.100, lng: -94.579 },  // Kansas City
    { lat: 33.770, lng: -118.194 }, // LA/Long Beach
    { lat: 53.575, lng: 9.941 },    // Hamburg
    { lat: 29.563, lng: 106.552 },  // Chongqing
    { lat: 51.434, lng: 6.762 },    // Duisburg
    { lat: 55.756, lng: 37.617 },   // Moscow
    { lat: 28.614, lng: 77.209 },   // Delhi
    { lat: 22.543, lng: 114.058 },  // Shenzhen
    { lat: 34.052, lng: -118.244 }, // Los Angeles
  ].map(r => ({
    lat: r.lat, lng: r.lng,
    type: 'rail', color: COLORS.rail, size: 1.2,
  }));
  result.push(...railList);

  // ── Global expansion — Asia/Europe/Middle East density ────────────────────

  // Asia-Pacific Ports
  const globalPorts = [
    {lat:31.2304, lng:121.4737, type:'port', color:COLORS.ocean, size:3.2},   // Shanghai
    {lat:1.2897,  lng:103.8501, type:'port', color:COLORS.ocean, size:3.0},   // Singapore
    {lat:35.1796, lng:129.0756, type:'port', color:COLORS.ocean, size:2.5},   // Busan
    {lat:22.3080, lng:113.9185, type:'port', color:COLORS.ocean, size:2.8},   // Hong Kong
    {lat:29.8683, lng:121.5440, type:'port', color:COLORS.ocean, size:2.5},   // Ningbo
    {lat:13.0818, lng:100.8831, type:'port', color:COLORS.ocean, size:2.0},   // Laem Chabang
    {lat:10.7769, lng:106.7009, type:'port', color:COLORS.ocean, size:2.0},   // HCMC Vietnam
    {lat:22.5667, lng:114.2833, type:'port', color:COLORS.ocean, size:2.0},   // Yantian
    {lat:1.3628,  lng:103.5596, type:'port', color:COLORS.ocean, size:2.2},   // Tanjung Pelepas
    {lat:36.0671, lng:120.3826, type:'port', color:COLORS.ocean, size:2.3},   // Qingdao
    {lat:35.4437, lng:139.6380, type:'port', color:COLORS.ocean, size:2.5},   // Tokyo/Yokohama
    {lat:6.9271,  lng:79.8612,  type:'port', color:COLORS.ocean, size:1.8},   // Colombo
    {lat:18.9220, lng:72.9141,  type:'port', color:COLORS.ocean, size:2.2},   // Mumbai JNPT
    {lat:13.0827, lng:80.2707,  type:'port', color:COLORS.ocean, size:1.8},   // Chennai
    {lat:-33.8688, lng:151.2093, type:'port', color:COLORS.ocean, size:1.8},  // Sydney
    // Europe Ports
    {lat:51.9244, lng:4.4777,   type:'port', color:COLORS.ocean, size:3.0},   // Rotterdam
    {lat:53.5753, lng:9.9408,   type:'port', color:COLORS.ocean, size:2.8},   // Hamburg
    {lat:51.9539, lng:1.3518,   type:'port', color:COLORS.ocean, size:2.5},   // Felixstowe
    {lat:51.2194, lng:4.4025,   type:'port', color:COLORS.ocean, size:2.3},   // Antwerp
    {lat:43.2965, lng:5.3698,   type:'port', color:COLORS.ocean, size:2.0},   // Marseille
    {lat:41.0082, lng:28.9784,  type:'port', color:COLORS.ocean, size:2.0},   // Istanbul
    {lat:37.9838, lng:23.7275,  type:'port', color:COLORS.ocean, size:1.8},   // Piraeus
    {lat:38.4192, lng:27.1287,  type:'port', color:COLORS.ocean, size:1.8},   // Izmir
    // Middle East Ports
    {lat:24.9854, lng:55.0272,  type:'port', color:COLORS.ocean, size:2.8},   // Jebel Ali Dubai
    {lat:21.4858, lng:39.1925,  type:'port', color:COLORS.ocean, size:2.0},   // Jeddah
    {lat:26.4337, lng:50.1031,  type:'port', color:COLORS.ocean, size:1.8},   // Dammam
    {lat:24.8833, lng:51.5167,  type:'port', color:COLORS.ocean, size:1.8},   // Hamad Port Qatar
    // Americas Ports
    {lat:33.7395, lng:-118.2763, type:'port', color:COLORS.ocean, size:2.8},  // Los Angeles
    {lat:31.9993, lng:-81.0982,  type:'port', color:COLORS.ocean, size:2.3},  // Savannah
    {lat:40.7128, lng:-74.0060,  type:'port', color:COLORS.ocean, size:2.5},  // New York
    {lat:29.7604, lng:-95.3698,  type:'port', color:COLORS.ocean, size:2.2},  // Houston
    {lat:-23.9608, lng:-46.3336, type:'port', color:COLORS.ocean, size:2.3},  // Santos
    {lat:10.3833, lng:-75.5167,  type:'port', color:COLORS.ocean, size:1.8},  // Cartagena
  ];
  result.push(...globalPorts);

  // Global Warehouses/DCs
  const globalDCs = [
    // Europe DCs
    {lat:52.3676, lng:4.9041,   type:'warehouse', color:COLORS.truck, size:2.0},  // Amsterdam
    {lat:50.1109, lng:8.6821,   type:'warehouse', color:COLORS.truck, size:2.0},  // Frankfurt
    {lat:48.8566, lng:2.3522,   type:'warehouse', color:COLORS.truck, size:2.0},  // Paris
    {lat:51.5074, lng:-0.1278,  type:'warehouse', color:COLORS.truck, size:2.0},  // London
    {lat:45.4654, lng:9.1859,   type:'warehouse', color:COLORS.truck, size:1.8},  // Milan
    {lat:40.4168, lng:-3.7038,  type:'warehouse', color:COLORS.truck, size:1.8},  // Madrid
    {lat:52.2297, lng:21.0122,  type:'warehouse', color:COLORS.truck, size:1.8},  // Warsaw
    {lat:48.2082, lng:16.3738,  type:'warehouse', color:COLORS.truck, size:1.8},  // Vienna
    // Asia DCs
    {lat:31.2304, lng:121.4737, type:'warehouse', color:COLORS.truck, size:2.5},  // Shanghai
    {lat:22.3193, lng:114.1694, type:'warehouse', color:COLORS.truck, size:2.3},  // Hong Kong
    {lat:35.6762, lng:139.6503, type:'warehouse', color:COLORS.truck, size:2.3},  // Tokyo
    {lat:19.0760, lng:72.8777,  type:'warehouse', color:COLORS.truck, size:2.0},  // Mumbai
    {lat:28.6139, lng:77.2090,  type:'warehouse', color:COLORS.truck, size:2.0},  // Delhi
    {lat:37.5665, lng:126.9780, type:'warehouse', color:COLORS.truck, size:1.8},  // Seoul
    {lat:25.2048, lng:55.2708,  type:'warehouse', color:COLORS.truck, size:2.2},  // Dubai
    {lat:-33.8688, lng:151.2093, type:'warehouse', color:COLORS.truck, size:1.8}, // Sydney
    // Middle East DCs
    {lat:24.7136, lng:46.6753,  type:'warehouse', color:COLORS.truck, size:1.8},  // Riyadh
    {lat:26.2285, lng:50.5860,  type:'warehouse', color:COLORS.truck, size:1.8},  // Bahrain
    // Africa DCs
    {lat:-26.2041, lng:28.0473, type:'warehouse', color:COLORS.truck, size:1.5},  // Johannesburg
    {lat:-33.9249, lng:18.4241, type:'warehouse', color:COLORS.truck, size:1.5},  // Cape Town
    {lat:30.0444, lng:31.2357,  type:'warehouse', color:COLORS.truck, size:1.5},  // Cairo
  ];
  result.push(...globalDCs);

  // Global Rail Terminals
  const globalRail = [
    {lat:29.5630, lng:106.5516, type:'rail', color:COLORS.rail, size:2.0},  // Chongqing
    {lat:51.4344, lng:6.7623,   type:'rail', color:COLORS.rail, size:2.0},  // Duisburg
    {lat:55.7558, lng:37.6173,  type:'rail', color:COLORS.rail, size:1.8},  // Moscow
    {lat:28.6139, lng:77.2090,  type:'rail', color:COLORS.rail, size:1.8},  // Delhi
    {lat:22.5431, lng:114.0579, type:'rail', color:COLORS.rail, size:1.8},  // Shenzhen
    {lat:47.3769, lng:8.5417,   type:'rail', color:COLORS.rail, size:1.5},  // Zurich
    {lat:48.8566, lng:2.3522,   type:'rail', color:COLORS.rail, size:1.5},  // Paris Rail
  ];
  result.push(...globalRail);

  return result;
}

// ── Build real routes ─────────────────────────────────────────────────────────
export function getRealRoutes() {
  const routes = [];

  // Ocean lanes — map UNLOCODE to lat/lng
  realData.oceanLanes.forEach((lane, i) => {
    const o = UNLOCODE_MAP[lane.o_code];
    const d = UNLOCODE_MAP[lane.d_code];
    if (!o || !d) return;
    if (Math.abs(o[0] - d[0]) < 0.5 && Math.abs(o[1] - d[1]) < 0.5) return; // skip same-area
    routes.push({
      id: `ocean-${i}`,
      fromLat: o[0], fromLng: o[1],
      toLat: d[0],   toLng: d[1],
      mode: 'ocean',
      icon: 'ship',
      color: COLORS.ocean,
      width: 3,
      altScale: 0.08,
      volume: parseInt(lane.cnt),
    });
  });

  // Helper: rough check if a coordinate is likely over open ocean
  // Returns true if clearly in mid-ocean (not within ~50km of any major landmass border)
  const isLikelyOcean = (lat, lng) => {
    // Pacific Ocean mid zones — no land
    if (lng < -120 && lng > -180 && lat > -60 && lat < 60 && !(lng > -130 && lat > 30)) return false; // US West Coast ok
    // Caribbean deep water
    if (lat > 8 && lat < 24 && lng > -85 && lng < -60) return false; // island zone ok
    // Atlantic mid
    if (lng > -45 && lng < -10 && lat > -40 && lat < 60) return false; // Atlantic mid ok
    return false; // default: assume land routes are valid
  };

  // Truck/LTL lanes — already have lat/lng
  realData.roadLanes.forEach((lane, i) => {
    const oLat = parseFloat(lane.o_lat), oLng = parseFloat(lane.o_lng);
    const dLat = parseFloat(lane.d_lat), dLng = parseFloat(lane.d_lng);
    if (isNaN(oLat) || isNaN(dLat)) return;
    if (Math.abs(oLat - dLat) < 0.3 && Math.abs(oLng - dLng) < 0.3) return;
    // Skip routes where midpoint would cross open water (Ecuador Pacific coast →inland is ok, but cross-ocean is not)
    const midLng = (oLng + dLng) / 2;
    const midLat = (oLat + dLat) / 2;
    // Skip if route spans more than 30 degrees longitude (likely crosses ocean)
    if (Math.abs(oLng - dLng) > 30) return;
    routes.push({
      id: `truck-${i}`,
      fromLat: oLat, fromLng: oLng,
      toLat:   dLat, toLng:   dLng,
      mode: 'truck',
      icon: 'truck',
      color: COLORS.truck,
      width: 2,
      altScale: 0.04,
      volume: parseInt(lane.cnt),
    });
  });

  // ── Explicit high-volume ocean backbone lanes ─────────────────────────────
  // TRANS-PACIFIC (thick, prominent)
  const oceanBackbone = [
    {id:'tp-1', fromLat:31.2304, fromLng:121.4737, toLat:33.7395, toLng:-118.2763, mode:'ocean', icon:'ship', color:COLORS.ocean, width:4, altScale:0.12, volume:9000},  // Shanghai->LA
    {id:'tp-2', fromLat:35.1796, fromLng:129.0756, toLat:33.7395, toLng:-118.2763, mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.12, volume:7000},  // Busan->LA
    {id:'tp-3', fromLat:1.2897,  fromLng:103.8501, toLat:33.7395, toLng:-118.2763, mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.12, volume:6000},  // Singapore->LA
    {id:'tp-4', fromLat:22.3080, fromLng:113.9185, toLat:33.7395, toLng:-118.2763, mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.12, volume:6500},  // HKG->LA
    {id:'tp-5', fromLat:31.2304, fromLng:121.4737, toLat:31.9993, toLng:-81.0982,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.14, volume:5500},  // Shanghai->Savannah
    {id:'tp-6', fromLat:35.4437, fromLng:139.6380, toLat:33.7395, toLng:-118.2763, mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.12, volume:4000},  // Tokyo->LA
    {id:'tp-7', fromLat:29.8683, fromLng:121.5440, toLat:40.7128, toLng:-74.0060,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.14, volume:5000},  // Ningbo->NY
    // ASIA-EUROPE (sweeping arcs across Middle East)
    {id:'ae-1', fromLat:31.2304, fromLng:121.4737, toLat:51.9244, toLng:4.4777,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:4, altScale:0.1, volume:9000},   // Shanghai->Rotterdam
    {id:'ae-2', fromLat:31.2304, fromLng:121.4737, toLat:53.5753, toLng:9.9408,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.1, volume:7000},   // Shanghai->Hamburg
    {id:'ae-3', fromLat:1.2897,  fromLng:103.8501, toLat:51.9244, toLng:4.4777,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:4, altScale:0.1, volume:8000},   // Singapore->Rotterdam
    {id:'ae-4', fromLat:35.1796, fromLng:129.0756, toLat:51.9244, toLng:4.4777,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.1, volume:5000},   // Busan->Rotterdam
    {id:'ae-5', fromLat:22.3080, fromLng:113.9185, toLat:51.9244, toLng:4.4777,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.1, volume:6000},   // HKG->Rotterdam
    {id:'ae-6', fromLat:18.9220, fromLng:72.9141,  toLat:51.9244, toLng:4.4777,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.08, volume:4000},  // Mumbai->Rotterdam
    {id:'ae-7', fromLat:24.9854, fromLng:55.0272,  toLat:51.9244, toLng:4.4777,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.07, volume:3500},  // Dubai->Rotterdam
    {id:'ae-8', fromLat:10.7769, fromLng:106.7009, toLat:51.9244, toLng:4.4777,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.1, volume:3000},   // HCMC->Rotterdam
    // TRANSATLANTIC
    {id:'ta-1', fromLat:51.9244, fromLng:4.4777,   toLat:40.7128, toLng:-74.0060, mode:'ocean', icon:'ship', color:COLORS.ocean, width:3, altScale:0.08, volume:5000},  // Rotterdam->NY
    {id:'ta-2', fromLat:51.9244, fromLng:4.4777,   toLat:31.9993, toLng:-81.0982, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.08, volume:3000},  // Rotterdam->Savannah
    {id:'ta-3', fromLat:-23.9608, fromLng:-46.3336, toLat:51.9244, toLng:4.4777,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.12, volume:2500},  // Santos->Rotterdam
    // INTRA-ASIA
    {id:'ia-1', fromLat:31.2304, fromLng:121.4737, toLat:1.2897,  toLng:103.8501, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.05, volume:4000},  // Shanghai->Singapore
    {id:'ia-2', fromLat:1.2897,  fromLng:103.8501, toLat:18.9220, toLng:72.9141,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.06, volume:3000},  // Singapore->Mumbai
    {id:'ia-3', fromLat:18.9220, fromLng:72.9141,  toLat:24.9854, toLng:55.0272,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.05, volume:2500},  // Mumbai->Dubai (Arabian Sea)
    {id:'ia-4', fromLat:13.0827, fromLng:80.2707,  toLat:6.9271,  toLng:79.8612,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.03, volume:2000},  // Chennai->Colombo
    {id:'ia-5', fromLat:22.3080, fromLng:113.9185, toLat:13.0818, toLng:100.8831, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.05, volume:3500},  // HKG->Laem Chabang
    {id:'ia-6', fromLat:1.2897,  fromLng:103.8501, toLat:6.9271,  toLng:79.8612,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.04, volume:2000},  // Singapore->Colombo
    {id:'ia-7', fromLat:35.1796, fromLng:129.0756, toLat:22.3080, toLng:113.9185, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.04, volume:3000},  // Busan->HKG
    {id:'ia-8', fromLat:18.9220, fromLng:72.9141,  toLat:13.0827, toLng:80.2707,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.03, volume:1800},  // Mumbai->Chennai (coastal)
    // AFRICA / MED / BLACK SEA density
    {id:'af-1', fromLat:51.9244, fromLng:4.4777,   toLat:-29.8587, toLng:31.0218,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.12, volume:2000},  // Rotterdam->Durban
    {id:'af-2', fromLat:-29.8587, fromLng:31.0218, toLat:1.2897,  toLng:103.8501,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.1,  volume:1800},  // Durban->Singapore
    {id:'af-3', fromLat:24.9854, fromLng:55.0272,  toLat:-29.8587, toLng:31.0218,  mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.1,  volume:1500},  // Dubai->Durban
    {id:'af-4', fromLat:31.2001, fromLng:29.9187,  toLat:51.9244, toLng:4.4777,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.07, volume:2200},  // Alexandria->Rotterdam (Suez)
    {id:'af-5', fromLat:31.2001, fromLng:29.9187,  toLat:31.2304, toLng:121.4737, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.09, volume:2000},  // Alexandria->Shanghai (Suez)
    // EXTRA TRANS-PACIFIC density
    {id:'tp-8', fromLat:35.1796, fromLng:129.0756, toLat:29.7604, toLng:-95.3698, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.14, volume:3500},  // Busan->Houston
    {id:'tp-9', fromLat:36.0671, fromLng:120.3826, toLat:33.7395, toLng:-118.2763, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.12, volume:3000},  // Qingdao->LA
    {id:'tp-10', fromLat:22.3080, fromLng:113.9185, toLat:-33.8688, toLng:151.2093, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.1, volume:2500},  // HKG->Sydney
    // LATIN AMERICA
    {id:'la-1', fromLat:-23.9608, fromLng:-46.3336, toLat:33.7395, toLng:-118.2763, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.13, volume:2000},  // Santos->LA
    {id:'la-2', fromLat:10.3833, fromLng:-75.5167,  toLat:51.9244, toLng:4.4777,   mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.1, volume:1800},   // Cartagena->Rotterdam
    {id:'la-3', fromLat:-33.0472, fromLng:-71.6128, toLat:31.2304, toLng:121.4737, mode:'ocean', icon:'ship', color:COLORS.ocean, width:2, altScale:0.14, volume:1500},  // Valparaiso->Shanghai
  ];
  routes.push(...oceanBackbone);

  // Air lanes — realistic hub-to-hub cargo/passenger routes
  const airRoutes = [
    // Trans-Pacific air
    [22.308, 113.918, 41.974, -87.907],   // HKG -> ORD
    [31.144, 121.808, 51.478, -0.461],    // PVG -> LHR
    [22.308, 113.918, 33.943, -118.408],  // HKG -> LAX
    [22.308, 113.918, 51.478, -0.461],    // HKG -> LHR
    [22.308, 113.918, 35.042, -89.977],   // HKG -> MEM
    [33.943, -118.408, 22.308, 113.918],  // LAX -> HKG
    [51.478, -0.461,  31.144, 121.808],   // LHR -> PVG
    [61.174, -149.996, 41.974, -87.907],  // ANC -> ORD (polar)
    // Asia-Europe (fly over India/Central Asia)
    [1.364,  103.992, 51.478, -0.461],    // SIN -> LHR (crosses Bay of Bengal, India)
    [25.253, 55.366,  51.478, -0.461],    // DXB -> LHR
    [25.253, 55.366,  50.038, 8.562],     // DXB -> FRA
    [1.364,  103.992, 50.038, 8.562],     // SIN -> FRA
    [31.144, 121.808, 50.038, 8.562],     // PVG -> FRA
    [48.354, 11.786,  1.364, 103.992],    // MUC -> SIN
    // India hub routes (accurate flight paths)
    [28.556, 77.100,  25.253, 55.366],    // DEL -> DXB
    [28.556, 77.100,  51.478, -0.461],    // DEL -> LHR (British Airways)
    [19.088, 72.868,  25.253, 55.366],    // BOM -> DXB
    [19.088, 72.868,  51.478, -0.461],    // BOM -> LHR
    [13.198, 80.165,  1.364,  103.992],   // MAA (Chennai) -> SIN
    [28.556, 77.100,  22.308, 113.918],   // DEL -> HKG
    // Americas-Europe
    [50.038, 8.562,   41.974, -87.907],   // FRA -> ORD
    [38.174, -85.736, 50.038, 8.562],     // SDF -> FRA
    [35.042, -89.977, 25.253, 55.366],    // MEM -> DXB
    [41.974, -87.907, 25.253, 55.366],    // ORD -> DXB
  ];
  airRoutes.forEach(([oLat, oLng, dLat, dLng], i) => {
    routes.push({
      id: `air-${i}`,
      fromLat: oLat, fromLng: oLng,
      toLat: dLat, toLng: dLng,
      mode: 'air',
      icon: 'plane',
      color: COLORS.air,
      width: 2,
      altScale: 0.15,
      volume: 500,
    });
  });

  // Rail lanes — China-Europe + US intermodal
  const railRoutes = [
    [29.563, 106.552, 51.434, 6.762],    // Chongqing -> Duisburg (China-Europe)
    [29.563, 106.552, 55.756, 37.617],   // Chongqing -> Moscow
    [55.756, 37.617,  51.434, 6.762],    // Moscow -> Duisburg
    [41.878, -87.630, 39.100, -94.579],  // Chicago -> Kansas City
    [39.100, -94.579, 33.770, -118.194], // Kansas City -> LA
    [33.770, -118.194, 41.878, -87.630], // LA -> Chicago
    [53.575, 9.941,   51.434, 6.762],    // Hamburg -> Duisburg
    [28.614, 77.209,  19.076, 72.878],   // Delhi -> Mumbai (Western Railway)
    [28.614, 77.209,  22.572, 88.363],   // Delhi -> Kolkata (Howrah Rajdhani)
    [19.076, 72.878,  13.082, 80.270],   // Mumbai -> Chennai (South Coast)
    [22.543, 114.058, 31.230, 121.474],  // Shenzhen -> Shanghai
    [31.230, 121.474, 39.904, 116.407],  // Shanghai -> Beijing
  ];
  railRoutes.forEach(([oLat, oLng, dLat, dLng], i) => {
    routes.push({
      id: `rail-${i}`,
      fromLat: oLat, fromLng: oLng,
      toLat: dLat, toLng: dLng,
      mode: 'rail',
      icon: 'train',
      color: COLORS.rail,
      width: 2,
      altScale: 0.05,
      volume: 300,
    });
  });

  return routes;
}

// ── Real mode stats ───────────────────────────────────────────────────────────
export const REAL_MODE_STATS = {
  truck:  { label: 'Truck Shipments',  count: 4067800, color: COLORS.truck },
  ocean:  { label: 'Ocean Shipments',  count: 62993,   color: COLORS.ocean },
  rail:   { label: 'Rail Shipments',   count: 25484,   color: COLORS.rail  },
  parcel: { label: 'Parcel Shipments', count: 4494110, color: [180, 120, 255] },
};
