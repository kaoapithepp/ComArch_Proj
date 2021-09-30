// Import Library
const file_import = require('fs');

// Constant Variable
const TEXT_PATH = 'code-assembly.txt';


/* 
    Functions
*/

// function : read text file
function readTextFile(path) {
    const textFile = file_import.readFileSync(path, 'utf-8');

    const readLines = textFile.split(/\r?\n/);

    readLines.forEach((line) => {
        console.log(line);
        translatorAssembly(line);
    });
}

// function : translating to a format
function translatorAssembly(cmd) {

}




/*
    Main procedure
*/
try {
    readTextFile(TEXT_PATH);
}
catch(err) {
    console.log(err.message)
}