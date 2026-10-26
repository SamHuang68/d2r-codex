import fs from 'fs';
import path from 'path';

function findFiles(dir, exts) {
  let files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(findFiles(full, exts));
    } else if (exts.some(ext => item.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const baseDir = 'C:/Users/Sam/AI-Workspace/projects/d2r-codex';
const compFiles = findFiles(path.join(baseDir, 'src/components'), ['.tsx', '.ts']);
console.log('Total component files:', compFiles.length);

const chineseRegex = /[\u4e00-\u9fa5]/;
const results = [];

for (const file of compFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const usesLang = content.includes('useLanguage') || content.includes('LanguageContext');
  const hasChinese = chineseRegex.test(content);
  if (hasChinese) {
    const lines = content.split('\n');
    let zhLineCount = 0;
    for (const l of lines) {
      if (chineseRegex.test(l)) zhLineCount++;
    }
    results.push({
      file: path.relative(baseDir, file).replace(/\\/g, '/'),
      usesLang,
      zhLineCount,
      totalLines: lines.length
    });
  }
}

results.sort((a, b) => b.zhLineCount - a.zhLineCount);
console.log('Files with Chinese characters:');
for (const r of results) {
  console.log(`${r.file.padEnd(50)} | usesLang: ${String(r.usesLang).padEnd(5)} | zhLines: ${r.zhLineCount}/${r.totalLines}`);
}
