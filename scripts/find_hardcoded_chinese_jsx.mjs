import fs from 'fs';
import path from 'path';

const baseDir = 'C:/Users/Sam/AI-Workspace/projects/d2r-codex';
const compDir = path.join(baseDir, 'src/components');

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

const files = findFiles(compDir, ['.tsx']);
const chineseRegex = /[\u4e00-\u9fa5]/;

const report = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(baseDir, file).replace(/\\/g, '/');
  const lines = content.split('\n');

  const suspiciousLines = [];
  lines.forEach((line, idx) => {
    // Check if line has Chinese
    if (chineseRegex.test(line)) {
      // Check if it's a comment
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        return;
      }
      // Check if it already has isEn or t( or lang
      const hasLangCheck = line.includes('isEn') || line.includes('lang ===') || line.includes('t(') || line.includes('t<');
      if (!hasLangCheck) {
        suspiciousLines.push({ lineNum: idx + 1, text: trimmed });
      }
    }
  });

  if (suspiciousLines.length > 0) {
    report.push({
      file: relPath,
      count: suspiciousLines.length,
      sample: suspiciousLines.slice(0, 5)
    });
  }
}

report.sort((a, b) => b.count - a.count);

console.log(`Found ${report.length} files with suspicious un-localized Chinese lines:\n`);
for (const item of report) {
  console.log(`=== ${item.file} (${item.count} unlocalized lines) ===`);
  for (const s of item.sample) {
    console.log(`  L${s.lineNum}: ${s.text.slice(0, 80)}`);
  }
  console.log('');
}
