const https = require('https');
const fs = require('fs');

let content = fs.readFileSync('./src/data/mockData.js', 'utf8');
const regex = /export const DISTRICTS = \[([\s\S]*?)\];/;
const dbMatch = content.match(regex);

if (!dbMatch) {
  console.log('Could not find DISTRICTS array in mockData.js');
  process.exit(1);
}

let jsonStr = '[' + dbMatch[1] + ']';
let districts = eval(jsonStr);

async function fetchWikiImage(districtName) {
  return new Promise((resolve) => {
    const title = encodeURIComponent(districtName + '_district');
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=400`;
    
    https.get(url, { headers: { 'User-Agent': 'AlertGovBot/1.0 (contact@example.com)' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  for (let i = 0; i < districts.length; i++) {
    const d = districts[i];
    const imgUrl = await fetchWikiImage(d.name);
    if (imgUrl) {
      console.log(`Found image for ${d.name}: ${imgUrl}`);
      d.image = imgUrl;
    } else {
      console.log(`No wiki image for ${d.name}, trying without '_district'`);
      const fallbackUrl = await fetchWikiImage(d.name.replace(' district', ''));
      if(fallbackUrl) {
        d.image = fallbackUrl;
      }
    }
  }

  const replacement = 'export const DISTRICTS = ' + JSON.stringify(districts, null, 2) + ';';
  content = content.replace(regex, replacement);
  fs.writeFileSync('./src/data/mockData.js', content);
  console.log('Finished updating mockData.js with Wikipedia images!');
}

run();
