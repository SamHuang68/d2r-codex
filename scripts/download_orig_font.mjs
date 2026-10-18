import fs from 'fs';

async function main() {
  const url = 'https://fonts.gstatic.com/s/robotocondensed/v31/ieVo2ZhZI2eCN5jzbjEETS9weq8-_d6T_POl0fRJeyWyovBJ.ttf';
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync('scripts/orig_roboto.ttf', Buffer.from(buffer));
  console.log('Downloaded orig_roboto.ttf, size:', buffer.byteLength);
}

main().catch(console.error);
