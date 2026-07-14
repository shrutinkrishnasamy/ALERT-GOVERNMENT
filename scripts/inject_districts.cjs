const fs = require('fs');

const rawText = `Ariyalur
Tmt N. Mirunalini, IAS.
Chengalpattu
Dr M. Veerappan, I.A.S.
Chennai
Tmt S. Malathi Helen, IAS.
Coimbatore
Thiru Pavankumar G Giriyappanavar, IAS.
Cuddalore
Thiru Sibi Adhithya Senthil Kumar IAS.
Dharmapuri
Thiru V. Saravanan, I.A.S.
Dindigul
Tmt Durgamoorthi, IAS.
Erode
Thiru S. Kandasamy, IAS.
Kallakurichi
Tmt J.E. Padmaja, IAS
Kancheepuram
Tmt D. Sneha IAS.
Kanniyakumari
Thiru M. Prathap, IAS.
Karur
Thiru C. Muthukumaran, IAS.
Krishnagiri
Thiru C. Dinesh Kumar, IAS
Madurai
Thiru Nishant Krishna, IAS.
Mayiladuthurai
Thiru H.S Srikanth, IAS.
Nagapattinam
Thiru K.J. Praveen Kumar, IAS.
Namakkal
Thiru L. Madhubalan, IAS
Perambalur
Tmt Sharanya Ari, I.A.S
Pudukkottai
Tmt M. Aruna, IAS.
Ramanathapuram
Thiru M. Sivaguru Prabhakaran, I.A.S.
Ranipet
Tmt N. Priya, IAS.
Salem
Thiru K. Elambahavath, IAS.
Sivaganga
Thiru P. Akash, I.A.S.
Tenkasi
Thiru Ranjeet Singh, IAS.
Thanjavur
Tmt R. Revathi, IAS.
Theni
Dr R. Vaithinathan, I.A.S.
The Nilgiris
Tmt Lakshmi Bhavya Tanneeru IAS.
Thoothukudi
Thiru Vishu Mahajan, I.A.S.
Tiruchirappalli
Thiru Pratik Tayal, I.A.S.
Tirunelveli
Thiru Anand Mohan, IAS.
Tirupathur
Tmt G. Ravikumar, IAS.
Tiruppur
Dr Manish Narnaware, IAS
Tiruvallur
Tmt S. Kavitha, IAS.
Tiruvannamalai
Tmt Vandana Garg, IAS
Tiruvarur
Thiru V. Mohanachandran, IAS.
Vellore
Tmt P.S. Leela Alex, IAS.
Viluppuram
Thiru S. Shiek Abdul Rahman, IAS.
Virudhunagar
Dr N.O.Sukhaputra`;

const lines = rawText.split('\n').filter(l => l.trim().length > 0);
const districts = [];

for (let i = 0; i < lines.length; i += 2) {
  let name = lines[i].trim();
  let col = lines[i+1].trim();
  
  districts.push({
    id: name.toLowerCase().replace(/\s+/g, '_'),
    name: name,
    collector: col,
    activeIncidents: name === 'Coimbatore' ? 4 : (name === 'Salem' ? 3 : 0),
    criticalIncidents: name === 'Coimbatore' ? 1 : 0,
    healthScore: name === 'Coimbatore' ? 'Yellow' : (name === 'Salem' ? 'Red' : 'Green'),
    population: Math.floor(Math.random() * 2000000) + 500000,
    lat: 11.0168,
    lng: 76.9558
  });
}

const mockDataPath = './src/data/mockData.js';
let content = fs.readFileSync(mockDataPath, 'utf8');

const regex = /export const DISTRICTS = \[[\s\S]*?\];/;
const replacement = 'export const DISTRICTS = ' + JSON.stringify(districts, null, 2) + ';';

content = content.replace(regex, replacement);
fs.writeFileSync(mockDataPath, content);
console.log('Replaced DISTRICTS in mockData.js');
