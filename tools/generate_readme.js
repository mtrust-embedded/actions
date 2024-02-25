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

  const ci_badges = fs.readFileSync('docs/ci-badges.md', 'utf8');
  const dep_badges = fs.readFileSync('docs/dep-badges.md', 'utf8');

  fs.writeFileSync('Readme.md', `[Pages](${url})\n ${ci_badges}\n ${dep_badges}`, 'utf8');
  
} catch (err) {
  console.error('Error reading JSON file:', err);
}