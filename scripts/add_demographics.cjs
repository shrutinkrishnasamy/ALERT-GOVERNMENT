const fs = require('fs');

let content = fs.readFileSync('./src/data/mockData.js', 'utf8');
const regex = /export const DISTRICTS = \[([\s\S]*?)\];/;
const dbMatch = content.match(regex);

if (dbMatch) {
  let jsonStr = '[' + dbMatch[1] + ']';
  let districts = eval(jsonStr);
  
  districts = districts.map((d) => {
    return {
      ...d,
      area: `${Math.floor(Math.random() * 5000) + 1500} sq. km.`,
      headquarters: d.name,
      language: "Tamil, English"
    };
  });

  const replacement = 'export const DISTRICTS = ' + JSON.stringify(districts, null, 2) + ';';
  content = content.replace(regex, replacement);
  fs.writeFileSync('./src/data/mockData.js', content);
  console.log('Added demographic data to mockData.js');
} else {
  console.log('Error finding DISTRICTS.');
}
