const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '../../package.json');

if (!fs.existsSync(pkgPath)) {
  process.stderr.write('package.json not found');
  process.exit(2);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

if (pkg.type !== 'module') {
  process.stderr.write('package.json missing "type": "module"');
  process.exit(2);
}

process.stdout.write('package.json OK: type=module');
process.exit(0);
