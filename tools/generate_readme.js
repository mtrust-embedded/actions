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
  const coverage = fs.readFileSync('docs/coverage.txt', 'utf8');

  const doxygen_link = `[![Doxygen](https://img.shields.io/badge/Doxygen-Code_Documentation-0F69AF?logo=doxygen&logoColor=AAA)](${url}/doxygen/html)`;
  const code_coverage = `[![GCov](https://img.shields.io/badge/gcov-Coverage_Report-0F69AF?logo=coveralls&logoColor=AAA)](${url}/coverage)`;

  fs.writeFileSync('Readme.md', doxygen_link + code_coverage + '\n   ' + ci_badges + '\n   ' + dep_badges + '\n   ### Coverage\n   ' + coverage + '', 'utf8');
  
} catch (err) {
  console.error('Error reading JSON file:', err);
}