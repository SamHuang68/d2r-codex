import fs from 'fs';

async function main() {
  const url = 'https://d2r.world/font/RobotoCD771579d53e26ece5454b585a7dfc1d.ttf';
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync('scripts/d2r_font.ttf', Buffer.from(buffer));
  console.log('Saved font, size:', buffer.byteLength);
}

main().catch(console.error);
