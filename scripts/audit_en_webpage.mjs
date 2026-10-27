import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright-core';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

function serveDist(dir = 'dist') {
  const root = path.resolve(dir);
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    console.error(`Missing ${root}/index.html. Run npm run build first.`);
    process.exit(2);
  }
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, base: `http://127.0.0.1:${server.address().port}/` });
    });
  });
}

const ALL_ROUTES = [
  { hash: '', label: 'Home / Portal' },
  { hash: '#characters', label: 'Classes / Characters' },
  { hash: '#skills', label: 'Skill Trees' },
  { hash: '#planner', label: 'Build Simulator' },
  { hash: '#breakpoints', label: 'Breakpoints' },
  { hash: '#experience', label: 'Experience Table' },
  { hash: '#items', label: 'Item Compendium' },
  { hash: '#runewords', label: 'Runewords Hall of Fame' },
  { hash: '#bases', label: 'Base Items' },
  { hash: '#cube', label: 'Horadric Cube Craft' },
  { hash: '#runes', label: 'Rune Vault' },
  { hash: '#affixes', label: 'Affix Compendium' },
  { hash: '#valuation', label: 'Trophy Valuation' },
  { hash: '#grail', label: 'Holy Grail Tracker' },
  { hash: '#monsters', label: 'Monster Compendium' },
  { hash: '#uber', label: 'Uber Bosses' },
  { hash: '#areas', label: 'Area Levels & TZ' },
  { hash: '#mercenaries', label: 'Mercenary Matrix' },
  { hash: '#quests', label: 'Quest Guide' },
  { hash: '#shrines', label: 'Shrines' },
  { hash: '#props', label: 'Props & Tokens' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const local = await serveDist('dist');
  console.log(`Serving dist at: ${local.base}`);

  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const browser = await chromium.launch({
    executablePath: fs.existsSync(edgePath) ? edgePath : undefined,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  // Ensure language is set to 'en' in localStorage before scripts execute
  await context.addInitScript(() => {
    window.localStorage.setItem('d2r_language', 'en');
  });

  const page = await context.newPage();

  const manifest = [];
  const findingsByRoute = {};

  try {
    for (const r of ALL_ROUTES) {
      const url = `${local.base}${r.hash}`;
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      // Wait for content to settle
      await sleep(800);

      // Extract all text nodes with Chinese characters
      const pageFindings = await page.evaluate(() => {
        const results = [];
        const chineseRegex = /[\u4e00-\u9fa5]/;

        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode(node) {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              const tag = parent.tagName.toLowerCase();
              if (tag === 'script' || tag === 'style' || tag === 'noscript') {
                return NodeFilter.FILTER_REJECT;
              }
              const style = window.getComputedStyle(parent);
              if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return NodeFilter.FILTER_REJECT;
              }
              const text = node.nodeValue.trim();
              if (chineseRegex.test(text)) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_SKIP;
            }
          }
        );

        let currentNode;
        while ((currentNode = walker.nextNode())) {
          const text = currentNode.nodeValue.trim();
          const parent = currentNode.parentElement;
          const tag = parent.tagName.toLowerCase();
          const cls = parent.className || '';
          const snippet = text.length > 100 ? text.slice(0, 100) + '...' : text;
          results.push({
            tag,
            cls: typeof cls === 'string' ? cls.slice(0, 80) : '',
            text: snippet
          });
        }

        return results;
      });

      // Deduplicate findings by text
      const seen = new Set();
      const deduped = [];
      for (const f of pageFindings) {
        if (!seen.has(f.text)) {
          seen.add(f.text);
          deduped.push(f);
        }
      }

      const status = deduped.length === 0 ? 'CLEAN (0 Chinese)' : `FAIL (${deduped.length} Chinese)`;
      console.log(`[${deduped.length === 0 ? '✓' : '✗'}] ${r.label.padEnd(25)} (${(r.hash || '#').padEnd(14)}) : ${status}`);

      manifest.push({
        label: r.label,
        route: r.hash || '#',
        chineseCount: deduped.length,
        status: deduped.length === 0 ? 'PASS' : 'FAIL',
        samples: deduped.slice(0, 3).map(x => x.text)
      });

      if (deduped.length > 0) {
        findingsByRoute[r.label] = {
          route: r.hash || '#',
          count: deduped.length,
          findings: deduped
        };
      }
    }
  } finally {
    await browser.close();
    local.server.close();
  }

  fs.writeFileSync('scripts/en_audit_results.json', JSON.stringify(findingsByRoute, null, 2), 'utf8');
  fs.writeFileSync('scripts/en_audit_manifest.json', JSON.stringify(manifest, null, 2), 'utf8');

  console.log('\n=============================================');
  console.log('AUDIT SUMMARY: ROUTES WITH CHINESE IN EN MODE');
  console.log('=============================================');
  const routeNames = Object.keys(findingsByRoute);
  if (routeNames.length === 0) {
    console.log('🎉 100% CLEAN! Zero Chinese found across all 21 routes in EN mode!');
  } else {
    for (const name of routeNames) {
      const data = findingsByRoute[name];
      console.log(`\n[${name}] (${data.route}) -> ${data.count} items found:`);
      for (const f of data.findings.slice(0, 7)) {
        console.log(`  - <${f.tag}>: "${f.text}"`);
      }
      if (data.findings.length > 7) {
        console.log(`  ... and ${data.findings.length - 7} more items`);
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
