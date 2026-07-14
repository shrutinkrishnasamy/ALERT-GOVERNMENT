const fs = require('fs');
const https = require('https');

let content = fs.readFileSync('./src/data/mockData.js', 'utf8');
const regex = /export const DISTRICTS = \[([\s\S]*?)\];/;
const dbMatch = content.match(regex);

if (!dbMatch) {
  process.exit(1);
}

let jsonStr = '[' + dbMatch[1] + ']';
let districts = eval(jsonStr);

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false)).end();
  });
}

async function run() {
  let count = 0;
  for (let i = 0; i < districts.length; i++) {
    const d = districts[i];
    
    // TN gov seems to use Exact Name without spaces, e.g. "The Nilgiris" might be "TheNilgiris" or just spaces.
    // Let's try the direct URL first (with spaces URL-encoded), then removing spaces if that fails
    let urlVariants = [
      `https://www.tn.gov.in/sites/default/district-images/district-list-images/${encodeURIComponent(d.name)}.png`,
      `https://www.tn.gov.in/sites/default/district-images/district-list-images/${d.name.replace(/\s+/g, '')}.png`,
      `https://www.tn.gov.in/sites/default/district-images/district-list-images/${d.name.replace(/\s+/g, '_')}.png`,
      `https://www.tn.gov.in/sites/default/district-images/district-list-images/${d.name.split(' ')[0]}.png` // e.g. "The Nilgiris" -> "The.png"? or "Nilgiris.png"
    ];

    let found = false;
    for (const url of urlVariants) {
      if (await checkUrl(url)) {
        d.image = url;
        count++;
        console.log(`Found official image for ${d.name}: ${url}`);
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log(`Could not find official image for ${d.name}`);
    }
  }

  const replacement = 'export const DISTRICTS = ' + JSON.stringify(districts, null, 2) + ';';
  content = content.replace(regex, replacement);
  fs.writeFileSync('./src/data/mockData.js', content);
  console.log(`Finished updating! Applied official tn.gov.in images to ${count} districts.`);
}

run();
