async function main() {
  const chunks = [
    '/_next/static/chunks/pages/_app-8884ce70a07b7991baa0.js',
    '/_next/static/chunks/9287-62a2960fb99dab1e9a4c.js',
    '/_next/static/chunks/5415-9ab6aad684f742c85225.js',
    '/_next/static/chunks/6164-8914eb616597fa8fc2ad.js',
    '/_next/static/chunks/1059-ed8dab4e7184e7be6594.js',
    '/_next/static/chunks/9865-9901a7ee1e3974c5252c.js',
    '/_next/static/chunks/6440-8a178ef65d378eb84d82.js',
    '/_next/static/chunks/8088-1d22a5c49e0c27d7198c.js',
    '/_next/static/chunks/9729-03c34e3e92424257a4f7.js',
    '/_next/static/chunks/7476-9e104524ceb3695100f1.js',
    '/_next/static/chunks/693-57045692abea83067d7b.js'
  ];

  for (const chunk of chunks) {
    const res = await fetch(`https://d2r.world${chunk}`);
    const text = await res.text();
    if (text.includes('cli_attrs')) {
      console.log(`Found 'cli_attrs' in ${chunk}`);
      let pos = 0;
      while ((pos = text.indexOf('cli_attrs', pos)) !== -1) {
        console.log('Snippet:', text.slice(Math.max(0, pos - 150), pos + 250));
        pos += 9;
      }
    }
    // Also check for font or decrypt logic
    if (text.includes('@font-face') || text.includes('font-family')) {
      console.log(`Found font references in ${chunk}`);
    }
  }
}

main().catch(console.error);
