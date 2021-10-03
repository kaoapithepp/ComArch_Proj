// Import Library
const file_import = require('fs');

// Constant Variable
const TEXT_PATH = 'code-simulation.txt';
const BITCOUNT = 25;

// Array for push
const RAW_DECIMAL_ARRAY = [];
const CMD_BINARY_ARRAY = [];

// function : Read text file
function readTextFile(path) {
    try {
        const textFile = file_import.readFileSync(path, 'utf-8');

        const readLines = textFile.split(/\r?\n/);

        readLines.forEach((line) => {
            RAW_DECIMAL_ARRAY.push(line);
        });

        // debugger
        // console.log(RAW_DECIMAL_ARRAY);

    } catch(err) {
        console.log(new Error(err.message));
    }
}  

// function : 2's complement -> Credit : Brandon Sarà 
function convertToBinary(value) {
    let binaryStr, bitCount = BITCOUNT;
    
    if (value >= 0) {
      let twosComp = value.toString(2);
      binaryStr = padAndChop(twosComp, '0', (bitCount || twosComp.length));
    } else {
      binaryStr = (Math.pow(2, bitCount) + value).toString(2);
      
      if (Number(binaryStr) < 0) {
        return undefined;
      }
    }
    
    return `${binaryStr}`;
}

function padAndChop(str, padChar, length) {
    return (Array(length).fill(padChar).join('') + str).slice(length * -1);
}

/* Identifying Instruction Type */
function identifierBinary(cmd) {
    let converted = convertToBinary(cmd);
    // debugger
    console.log(converted);

    switch(converted.substring(0,3)){
        case '000' : // add    -> R-Type format
            addOps(converted);

            break;
        case '001' : // nand   -> R-Type format
            nandOps(converted);

            break;
        case '010' : // lw     -> I-Type format
            lwOps(converted);

            break;
        case '011' : // sw     -> I-Type format
            swOps(converted);
            
            break;
        case '100' : // beq    -> I-Type format
            beqOps(converted);

            break;
        case '101' : // jalr   -> J-Type format
            jalrOps(converted);

            break;
        case '110' : // halt   -> O-Type format
            haltOps(converted);
            
            break;
        case '111' : // noop   -> O-Type format
            noopOps(converted);
            
            break;
    }
}

/* Operation Functions */
function addOps(line) {
    
}

function nandOps() {

}

function lwOps() {

}

function swOps() {

}

function beqOps() {

}

function jalrOps() {

}

function haltOps() {

}

function noopOps() {

}


/* Main Procedure */
try {
    readTextFile(TEXT_PATH);

    let starter = RAW_DECIMAL_ARRAY[0];
    identifierBinary(starter);
}
catch {
    console.log(new Error());
}