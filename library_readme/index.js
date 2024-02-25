const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
        
// Your Node.js script logic goes here
// For example, reading a JSON file
const filePath = 'library.json';
try {

  const github_pages_url = core.getInput('gh_pages_url');

  const jsonData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(jsonData);
  console.log(data);
} catch (err) {
  console.error('Error reading JSON file:', err);
}