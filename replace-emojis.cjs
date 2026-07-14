const fs = require('fs');
const path = require('path');

const EMOJI_MAP = {
  '📊': 'BarChart2',
  '🔍': 'Search',
  '📍': 'MapPin',
  '📷': 'Camera',
  '🤖': 'Bot',
  '⚠️': 'AlertTriangle',
  '⚡': 'Zap',
  '🔄': 'RefreshCw',
  '🆕': 'PlusCircle',
  '🚨': 'ShieldAlert',
  '📋': 'ClipboardList',
  '📡': 'Radio',
  '🚒': 'Truck',
  '✅': 'CheckCircle',
  '🟢': 'CheckCircle',
  '🟡': 'AlertCircle',
  '🟠': 'AlertTriangle',
  '🔴': 'XCircle',
  '⛔': 'XOctagon',
  '🔥': 'Flame'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  const iconsToAdd = new Set();
  
  for (const [emoji, iconName] of Object.entries(EMOJI_MAP)) {
    if (content.includes(emoji)) {
      const regex = new RegExp(emoji, 'g');
      content = content.replace(regex, "<" + iconName + " size=\"1.2em\" style={{ verticalAlign: 'middle', marginRight: '4px' }} />");
      iconsToAdd.add(iconName);
      changed = true;
    }
  }

  if (changed) {
    let importMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
    if (importMatch) {
      let existingIcons = importMatch[1].split(',').map(s => s.trim());
      iconsToAdd.forEach(icon => {
        if (!existingIcons.includes(icon)) {
          existingIcons.push(icon);
        }
      });
      content = content.replace(importMatch[0], "import { " + existingIcons.join(', ') + " } from 'lucide-react'");
    } else {
      const importStmt = "import { " + Array.from(iconsToAdd).join(', ') + " } from 'lucide-react';\n";
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLine = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLine + 1) + importStmt + content.slice(endOfLine + 1);
      } else {
        content = importStmt + content;
      }
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Updated " + filePath);
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
