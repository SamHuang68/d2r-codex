async function main() {
  const res = await fetch('https://d2r.world/zh-TW/info/item/unique/helms');
  const html = await res.text();
  const fontMatches = [...html.matchAll(/(https?:\/\/[^"'\s>]+|(?:\/[a-zA-Z0-9_\-./]+))/g)]
    .map(m => m[0])
    .filter(m => m.includes('font') || m.endsWith('.woff') || m.endsWith('.woff2') || m.endsWith('.ttf'));
  console.log('Fonts in HTML:', fontMatches);

  // Also check all CSS in HTML
  const cssMatches = [...html.matchAll(/href="([^"]+\.css)"/g)].map(m => m[1]);
  for (const c of cssMatches) {
    const text = await (await fetch(`https://d2r.world${c}`)).text();
    const fontsInCss = [...text.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]);
    console.log(`Fonts in CSS ${c}:`, fontsInCss);
  }
}

main().catch(console.error);
