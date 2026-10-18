async function main() {
  const res = await fetch('https://d2r.world/_next/static/chunks/693-57045692abea83067d7b.js');
  const text = await res.text();
  console.log('Chunk 693 len:', text.length);

  // Look for m = or whatever m.Z references
  // Search for the component definition that renders {attr: ...}
  const pos = text.indexOf('attr:t');
  console.log('Snippet around attr:t:', text.slice(Math.max(0, pos - 500), pos + 500));
}

main().catch(console.error);
