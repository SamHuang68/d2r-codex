async function main() {
  const url = 'https://d2r.world/_next/static/chunks/pages/%5Blang%5D/info/item/unique/%5Bgid%5D-9c315f0e55f9e1ed3029.js';
  const res = await fetch(url);
  const js = await res.text();
  console.log('JS len:', js.length);

  // Search for f100, f101, or cli_attrs or font mapping
  const matches = [...js.matchAll(/f1[0-9a-f]{2}/gi)];
  console.log('Hex f1xx matches:', matches.length);

  // Look for how ts or isprop or pk/pb/pn is rendered
  const idx = js.indexOf('cli_attrs');
  if (idx !== -1) {
    console.log('cli_attrs context:', js.slice(Math.max(0, idx - 200), idx + 400));
  } else {
    console.log('No cli_attrs found in this file, check other chunks');
  }

  // Also check CSS font
  const cssRes = await fetch('https://d2r.world/_next/static/css/40a84f74cdcd93e52262.css');
  const css = await cssRes.text();
  console.log('CSS len:', css.length);
  const fontFaces = [...css.matchAll(/@font-face\s*\{[^}]+\}/g)].map(m => m[0]);
  console.log('font-faces:', fontFaces);
}

main().catch(console.error);
