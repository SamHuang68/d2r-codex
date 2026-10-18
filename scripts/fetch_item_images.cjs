const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to download a URL to a file
function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Concurrency queue
async function downloadQueue(tasks, limit = 8) {
  let index = 0;
  let active = 0;
  let done = 0;

  return new Promise((resolve) => {
    function next() {
      if (index >= tasks.length && active === 0) {
        return resolve();
      }
      while (active < limit && index < tasks.length) {
        const task = tasks[index++];
        active++;
        download(task.url, task.dest)
          .then(() => {
            done++;
            if (done % 50 === 0 || done === tasks.length) {
              console.log(`Downloaded ${done}/${tasks.length} items...`);
            }
          })
          .catch((err) => {
            console.error(`Error downloading ${task.url}:`, err.message);
          })
          .finally(() => {
            active--;
            next();
          });
      }
    }
    next();
  });
}

async function main() {
  console.log('--- 1. Fetching 33 HD Runes ---');
  const runeNames = [
    'el', 'eld', 'tir', 'nef', 'eth', 'ith', 'tal', 'ral', 'ort', 'thul',
    'amn', 'sol', 'shael', 'dol', 'hel', 'io', 'lum', 'ko', 'fal', 'lem',
    'pul', 'um', 'mal', 'ist', 'gul', 'vex', 'ohm', 'lo', 'sur', 'ber',
    'jah', 'cham', 'zod'
  ];

  const runeTasks = [];
  runeNames.forEach((name, i) => {
    const num = String(i + 1).padStart(2, '0');
    // Using VictorHugo183 for HD D2R rune sprites
    const url = `https://raw.githubusercontent.com/VictorHugo183/runeword-helper/master/public/Rune%20Images/${name}Rune.png`;
    const dest1 = path.join(__dirname, '../public/images/items/runes', `r${num}.png`);
    const dest2 = path.join(__dirname, '../public/images/items/runes', `${name}.png`);
    runeTasks.push({ url, dest: dest1 });
    runeTasks.push({ url, dest: dest2 });
  });

  await downloadQueue(runeTasks, 5);
  console.log('HD Runes downloaded successfully.');

  console.log('--- 2. Fetching Nasicus/d2-holy-grail item graphics ---');
  // Fetch git tree
  const treeUrl = 'https://api.github.com/repos/Nasicus/d2-holy-grail/git/trees/master?recursive=1';
  const treeData = await new Promise((resolve, reject) => {
    https.get(treeUrl, { headers: { 'User-Agent': 'NodeJS' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
      res.on('error', reject);
    });
  });

  const baseTasks = [];
  treeData.tree.forEach(item => {
    if (item.type !== 'blob') return;
    const p = item.path;
    if (!p.startsWith('client/public/images/')) return;

    let subfolder = '';
    if (p.includes('/uniques/')) subfolder = 'uniques';
    else if (p.includes('/setitems/')) subfolder = 'sets';
    else if (p.includes('/items/')) subfolder = 'bases';
    else if (p.includes('/charms/')) subfolder = 'charms';
    else if (p.includes('/jewels/')) subfolder = 'jewels';
    else if (p.includes('/runes/')) subfolder = 'runes';

    if (subfolder && subfolder !== 'runes') { // runes already fetched in HD
      const fileName = path.basename(p);
      const url = `https://raw.githubusercontent.com/Nasicus/d2-holy-grail/master/${p}`;
      const dest = path.join(__dirname, `../public/images/items/${subfolder}`, fileName);
      baseTasks.push({ url, dest });
    }
  });

  console.log(`Found ${baseTasks.length} items from Nasicus repo. Starting download...`);
  await downloadQueue(baseTasks, 10);
  console.log('All Holy Grail item images downloaded successfully.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
