// Import Library
const file_import = require('fs');

// Constant Variable
const TEXT_PATH = 'code-simulation.txt';
const BITCOUNT = 25;

// Array preservation
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
        console.log(RAW_DECIMAL_ARRAY);

    } catch(err) {
        console.log(new Error(err.message));
    }
}  
    
// function : Convert to binary
function convertToBinary(data) {
    try {
        data.forEach((elem) => {
            CMD_BINARY_ARRAY.push(isTwoComplement(Number(elem)));
        });

        // debugger
        console.log(CMD_BINARY_ARRAY);

    } catch {
        console.log(new Error());
    }
}

// function : 2's complement -> Credit : Brandon Sarà 
function isTwoComplement(value) {
    let binaryStr, bitCount = BITCOUNT;
    
    if (value >= 0) {
        let twosComp = value.toString(2);
        binaryStr    = padAndChop(twosComp, '0', (bitCount || twosComp.length));
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
function identifierBinary(bin) {
    bin.forEach((data) => {
        switch(data.substring(0,3)){
            case '000' :
                console.log('add    -> R-Type format');
                break;
            case '001' :
                console.log('nand   -> R-Type format');
                break;
            case '010' :
                console.log('lw     -> I-Type format');
                break;
            case '011' :
                console.log('sw     -> I-Type format');
                break;
            case '100' :
                console.log('beq    -> I-Type format');
                break;
            case '101' :
                console.log('jalr   -> J-Type format');
                break;
            case '110' :
                console.log('halt   -> O-Type format');
                break;
            case '111' :
                console.log('noop   -> O-Type format');
                break;
        }
    });
}


/* Main Procedure */
try {
    readTextFile(TEXT_PATH);
    convertToBinary(RAW_DECIMAL_ARRAY);
    // identifierBinary(CMD_BINARY_ARRAY);
}
catch {
    console.log(new Error());
}