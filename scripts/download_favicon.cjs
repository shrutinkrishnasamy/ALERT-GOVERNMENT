const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_fqlPsST0qyraa4iLaHJEBrTfJcvbrKCGw5FMVxXd2g&s=10', (res) => {
  let data = [];
  res.on('data', chunk => data.push(chunk));
  res.on('end', () => {
    let buffer = Buffer.concat(data);
    let base64 = buffer.toString('base64');
    let svg = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circleView">
      <circle cx="128" cy="128" r="128" />
    </clipPath>
  </defs>
  <image width="256" height="256" href="data:image/jpeg;base64,${base64}" clip-path="url(#circleView)" preserveAspectRatio="xMidYMid slice" />
</svg>`;
    const outPath = path.join(__dirname, '..', 'public', 'favicon.svg');
    fs.writeFileSync(outPath, svg);
    console.log('Favicon created at ' + outPath);
  });
}).on('error', (err) => {
  console.error(err);
});
