const fs = require('fs');
let content = fs.readFileSync('./src/data/mockData.js', 'utf8');

const regex = /export const DISTRICTS = \[([\s\S]*?)\];/;
const match = content.match(regex);
if(match) {
  let jsonStr = '[' + match[1] + ']';
  try {
    let districts = eval(jsonStr);
    districts = districts.map((d) => {
      return {
        ...d,
        image: 'https://placehold.co/400x300/1e293b/ffffff?text=' + encodeURIComponent(d.name)
      };
    });
    const replacement = 'export const DISTRICTS = ' + JSON.stringify(districts, null, 2) + ';';
    content = content.replace(regex, replacement);
    fs.writeFileSync('./src/data/mockData.js', content);
    console.log('Added images to districts.');
  } catch(e) {
    console.log('Parse error', e);
  }
} else {
  console.log('Could not find DISTRICTS');
}
