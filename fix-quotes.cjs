const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Pattern for single quoted JSX that contains unescaped single quotes, which causes syntax error
  // Example: '<ShieldAlert size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} />'
  const regex = /'([<]([A-Za-z0-9]+) size="1\.2em" style=\{\{ verticalAlign: 'middle', marginRight: '4px' \}\} \/>)'/g;

  if (regex.test(content)) {
    content = content.replace(regex, '$1');
    changed = true;
  }

  // Also fix CreateIncident.jsx case if it exists in double quotes (just in case)
  const regexDouble = /"([<]([A-Za-z0-9]+) size="1\.2em" style=\{\{ verticalAlign: 'middle', marginRight: '4px' \}\} \/>)"/g;
  if (regexDouble.test(content)) {
    content = content.replace(regexDouble, '$1');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'src/pages'));
