const fs = require('fs');

let content = fs.readFileSync('./src/data/mockData.js', 'utf8');
const regex = /export const DISTRICTS = \[([\s\S]*?)\];/;
const dbMatch = content.match(regex);

if (dbMatch) {
  let jsonStr = '[' + dbMatch[1] + ']';
  let districts = eval(jsonStr);
  
  districts = districts.map((d) => {
    // If the image is a placehold.co placeholder, replace it with a picsum photo seed
    if (d.image.includes('placehold.co')) {
      return {
        ...d,
        image: `https://picsum.photos/seed/${encodeURIComponent(d.name)}/400/300`
      };
    }
    return d;
  });

  const replacement = 'export const DISTRICTS = ' + JSON.stringify(districts, null, 2) + ';';
  content = content.replace(regex, replacement);
  fs.writeFileSync('./src/data/mockData.js', content);
  console.log('Replaced all dark placeholders with beautiful landscape photos.');
} else {
  console.log('Error finding DISTRICTS.');
}
