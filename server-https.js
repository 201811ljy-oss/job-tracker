const https = require('https');
const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');

const DIR = __dirname;
const PORT = 3443;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
};

(async () => {
  // Generate self-signed cert
  const attrs = [{ name: 'commonName', value: 'job-tracker' }];
  const opts = { days: 365, keySize: 2048 };
  const pems = await selfsigned.generate(attrs, opts);

  https.createServer({ key: pems.private, cert: pems.cert }, (req, res) => {
    let filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not Found'); return; }
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  }).listen(PORT, '0.0.0.0', () => {
    console.log(`🔒 HTTPS server: https://localhost:${PORT}`);
    console.log(`📱 Phone access: https://172.30.222.26:${PORT}`);
  });
})();
