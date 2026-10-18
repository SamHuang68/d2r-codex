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
  await download('https://static.wikia.nocookie.net/diablo/images/0/0c/ToA.jpg', path.join(__dirname, '../public/images/items/props/token_of_absolution.jpg'));
  console.log('Downloaded token_of_absolution.jpg');

  await download('https://static.wikia.nocookie.net/diablo/images/4/47/Essence3.png', path.join(__dirname, '../public/images/items/props/essences.png'));
  console.log('Downloaded essences.png');
}

main().catch(console.error);
