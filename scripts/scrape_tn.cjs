const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Pretend to be a real user
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
  
  console.log('Navigating to tn.gov.in...');
  await page.goto('https://www.tn.gov.in/district_list.php', { waitUntil: 'networkidle2' });
  
  console.log('Extracting images...');
  const images = await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('img');
    elements.forEach(img => {
      if (img.src && img.src.includes('district') || (img.alt && img.alt.length > 0)) {
        results.push({ src: img.src, alt: img.alt.trim() });
      }
    });
    return results;
  });
  
  console.log(`Found ${images.length} images.`);
  
  let content = fs.readFileSync('./src/data/mockData.js', 'utf8');
  const regex = /export const DISTRICTS = \[([\s\S]*?)\];/;
  const dbMatch = content.match(regex);
  if (dbMatch) {
    let jsonStr = '[' + dbMatch[1] + ']';
    let districts = eval(jsonStr);
    
    let replaceCount = 0;
    districts = districts.map(d => {
      // Find matching image based on district name
      // The tn.gov.in alt tags might be exactly the district name or part of it
      // Their SRC usually contains the district name
      const matchingImg = images.find(img => 
        (img.alt && img.alt.toLowerCase() === d.name.toLowerCase()) || 
        (img.src && img.src.toLowerCase().includes(d.name.toLowerCase().replace(/\s+/g, '')))
      );
      
      if (matchingImg) {
        replaceCount++;
        return {
          ...d,
          image: matchingImg.src
        };
      }
      return d;
    });
    
    console.log(`Matched and replaced ${replaceCount} district images from tn.gov.in!`);
    
    const replacement = 'export const DISTRICTS = ' + JSON.stringify(districts, null, 2) + ';';
    content = content.replace(regex, replacement);
    fs.writeFileSync('./src/data/mockData.js', content);
    console.log('mockData.js updated successfully.');
  }
  
  await browser.close();
})();
