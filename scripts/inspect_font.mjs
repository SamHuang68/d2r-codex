// using global fetch

async function main() {
  const res = await fetch('https://d2r.world/zh-TW/info/item/unique/helms');
  const html = await res.text();
  const cssMatches = [...html.matchAll(/href="([^"]+\.css)"/g)].map(m => m[1]);
  console.log('CSS files:', cssMatches);
  const jsMatches = [...html.matchAll(/src="([^"]+\.js)"/g)].map(m => m[1]);
  console.log('JS files:', jsMatches);

  // Check font references in css
  for (const cssUrl of cssMatches) {
    const fullCssUrl = cssUrl.startsWith('http') ? cssUrl : `https://d2r.world${cssUrl}`;
    const cssRes = await fetch(fullCssUrl);
    const cssText = await cssRes.text();
    const fontMatches = [...cssText.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]);
    if (fontMatches.length > 0) {
      console.log('Fonts in', cssUrl, fontMatches);
    }
  }
}

main().catch(console.error);
