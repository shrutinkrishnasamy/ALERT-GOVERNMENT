const https = require('https');
const fs = require('fs');

https.get('https://www.tn.gov.in/district_list.php', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = [];
    // The images on the site might not be in a "district" folder, or the alt tag might not match perfectly.
    // Let's print all images first to see
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(data)) !== null) {
      matches.push({ src: 'https://www.tn.gov.in/' + match[1], alt: match[2].trim() });
    }
    console.log("Found " + matches.length + " total images with alt tags.");
    
    // Filter out obvious layout images
    const districtImages = matches.filter(m => m.src.includes('district') || m.src.includes('upload'));
    console.log("Found " + districtImages.length + " district images.");
    console.log(districtImages.slice(0, 5));
    
    let content = fs.readFileSync('./src/data/mockData.js', 'utf8');
    const regex = /export const DISTRICTS = \[([\s\S]*?)\];/;
    const dbMatch = content.match(regex);
    if(dbMatch) {
      let jsonStr = '[' + dbMatch[1] + ']';
      let districts = eval(jsonStr);
      districts = districts.map((d) => {
        // Find matching image: checking if the alt tag contains the district name OR if the src contains the district name
        const img = districtImages.find(m => 
          m.alt.toLowerCase().includes(d.name.toLowerCase()) || 
          m.src.toLowerCase().includes(d.name.toLowerCase().replace(/\s+/g, ''))
        );
        return {
          ...d,
          image: img ? img.src : d.image
        };
      });
      const replacement = 'export const DISTRICTS = ' + JSON.stringify(districts, null, 2) + ';';
      content = content.replace(regex, replacement);
      fs.writeFileSync('./src/data/mockData.js', content);
      console.log('Successfully updated mockData.js with real images.');
    } else {
      console.log('Could not find DISTRICTS array in mockData.js');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
