const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${res.statusCode} on ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  const assets = [
    { url: 'https://static.wikia.nocookie.net/diablo/images/2/25/Uber_Key.gif', name: 'uber_key.gif' },
    { url: 'https://static.wikia.nocookie.net/diablo/images/9/95/Horn.gif', name: 'diablo_horn.gif' },
  ];

  for (const a of assets) {
    const dest = path.join(__dirname, '../public/images/items/props', a.name);
    try {
      await download(a.url, dest);
      console.log(`Downloaded ${a.name}`);
    } catch (e) {
      console.error(`Error on ${a.name}:`, e.message);
    }
  }
}

main().catch(console.error);
