// Import Library
const file_import = require('fs');

// Constant Variable
const TEXT_PATH = '../code-simulation.txt';
const BITCOUNT = 25;

// Array preservation
const MEM_DECIMAL_ARRAY = [];
const REGISTER_SLOT = [0, 0, 0, 0, 0, 0, 0, 0];

// Program counter and terminator
let pc = 0;
let noHalted = 1;

// function : Read text file
function readTextFile(path) {
    try {
        const textFile = file_import.readFileSync(path, 'utf-8');

        const readLines = textFile.split(/\r?\n/);

        readLines.forEach((line) => {
            MEM_DECIMAL_ARRAY.push(convertToBinary(Number(line)));
        });

        // debugger
        console.log(MEM_DECIMAL_ARRAY);

    } catch(err) {
        console.log(new Error(err.message));
    }
}

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

readTextFile(TEXT_PATH);