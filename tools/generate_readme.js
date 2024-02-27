const fs = require('fs');

const url = process.argv[2];
const version = process.argv[3];

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
      return `[![GCov](https://img.shields.io/badge/gcov-${totalPercentage}%25-0F69AF?logo=coveralls&logoColor=AAA)](${url}coverage)`;
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

  var ci_badges = ""
  try{
    ci_badges = fs.readFileSync('docs/ci-badges.md', 'utf8');
  } catch(err){
    console.error("Skipped ci badges")
  }
 
  var dep_badges = ""
  try{
    dep_badges = fs.readFileSync('docs/dep-badges.md', 'utf8');
  } catch(err){
    console.error("Skipped dep badges")
  }

  var coverage = ""
  try{
    coverage = fs.readFileSync('docs/coverage.md', 'utf8');
  } catch(err){
    console.error("Skipped coverage report")
  }

  const doxygen_link = `[![Doxygen](https://img.shields.io/badge/Doxygen-Code_Documentation-0F69AF?logo=doxygen&logoColor=AAA)](${url}doxygen/html)`;

  var coverage_badge = ""
  try{ 
    coverage_badge =  coveragePercentage(url);
  } catch(err){
    console.error("Skipped coverage badge")
  }

  var readme_header = ""
  readme_header +=  `## ${jsonData.name} ${version}\n   `
  readme_header +=  `${jsonData.description}\n   `

  fs.writeFileSync('Readme.md', readme_header + "\n   " + ci_badges + " " + coverage_badge + " " + doxygen_link + '\n   ' + dep_badges + '\n   ' + coverage + '', 'utf8');
  
} catch (err) {
  console.error('Error reading JSON file:', err);
}