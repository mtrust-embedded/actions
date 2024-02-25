const { exec } = require('child_process');
const fs = require('fs');

// Function to generate shields.io badge URL
function generateBadge(name, version, logo) {
  name = name.replace(/ /g, "_");
  return `[![Library](https://img.shields.io/badge/${name}-${version}-0F69AF?logo=${logo}&logoColor=AAA)](#)  `;
}

// Get the parameter passed to the script
const parameter = process.argv[2]; // Assuming the parameter is passed as the first command-line argument

// Execute the command to get package list with the provided parameter
exec(`pio pkg list --only-libraries -e ${parameter}`, (error, stdout, stderr) => {
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
  fs.writeFileSync('docs/dep-badges.md', "### Dependencies\n  " + content, 'utf8');
  
});
