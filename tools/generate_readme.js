const fs = require('fs');

const url = process.argv[2];

if (!url) {
  console.error('Please provide the github pages url.');
  process.exit(1);
}
const filePath = 'library.json';

try {
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(jsonData);
  console.log(data);

  fs.writeFileSync('Readme.md', `[Pages](${url})   # Data from JSON File\n\n\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`, 'utf8');
  
} catch (err) {
  console.error('Error reading JSON file:', err);
}