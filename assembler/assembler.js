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

    // debugger
    console.log(LABEL_REF);
}

// function : recognize that line's label and value
function recogLabel(value, line) {
    LABEL_REF[value] = line;
}

// function : check label; if it has label, goes trim off it
function checkForTrim(input) {
    if( input[0] != 'add' &&
        input[0] != 'nand' &&
        input[0] != 'lw' &&
        input[0] != 'sw' &&
        input[0] != 'beq' &&
        input[0] != 'jalr' &&
        input[0] != 'noop' &&
        input[0] != 'halt') {
        input.splice(0, 1);
        return input;
    } else {
        return input;
    }
}

// function : check format
function formatChecker(line) {

    let index = 0;

    while(index < ASSEMBLY_LINE[pc].length) {
        switch(ASSEMBLY_LINE[pc][index]) {
            case 'add':
                // console.log('found add');
                addBinary(ASSEMBLY_LINE[pc]);
                pc += 1;
                break;
            case 'nand':
                // console.log('found nand');
                nandBinary(ASSEMBLY_LINE[pc])
                pc += 1;
                break;
            case 'lw':
                // console.log('found lw');
                lwBinary(ASSEMBLY_LINE[pc]);
                pc += 1;
                break;
            case 'sw':
                // console.log('found sw');
                swBinary(ASSEMBLY_LINE[pc]);
                pc += 1;
                break;
            case 'beq':
                // console.log('found beq');
                beqBinary(ASSEMBLY_LINE[pc]);
                pc += 1;
                break;
            case 'jalr':
                console.log('found jalr');
                jalrBinary(ASSEMBLY_LINE[pc]);
                pc += 1;
                break;
            case 'noop':
                // console.log('found noop');
                noopBinary(ASSEMBLY_LINE[pc]);
                pc += 1;
                break;
            case 'halt':
                // console.log('found halt');
                haltBinary(ASSEMBLY_LINE[pc]);
                pc += 1;
                break;
            case '.fill':
                // console.log('found .fill');
                fillBinary(ASSEMBLY_LINE[pc]);
                pc += 1;
                break;
            default:
                index += 1;
                break;
        }
    }
}

function extend3Bit(value) {
    if(value.length < 3){
        for(let i = 0; i <= (3 - value.length) ; i++){
            value = '0' + value;
        }
    }
    return value;
}

function extend16Bit(value) {
    if(value.length < 16){
        for(let i = 0; i <= (16 - value.length) ; i++){
            value = '0' + value;
        }
    }
    return value;
}

// function : translate add command to bin
function addBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '000';
    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let notUsed = '0000000000000';
    let destReg = extend3Bit(Number(trimmedCmd[trimmedCmd.length - 1]).toString(2));

    let decimal = parseInt((opcode + regA + regB + notUsed + destReg), 2);
    console.log('add as decimal : ' + decimal);
}

function nandBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '001';
    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let notUsed = '0000000000000';
    let destReg = extend3Bit(Number(trimmedCmd[trimmedCmd.length - 1]).toString(2));

    let decimal = parseInt((opcode + regA + regB + notUsed + destReg), 2);
    console.log('nand as decimal : ' + decimal);
}

function lwBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '010';
    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let offsetField = trimmedCmd[trimmedCmd.length - 1];
    // if(typeof offsetField)

    let decimal = parseInt((opcode + regA + regB + offsetField), 2);
    console.log(opcode + regA + regB + offsetField);
    console.log('lw as decimal : '+ decimal);
}

function swBinary(cmd) {
    console.log(cmd);
}

function beqBinary(cmd) {
    console.log(cmd);
}

function jalrBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '101';
    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let notUsed = '0000000000000';

    let decimal = parseInt((opcode + regA + regB + notUsed), 2);
    console.log(decimal);
}

function haltBinary(cmd) {
    console.log(cmd);

    let opcode = '110';
    let notUsed = '0000000000000000000000';

    let decimal = parseInt((opcode + notUsed), 2);
    console.log('halt as decimal : ' + decimal);
}

function noopBinary(cmd) {
    console.log(cmd);

    let opcode = '111';
    let notUsed = '0000000000000000000000';

    let decimal = parseInt((opcode + notUsed), 2);
    console.log('noop as decimal : ' + decimal);
}

function fillBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

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