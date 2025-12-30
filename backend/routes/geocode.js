const express = require('express');
const https = require('https');

const router = express.Router();

function httpGetJson(url, { headers = {}, timeoutMs = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'GET',
        headers,
        timeout: timeoutMs,
      },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            return reject(new Error(`Upstream error ${res.statusCode}: ${data.slice(0, 200)}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON from upstream'));
          }
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('Upstream timeout'));
    });
    req.end();
  });
}

function clampInt(value, { min, max, fallback }) {
  const n = Number.parseInt(String(value), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

// Free geocoding via OpenStreetMap Nominatim.
// NOTE: Nominatim usage policy recommends a proper User-Agent and caching.
// We proxy through backend so we can set headers and later add caching/rate-limit.
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

router.get('/search', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'q is required' });

    const limit = clampInt(req.query.limit, { min: 1, max: 10, fallback: 5 });
    const countrycodes = String(req.query.countrycodes || 'dz').trim();

    const url = new URL(`${NOMINATIM_BASE}/search`);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('q', q);
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', String(limit));
    if (countrycodes) url.searchParams.set('countrycodes', countrycodes);

    const userAgent = process.env.GEOCODE_USER_AGENT || 'AdBridgeDz/1.0 (dev)';

    const results = await httpGetJson(url.toString(), {
      headers: {
        'User-Agent': userAgent,
        'Accept-Language': 'en',
      },
    });

    const normalized = Array.isArray(results)
      ? results.map((r) => ({
          place_id: r.place_id,
          display_name: r.display_name,
          lat: r.lat,
          lon: r.lon,
          type: r.type,
          class: r.class,
          address: r.address,
        }))
      : [];

    res.json({ results: normalized });
  } catch (error) {
    console.error('Geocode search error:', error);
    res.status(502).json({ error: 'Geocoding service unavailable' });
  }
});

router.get('/reverse', async (req, res) => {
  try {
    const lat = Number.parseFloat(String(req.query.lat || ''));
    const lon = Number.parseFloat(String(req.query.lon || ''));

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    const url = new URL(`${NOMINATIM_BASE}/reverse`);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('addressdetails', '1');

    const userAgent = process.env.GEOCODE_USER_AGENT || 'AdBridgeDz/1.0 (dev)';

    const result = await httpGetJson(url.toString(), {
      headers: {
        'User-Agent': userAgent,
        'Accept-Language': 'en',
      },
    });

    res.json({
      display_name: result?.display_name,
      lat: result?.lat,
      lon: result?.lon,
      address: result?.address,
    });
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(502).json({ error: 'Geocoding service unavailable' });
  }
});

module.exports = router;
