/**
 * Quick CLI script to test api/v1/rewards/home-wheel/visibility directly
 * Usage:
 *   node scripts/testWheelVisibility.js [optional_access_token]
 */
const https = require('https');

const token = process.argv[2] || process.env.ACCESS_TOKEN || '';
const requestId = 'a9c04d28-93c5-4b35-a76a-7d9e8d1f2021';
const payload = JSON.stringify({
  requestId,
  anonymousId: null,
});

console.log('--------------------------------------------------');
console.log('Testing: https://core.kapradaily.com/api/v1/rewards/home-wheel/visibility');
console.log('Request Payload:\n', payload);
console.log('Authorization Token:', token ? `Bearer ${token.slice(0, 15)}...` : '(none provided)');
console.log('--------------------------------------------------');

const options = {
  hostname: 'core.kapradaily.com',
  port: 443,
  path: '/api/v1/rewards/home-wheel/visibility',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => {
    body += chunk;
  });
  res.on('end', () => {
    console.log(`HTTP Status: ${res.statusCode}`);
    try {
      const parsed = JSON.parse(body);
      console.log('API Response Data:\n', JSON.stringify(parsed, null, 2));
    } catch {
      console.log('Raw Response Body:\n', body);
    }
    console.log('--------------------------------------------------');
  });
});

req.on('error', error => {
  console.error('Request Error:\n', error);
});

req.write(payload);
req.end();
