async function main() {
  const chunks = [
    '/_next/static/chunks/pages/_app-8884ce70a07b7991baa0.js',
    '/_next/static/chunks/6440-8a178ef65d378eb84d82.js',
    '/_next/static/chunks/693-57045692abea83067d7b.js'
  ];
  for (const chunk of chunks) {
    const text = await (await fetch(`https://d2r.world${chunk}`)).text();
    const cdnMatches = [...text.matchAll(/https?:\/\/[a-zA-Z0-9_\-\.]+\.(?:com|net|org|cn|cc|io|world|github|b-cdn)[^\s"']+/g)].map(m => m[0]);
    console.log(`CDNs in ${chunk}:`, [...new Set(cdnMatches)].slice(0, 10));
    if (text.includes('/img/')) {
      const idx = text.indexOf('/img/');
      console.log(`Found /img/ in ${chunk}:`, text.slice(Math.max(0, idx - 50), idx + 100));
    }
  }
}

main().catch(console.error);
