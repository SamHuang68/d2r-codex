async function main() {
  const res = await fetch('https://d2r.world/zh-TW/info/item/unique/helms');
  const html = await res.text();
  const imgTags = [...html.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
  console.log('Img src samples in HTML:', imgTags.slice(0, 20));
}

main().catch(console.error);
