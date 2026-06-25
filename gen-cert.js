const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const https = require('https');

const DIR = __dirname;
const CERT_DIR = path.join(DIR, '.cert');

// Generate self-signed cert using Node.js crypto
function ensureCert() {
  if (fs.existsSync(path.join(CERT_DIR, 'cert.pem'))) return;
  fs.mkdirSync(CERT_DIR, { recursive: true });

  console.log('🔐 生成自签名SSL证书...');

  // Generate RSA key pair
  const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });

  // Create self-signed X509 certificate
  const cert = crypto.X509Certificate
    ? null // Use alternative method for newer Node
    : null;

  // Use createCertificate (legacy but available)
  const certPem = crypto.createCertificate('', { key: privateKey }, { key: privateKey, selfSigned: true });
  // ^ simpler: just pass the key

  fs.writeFileSync(path.join(CERT_DIR, 'key.pem'), privateKey);
  fs.writeFileSync(path.join(CERT_DIR, 'cert.pem'), certPem);
  console.log('✅ 证书已生成');
}

// Simpler approach: use p12 if available
try {
  ensureCert();
} catch (e) {
  console.log('⚠️ 证书生成失败，用简化方式...');
  // Fallback: generate minimal cert
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  fs.mkdirSync(CERT_DIR, { recursive: true });
  fs.writeFileSync(path.join(CERT_DIR, 'key.pem'), privateKey);

  // Create self-signed cert manually with createCertificate
  const cert = crypto.createCertificate({ key: privateKey, selfSigned: true });
  fs.writeFileSync(path.join(CERT_DIR, 'cert.pem'), cert);
  console.log('✅ 备用证书已生成');
}

// --- Start HTTPS Server ---
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
};

const options = {
  key: fs.readFileSync(path.join(CERT_DIR, 'key.pem')),
  cert: fs.readFileSync(path.join(CERT_DIR, 'cert.pem'))
};

https.createServer(options, (req, res) => {
  let filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(3443, '0.0.0.0', () => {
  console.log('🔒 HTTPS server running: https://localhost:3443');
});
