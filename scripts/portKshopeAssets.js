const fs = require('fs');
const path = require('path');

const SOURCE_ROOT = path.join(process.env.HOME, 'kshopeeNew', 'src');
const SOURCE_ASSETS = path.join(SOURCE_ROOT, 'assets');
const DEST_ASSETS = path.join(__dirname, '..', 'src', 'kshope', 'assets');

const listSourceFiles = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(full);
    return /\.(ts|tsx|js|jsx)$/.test(entry.name) ? [full] : [];
  });

const listAssetFiles = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listAssetFiles(full) : [full];
  });

const sourceText = listSourceFiles(SOURCE_ROOT)
  .map(file => fs.readFileSync(file, 'utf8'))
  .join('\n');

const assets = listAssetFiles(SOURCE_ASSETS);

const referenced = assets.filter(asset => {
  const base = path.basename(asset);
  const stem = base.replace(/@[23]x/, '').replace(/\.[^.]+$/, '');
  return sourceText.includes(base) || sourceText.includes(stem);
});

const bytes = files => files.reduce((n, f) => n + fs.statSync(f).size, 0);

console.log(`assets found:      ${assets.length} (${(bytes(assets) / 1e6).toFixed(1)} MB)`);
console.log(`assets referenced: ${referenced.length} (${(bytes(referenced) / 1e6).toFixed(1)} MB)`);

referenced.forEach(asset => {
  const rel = path.relative(SOURCE_ASSETS, asset);
  const dest = path.join(DEST_ASSETS, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(asset, dest);
});

const copied = listAssetFiles(DEST_ASSETS);
console.log(`copied:            ${copied.length} (${(bytes(copied) / 1e6).toFixed(1)} MB)`);

const unreferenced = assets.filter(a => !referenced.includes(a));
fs.mkdirSync(DEST_ASSETS, { recursive: true });
fs.writeFileSync(
  path.join(DEST_ASSETS, 'UNREFERENCED.txt'),
  unreferenced.map(a => path.relative(SOURCE_ASSETS, a)).join('\n'),
);
console.log(`skipped:           ${unreferenced.length} (listed in assets/UNREFERENCED.txt)`);
