// Import Library
const file_import = require('fs');

// Test Cases
const TEXT_PATH = '../assembler/export-maccode.txt';

// Constant Varible
const BITCOUNT = 25;

// Array preservation
const MEM_DECIMAL_ARRAY = [];
const REGISTER_SLOT = [0, 0, 0, 0, 0, 0, 0, 0];

// Program counter and terminator
let pc = 0;
let inst_count = 0;
let noHalted = true;

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
    let sqrtNum = Math.pow(2, value.length) - 1;
    if(value.substr(0,1) ==  1){
        const packed = sqrtNum - parseInt(value, 2);
        return `${~packed}`; // we got negative value
    } else {
        const same = parseInt(value, 2);
        return `${same}`;
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
    
    // debugger
    // console.log('opcode : ' + opcode)
    // console.log('regA : ' + regA)
    // console.log('regB : ' + regB)
    // console.log('destReg : ' + destReg)

    REGISTER_SLOT[parseInt(destReg, 2)] = Number(REGISTER_SLOT[parseInt(regA, 2)])  + Number(REGISTER_SLOT[parseInt(regB, 2)]);
    pc += 1;
    inst_count += 1;

    displayState();

    // debugger
    // console.log('add : ' + opcode + regA + regB + destReg);
    // console.log('add \n');
}

function nandOps(line) {
    let opcode = line.substr(0,3);
    let regA = line.substr(3,3);
    let regB = line.substr(6,3);
    let destReg = line.substr(22,3);

    let str='';
    for(let i = 0; i < regA.length ; i++){
        if(1 == regA.charAt(i) && 1 == regB.charAt(i)){
            str += '0';
        } else {
            str += '1';
        }
    }

    REGISTER_SLOT[parseInt(destReg, 2)] = checkTwoComplimentOffset(str);

    // debugger
    // console.log('nand : ' + opcode + regA + regB + destReg);

    inst_count += 1;
}

function lwOps(line) {
    let opcode = line.substr(0,3);
    let regA = line.substr(3,3);
    let regB = line.substr(6,3);
    let offsetField = line.substr(9,16);

    checkTwoComplimentOffset(offsetField);
    REGISTER_SLOT[parseInt(regB, 2)] = MEM_DECIMAL_ARRAY[Number(REGISTER_SLOT[parseInt(regA, 2)]) + parseInt(offsetField, 2)];
    pc += 1;
    inst_count += 1;

    displayState();
    
    // debugger
    // console.log('lw : ' + opcode + regA + regB + offsetField);
    // console.log('lw \n');
}

function swOps(line) {
    let opcode = line.substr(0,3);
    let regA = line.substr(3,3);
    let regB = line.substr(6,3);
    let offsetField = line.substr(9,16);

    MEM_DECIMAL_ARRAY[Number(REGISTER_SLOT[parseInt(regA, 2)]) + parseInt(offsetField, 2)] = REGISTER_SLOT[parseInt(regB, 2)];
    pc += 1;
    inst_count += 1;

    displayState();

    // debugger
    // console.log('sw : ' + opcode + regA + regB + offsetField);
    // console.log('sw \n');
}

function beqOps(line) {
    try {
        let opcode = line.substr(0,3);
        let regA = line.substr(3,3);
        let regB = line.substr(6,3);
        let offsetField = line.substr(9,16);
        
        let res = checkTwoComplimentOffset(offsetField);

        // debugger
        // console.log('res : ' + res);
        // console.log('pc : ' + pc);

        if(REGISTER_SLOT[parseInt(regA, 2)] == REGISTER_SLOT[parseInt(regB, 2)]){
            pc = pc + Number(res) + 1;
        } else {
            pc += 1;
        }
        
        inst_count += 1;

        displayState();
        
        // debugger
        // console.log('beq : ' + opcode + regA + regB + offsetField);
        // console.log('beq \n');

    } catch(err) {
        throw err.message;
    }
    
}

function jalrOps(line) {
    let opcode = line.substr(0,3);
    let regA = line.substr(3,3);
    let regB = line.substr(6,3);

    pc += 1;

    if(REGISTER_SLOT[parseInt(regA, 2)] == REGISTER_SLOT[parseInt(regB, 2)]) {
        REGISTER_SLOT[parseInt(regB, 2)] = pc;
        pc = MEM_DECIMAL_ARRAY[parseInt(regB, 2)];
    } else {
        REGISTER_SLOT[parseInt(regB, 2)] = pc;
        pc = MEM_DECIMAL_ARRAY[parseInt(regA, 2)];
    }

    // debugger
    // console.log('jalr : ' + opcode + regA + regB);

    inst_count += 1;
}

function haltOps(line) {
    let opcode = line.substr(0,3);

    pc += 1;
    noHalted = 0;
    inst_count += 1;
    

    displayState();

    // debugger
    // console.log('halt : ' + opcode);
    // console.log('halt \n');
}

function noopOps(line) {
    let opcode = line.substr(0,3);

    pc += 1;
    inst_count += 1;
    
    displayState();
    
    // debugger
    // console.log('noop : ' + opcode);
    // console.log('noop \n');
}

/* Display state */
function displayState() {
    console.log('@@@');
    console.log('state:');
    console.log(`   pc: ${pc}`);
    console.log('   memory:')
    for(let i = 0; i < MEM_DECIMAL_ARRAY.length; i++){
        console.log(`       mem[${i}] ${MEM_DECIMAL_ARRAY[i]}`);
    }
    console.log('   registers:');
    for(let j = 0; j < REGISTER_SLOT.length; j++){
        console.log(`       reg[${j}] ${REGISTER_SLOT[j]}`);
    }
    console.log('end state \n');
}


/* Main Procedure */
try {
    readTextFile(TEXT_PATH);
    displayState();

    while(noHalted){
        identifierBinary(MEM_DECIMAL_ARRAY[pc]);
    }

    // debugger
    // while(pc < 10){
    //     identifierBinary(MEM_DECIMAL_ARRAY[pc]);
    // }

    console.log('# of instructions: ' + inst_count);
    
}
catch(err) {
    console.log(err);
}