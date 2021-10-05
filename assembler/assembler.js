// Import Library
const file_import = require('fs');

// Constant Variable
const TEXT_PATH = '../code-assembly.txt';

// Array preservation
const ASSEMBLY_LINE = [];

// Dictionary
const LABEL_REF = {};

// Program counter
let pc = 0;

/* Functions */
// function : read text file
function readTextFile(path) {
    const textFile = file_import.readFileSync(path, 'utf-8');

    const readLines = textFile.split(/\r?\n/);

    readLines.forEach((line) => {
        ASSEMBLY_LINE.push(line.split(' ').filter(e => e != ''));
    });

    // debugger
    console.log(ASSEMBLY_LINE);
    // console.log(ASSEMBLY_LINE.length)
}

// function : first read at first element then check is it label?
function preRead() {
    for(let i=0; i < ASSEMBLY_LINE.length; i++){
        if( ASSEMBLY_LINE[i][0] != 'add' &&
            ASSEMBLY_LINE[i][0] != 'nand' &&
            ASSEMBLY_LINE[i][0] != 'lw' &&
            ASSEMBLY_LINE[i][0] != 'sw' &&
            ASSEMBLY_LINE[i][0] != 'beq' &&
            ASSEMBLY_LINE[i][0] != 'jalr' &&
            ASSEMBLY_LINE[i][0] != 'noop' &&
            ASSEMBLY_LINE[i][0] != 'halt') {
            recogLabel(ASSEMBLY_LINE[i][0], i);
        }
    }
}

// function : recognize that line's label and value
function recogLabel(value, line) {
    LABEL_REF[value] = line;
}

// function : check format
function formatChecker(line) {

    let index = 0;

    while(index < ASSEMBLY_LINE[pc].length) {
        switch(ASSEMBLY_LINE[pc][index]) {
            case 'add':
                console.log('found add');
                pc += 1;
                break;
            case 'nand':
                console.log('found nand');
                pc += 1;
                break;
            case 'lw':
                console.log('found lw');
                pc += 1;
                break;
            case 'sw':
                console.log('found sw');
                pc += 1;
                break;
            case 'beq':
                console.log('found beq');
                pc += 1;
                break;
            case 'jalr':
                console.log('found jalr');
                pc += 1;
                break;
            case 'noop':
                console.log('found noop');
                pc += 1;
                break;
            case 'halt':
                console.log('found halt');
                pc += 1;
                break;
            case '.fill':
                console.log('found .fill');
                pc += 1;
                break;
            default:
                index += 1;
                break;
        }
    }
}

function addBinary() {
    
}




/* Main procedure */
try {
    readTextFile(TEXT_PATH);
    preRead();
    while(pc < ASSEMBLY_LINE.length){
        formatChecker(ASSEMBLY_LINE[pc]);
    }
}
catch(err) {
    console.log(err.message);
}