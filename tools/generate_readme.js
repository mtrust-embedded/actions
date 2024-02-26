const fs = require('fs');

const url = process.argv[2];

if (!url) {
  console.error('Please provide the github pages url.');
  process.exit(1);
}
const filePath = 'library.json';

const coveragePercentage = (url) => {
  // Read the content of the file
  const content = fs.readFileSync('docs/coverage.txt', 'utf8');
  
  // Split the content into lines
  const lines = content.split('\n');

  // Find the line containing the total coverage
  const totalLineIndex = lines.findIndex(line => line.includes('TOTAL'));

  if (totalLineIndex !== -1) {
    const totalLine = lines[totalLineIndex];
    const totalPercentageMatch = totalLine.match(/\d+%$/);

    if (totalPercentageMatch) {
      const totalPercentage = parseFloat(totalPercentageMatch[0]);
      return `[![GCov](https://img.shields.io/badge/gcov-${totalPercentage}%-0F69AF?logo=coveralls&logoColor=AAA)](${url}/coverage)`;
    } else {
      return 'Unable to parse total coverage percentage.';
    }
  } else {
    return 'TOTAL line not found in coverage report.';
  }
}

try {
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(jsonData);
  console.log(data);

  const ci_badges = fs.readFileSync('docs/ci-badges.md', 'utf8');
  const dep_badges = fs.readFileSync('docs/dep-badges.md', 'utf8');
  const coverage = fs.readFileSync('docs/coverage.md', 'utf8');

  const doxygen_link = `[![Doxygen](https://img.shields.io/badge/Doxygen-Code_Documentation-0F69AF?logo=doxygen&logoColor=AAA)](${url}/doxygen/html)`;

  const coverage_badge = coveragePercentage(url);

  
  fs.writeFileSync('Readme.md', ci_badges + " " + coverage_badge + " " + doxygen_link + " " + code_coverage + '\n   ' + dep_badges + '\n   ### Coverage\n   ' + coverage + '', 'utf8');
  
} catch (err) {
  console.error('Error reading JSON file:', err);
}