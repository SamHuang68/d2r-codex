async function main() {
  const res = await fetch('https://d2r.world/_next/static/chunks/9729-03c34e3e92424257a4f7.js');
  const text = await res.text();
  const start = text.indexOf('49729:function');
  const end = text.indexOf(',49730:') !== -1 ? text.indexOf(',49730:') : text.indexOf(',72465:') !== -1 ? text.indexOf(',72465:') : start + 3000;
  console.log(text.slice(start, start + 2500));
}

main().catch(console.error);
