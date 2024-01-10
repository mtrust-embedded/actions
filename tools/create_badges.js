const { exec } = require('child_process');
const fs = require('fs');

// Function to generate shields.io badge URL
function generateBadge(name, version, logo) {
  return `[![Library](https://img.shields.io/badge/${name}-${version}-0F69AF?logo=${logo}&logoColor=AAA)](#)  `;
}

function replaceBetweenMarkers(filePath, content) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const startMarker = '### Package Dependencies';
        const endMarker = '-----';

        const startIndex = data.indexOf(startMarker);
        const endIndex = data.indexOf(endMarker);

        if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
            console.error('Markers not found or in incorrect order');
            return;
        }

        const contentBefore = data.substring(0, startIndex + startMarker.length);
        const contentAfter = data.substring(endIndex);

        const modifiedContent = contentBefore + '\n' + content + '\n' + contentAfter;

        fs.writeFile(filePath, modifiedContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('Content replaced between markers successfully.');
        });
    });
} 

// Execute the command to get package list
exec('pio pkg list --only-libraries -e example', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Command stderr: ${stderr}`);
    return;
  }

  // Parse the output to get package names and versions
  const packages = stdout.split('\n').filter((line) => line.trim() !== '');
  packages.splice(0, 2);

  var content = "";
  packages.forEach((pkg) => {
    const [prefix, details] = pkg.split("─ ");
    const [library, url] = details.split("(required: ");
    const [packageName, version] = library.split('@');
    var logo = "platformio";
    if(url.includes("azure")){
      logo= "azuredevops";
    } else if(url.includes("github")){
      logo= "github";
    }
    const badgeURL = generateBadge(packageName.trim(), version.trim().split("+")[0], logo);
    content += badgeURL;
  });
  console.log(content);
  replaceBetweenMarkers("./Readme.md", content);
});
