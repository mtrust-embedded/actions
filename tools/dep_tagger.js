const { execSync } = require('child_process');
const fs = require('fs');

const processDependencies = (input) => {
    const lines = input.split('\n');
    const libraries = {};
    let currentLibrary = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('├──') || line.startsWith('└──')) {
            var [libraryName, ...urlParts] = line.split('@').map((item) => item.trim());
            var url = urlParts.join('@');

            version = url.split('+')[0].split(' ')[0];
            url = url.split('required:')[1].trim();

            currentLibrary = {
                name: libraryName,
                version,
                url,
            };
            libraries[libraryName] = currentLibrary;
        }
    }
    return libraries;
};

const replaceContentInFile = (filePath, contentToReplace, newContent) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const updatedContent = fileContent.replace(contentToReplace, newContent);
    fs.writeFileSync(filePath, updatedContent, 'utf8');
};


const get_libs = (environment) => {
    const result = execSync('pio pkg list -e ' + environment + ' --only-libraries').toString().trim();
    const libraries = processDependencies(result);
    console.log(libraries);
    return libraries;
}

// Main function
const main = () => {

    const cliCommand = process.argv[2];
    const environment = process.argv[3];

    if( cliCommand == 'tag'){
        // iterate over the libraries map
        for (const [key, lib] of Object.entries(get_libs(environment))) {
            // check if this is a mtrust library from github
            if(lib.url.includes('github.com:merckgroup/mtrust')){
                console.log(lib);
                const old_url = lib.url.split("+")[1].replace(')', '')
                const new_url = old_url.split("#")[0] + '#v' + lib.version;
                console.log(old_url);
                console.log(new_url);
                replaceContentInFile('platformio.ini', old_url, new_url);
                replaceContentInFile('library.json', old_url, new_url);
            }
        }
    }

};

// Call the main function
main();
