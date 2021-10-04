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
            MEM_DECIMAL_ARRAY.push(line);
        });

        // debugger
        // console.log(MEM_DECIMAL_ARRAY);

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

function checkTwoComplimentOffset(value) {
    if(value.substr(0,1) == 1){
        for(let i = 0; i < value.length; i++){
            if(value.substr(i, 1) == 1) value.substr(i, 1) = 0;
            else value.substr(i, 1) = 1;
        }

        return `${value}`;
    }
}

/* Identifying Instruction Type */
function identifierBinary(cmd) {
    let converted = convertToBinary(Number(cmd));
    // debugger
    // console.log(converted);

    switch(converted.substr(0,3)){
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
    let opcode = line.substr(0,3);
    let regA = line.substr(3,3);
    let regB = line.substr(6,3);
    let destReg = line.substr(22,3);

    REGISTER_SLOT[parseInt(destReg, 2)] = Number(REGISTER_SLOT[parseInt(regA, 2)])  + Number(REGISTER_SLOT[parseInt(regB, 2)]);
    pc += 1;
    displayState();

    // debugger
    console.log('add');
    // console.log('traceback: ' + opcode + regA + regB + ' [15:3 not use] ' + destReg);
}

function nandOps(line) {
    let opcode = line.substr(0,3);
    let regA = line.substr(3,3);
    let regB = line.substr(6,3);
    let destReg = line.substr(22,3);

}

function lwOps(line) {
    let opcode = line.substr(0,3);
    let regA = line.substr(3,3);
    let regB = line.substr(6,3);
    let offsetField = line.substr(9,16);

    checkTwoComplimentOffset(offsetField);
    REGISTER_SLOT[parseInt(regB, 2)] = MEM_DECIMAL_ARRAY[Number(REGISTER_SLOT[parseInt(regA, 2)]) + parseInt(offsetField, 2)];
    pc += 1;
    displayState();
    
    //debugger
    console.log('lw');
    // console.log('traceback: ' + opcode + regA + regB + offsetField);
    
}

function swOps(line) {
    let opcode = line.substr(0,3);
    let regA = line.substr(3,3);
    let regB = line.substr(6,3);
    let offsetField = line.substr(9,16);

    MEM_DECIMAL_ARRAY[Number(REGISTER_SLOT[parseInt(regA, 2)]) + parseInt(offsetField, 2)] = REGISTER_SLOT[parseInt(regB, 2)];
    pc += 1;
    displayState();

    //debugger
    console.log('sw');
    // console.log('traceback: ' + opcode + regA + regB + offsetField);
}

function beqOps(line) {
    try {
        let opcode = line.substr(0,3);
        let regA = line.substr(3,3);
        let regB = line.substr(6,3);
        let offsetField = line.substr(9,16);

        pc += 1;
        checkTwoComplimentOffset(offsetField);
        console.log('offsetField: ' + offsetField);
        
        if(REGISTER_SLOT[parseInt(regA, 2)] == REGISTER_SLOT[parseInt(regB, 2)]){
            console.log('condition pc: ' + pc);
            pc = pc + 1 + parseInt(offsetField, 2); // offset = 2
        } else {
            console.log('else pc: ' + pc);
        }
    
        displayState();
    
        //debugger
        console.log('beq');
        console.log(REGISTER_SLOT[parseInt(regA, 2)]);
        console.log(REGISTER_SLOT[parseInt(regB, 2)]);
        // console.log('traceback: ' + opcode + regA + regB + offsetField);

    } catch(err) {
        throw err.message;
    }
    
}

function jalrOps(line) {
    let opcode = line.substr(0,3);
    let regA = line.substr(3,3);
    let regB = line.substr(6,3);

    REGISTER_SLOT[parseInt(regB, 2)] = pc + 1;


}

function haltOps(line) {
    let opcode = line.substr(0,3);

    noHalted = 0;
    pc += 1;
}

function noopOps(line) {
    let opcode = line.substr(0,3);
    pc += 1;
}

/* Display state */
function displayState() {
    console.log('@@@');
    console.log('state:');
    console.log(`   command line: ${pc}`);
    console.log('   memory:')
    for(let i = 0; i < MEM_DECIMAL_ARRAY.length; i++){
        console.log(`       mem[${i}] ${MEM_DECIMAL_ARRAY[i]}`);
    }
    console.log('   registers:');
    for(let j = 0; j < REGISTER_SLOT.length; j++){
        console.log(`       reg[${j}] ${REGISTER_SLOT[j]}`);
    }
    console.log('end state \n' );
}


/* Main Procedure */
try {
    readTextFile(TEXT_PATH);
    displayState();

    while(noHalted != 0){
        identifierBinary(MEM_DECIMAL_ARRAY[pc]);
    }
    
}
catch {
    console.log(new Error());
}