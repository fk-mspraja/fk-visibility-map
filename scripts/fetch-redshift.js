/**
 * Fetches real FourKites data from Redshift and writes to src/data/realData.json
 * Run: node scripts/fetch-redshift.js
 */
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
  host: 'productiondwh.c5iyekvfm1hi.us-east-1.redshift.amazonaws.com',
  port: 5439,
  database: 'productiondwh',
  user: 'fkin10365',
  password: 'H3r*3^tyC3Bh',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

async function run() {
  console.log('Connecting to Redshift...');
  await client.connect();
  console.log('Connected!\n');

  // ── 1. Mode counts ────────────────────────────────────────────────────────
  console.log('[1/6] Mode counts...');
  const modeCounts = await client.query(`
    SELECT load_mode, COUNT(*) AS total,
      COUNT(CASE WHEN status NOT IN ('Delivered','Cancelled','Expired') THEN 1 END) AS active
    FROM etl_stg_cr_fact_loads
    WHERE load_mode IS NOT NULL AND load_mode != ''
    GROUP BY load_mode ORDER BY total DESC LIMIT 20
  `);
  console.log('  Modes:', modeCounts.rows.map(r=>`${r.load_mode}(${r.active}/${r.total})`).join(', '));

  // ── 2. Real truck/LTL lanes from dim_lanes (has origin+dest lat/lng built in) ─
  console.log('\n[2/6] Road/LTL lanes from dim_lanes...');
  const roadLanes = await client.query(`
    SELECT origin_latitude  AS o_lat, origin_longitude  AS o_lng,
           destination_latitude AS d_lat, destination_longitude AS d_lng,
           origin_city_id, destination_city_id,
           origin_country, destination_country,
           COUNT(*) AS cnt
    FROM dim_lanes
    WHERE origin_latitude  IS NOT NULL AND destination_latitude  IS NOT NULL
      AND ABS(origin_latitude  - destination_latitude)  > 0.5
      AND ABS(origin_longitude - destination_longitude) > 0.5
    GROUP BY 1,2,3,4,5,6,7,8
    ORDER BY cnt DESC LIMIT 60
  `);
  console.log(`  Got ${roadLanes.rows.length} road lanes`);

  // ── 3. Ocean lanes with UNLOCODE (map to lat/lng via reference) ───────────
  console.log('\n[3/6] Ocean lanes...');
  const oceanLanes = await client.query(`
    SELECT origin_unlocode AS o_code, destination_unlocode AS d_code,
           COUNT(*) AS cnt
    FROM ds_ocean_components_data
    WHERE component_type = 'static_transit'
      AND origin_unlocode IS NOT NULL AND destination_unlocode IS NOT NULL
      AND origin_unlocode != destination_unlocode
    GROUP BY 1,2
    ORDER BY cnt DESC LIMIT 60
  `);
  console.log(`  Got ${oceanLanes.rows.length} ocean lanes`);

  // ── 4. Top stop locations for facility pins ───────────────────────────────
  console.log('\n[4/6] Facility locations from stops...');
  const facilities = await client.query(`
    SELECT latitude, longitude, COUNT(*) AS cnt
    FROM benchmarking_fact_stops_view
    WHERE latitude  IS NOT NULL AND longitude IS NOT NULL
      AND latitude  BETWEEN -90  AND 90
      AND longitude BETWEEN -180 AND 180
    GROUP BY 1,2
    ORDER BY cnt DESC LIMIT 150
  `);
  console.log(`  Got ${facilities.rows.length} stop locations`);

  // ── 5. Ocean port locations (from UNLOCODE stops) ─────────────────────────
  console.log('\n[5/6] Ocean port coordinates from ocean data...');
  const oceanPorts = await client.query(`
    SELECT o.latitude, o.longitude, o.city, COUNT(*) as cnt
    FROM dim_address o
    WHERE o.latitude IS NOT NULL AND o.longitude IS NOT NULL
      AND o.country IN ('CN','SG','NL','US','AE','DE','KR','IN','GB','JP','BR','TH','LK','MY','PH','VN','EG','SA','AU','ZA','PK','ID','MX','FR','ES','IT','BE','TR','GR','MA')
      AND o.city IS NOT NULL AND o.city != ''
    GROUP BY 1,2,3
    ORDER BY cnt DESC LIMIT 100
  `);
  console.log(`  Got ${oceanPorts.rows.length} port/address locations`);

  // ── 6. Sample active shipments for the ticker ─────────────────────────────
  console.log('\n[6/6] Sample active shipments for ticker...');
  const ticker = await client.query(`
    SELECT l.load_number, l.load_mode, l.status,
           l.managing_carrier_scac,
           o.city AS origin_city, d.city AS dest_city
    FROM etl_stg_cr_fact_loads l
    JOIN dim_lanes_origin_destination o ON o.load_id = l.load_id AND o.stop_type = 'pickup'
    JOIN dim_lanes_origin_destination d ON d.load_id = l.load_id AND d.stop_type = 'delivery'
    WHERE l.status NOT IN ('Delivered','Cancelled','Expired')
      AND l.load_mode IS NOT NULL AND l.load_mode != ''
      AND o.city IS NOT NULL AND d.city IS NOT NULL
    ORDER BY RANDOM()
    LIMIT 50
  `);
  console.log(`  Got ${ticker.rows.length} live shipments for ticker`);

  await client.end();

  // ── Output ────────────────────────────────────────────────────────────────
  const output = {
    fetchedAt: new Date().toISOString(),
    modeCounts: modeCounts.rows,
    roadLanes: roadLanes.rows,
    oceanLanes: oceanLanes.rows,
    facilities: facilities.rows,
    oceanPorts: oceanPorts.rows,
    ticker: ticker.rows,
  };

  const outPath = path.join(__dirname, '../src/data/realData.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Written to ${outPath}`);

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log('Modes:', modeCounts.rows.map(r=>`${r.load_mode}=${r.total}`).join(', '));
  console.log('Road lanes:', roadLanes.rows.length);
  console.log('Ocean lanes:', oceanLanes.rows.length);
  console.log('Facilities:', facilities.rows.length);
  console.log('Ocean ports:', oceanPorts.rows.length);
  console.log('Ticker events:', ticker.rows.length);
}

run().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
