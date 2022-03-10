// Import Library
const file_import = require('fs');

// Test Cases
const TEXT_PATH = '../assembler/export-maccode.txt';
// const TEXT_PATH = '../code-simulation.txt';

// Constant Varible
const BITCOUNT = 25;

// Array preservation
const MEM_DECIMAL_ARRAY = [];
const MEM_BINARY_ARRAY = [];
let REGISTER_SLOT = [0, 0, 0, 0, 0, 0, 0, 0];

// Program counter and terminator
let pc = 0;
let inst_count = 0;
let noHalted = true;

// function: Read text file
function readTextFile(path) {
    try {
        const textFile = file_import.readFileSync(path, 'utf-8');

        const readLines = textFile.split(/\r?\n/);

        readLines.forEach((line) => {
            MEM_DECIMAL_ARRAY.push(line);
        });

        MEM_DECIMAL_ARRAY.map((elem) => {
            MEM_BINARY_ARRAY.push(convertToBinary(Number(elem)));
        })

        // debugger
        // console.log(MEM_DECIMAL_ARRAY);

    } catch(err) {
        console.log(new Error(err.message));
    }
}  

// function: 2's complement and extend to signed binary -> Credit : Brandon Sarà 
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

// check 2's compliment binary then convert to decimal
function checkTwoComplimentOffset(value) {
    let sqrtNum = Math.pow(2, value.length) - 1;
    if(value.substr(0,1) == 1){
        const packed = sqrtNum - parseInt(value, 2);
        return `${~packed}`; // we got negative value
    } else {
        const same = parseInt(value, 2);
        return `${same}`;
    }
}

// unsigned extend bit
function extend16Bit(value) {
    let temp = value;
    if(value.length < 16){
        for(i in 16 - value.length){
            temp = '0' + temp;
        }
    }

    return temp;
}

/* Identifying Instruction Type */
function identifierBinary(bin){
    let opcode = bin.substr(0,3);
    // R-Type format
    if(opcode == '000' || opcode == '001'){
        let regA = bin.substr(3,3);
        let regB = bin.substr(6,3);
        let destReg = bin.substr(22,3);

        switch(opcode){
            case '000': // add
                addOps(regA, regB, destReg);
                break;
            case '001': // nand
                nandOps(regA, regB, destReg);
                break;
        }
    } 
    // I-Type format
    else if(opcode == '010' || opcode == '011' || opcode == '100'){
        let regA = bin.substr(3,3);
        let regB = bin.substr(6,3);
        let offsetField = bin.substr(9,16);

        switch(opcode){
            case '010' : // lw
                lwOps(regA, regB, offsetField);
                break;
            case '011' : // sw
                swOps(regA, regB, offsetField);
                break;
            case '100' : // beq
                beqOps(regA, regB, offsetField);
                break;
        }
    }
    // J-Type format
    else if(opcode == '101'){
        let regA = bin.substr(3,3);
        let regB = bin.substr(6,3);
        
        jalrOps(regA, regB);
    } else {
        switch(opcode){
            case '110' : // halt
                haltOps();
                break;
            case '111' : // noop 
                noopOps();
                break;
        }
    }
}

/* Operation Functions */
// Add command
function addOps(regA, regB, destReg) {
    REGISTER_SLOT[Number(parseInt(destReg, 2))] = Number(REGISTER_SLOT[parseInt(regA, 2)]) + Number(REGISTER_SLOT[parseInt(regB, 2)]);
    pc += 1;
    inst_count += 1;
}

// Nand command
function nandOps(regA, regB, destReg) {
    let regAext = String(extend16Bit(Number(REGISTER_SLOT[parseInt(regA, 2)]).toString(2)));
    let regBext = String(extend16Bit(Number(REGISTER_SLOT[parseInt(regB, 2)]).toString(2)));

    let str = '';

    for(i in regAext.length){
        str += `${1-(Number(regAext.charAt(i)) * Number(regBext.charAt(i)))}`;
    }

    REGISTER_SLOT[parseInt(destReg, 2)] = parseInt(str, 2);
    pc += 1;
    inst_count += 1;
}

// Load word
function lwOps(regA, regB, offsetField) {
    REGISTER_SLOT[parseInt(regB, 2)] = MEM_DECIMAL_ARRAY[Number(REGISTER_SLOT[parseInt(regA, 2)]) + parseInt(offsetField, 2)];
    pc += 1;
    inst_count += 1;
}

// Store word
function swOps(regA, regB, offsetField) {
    MEM_DECIMAL_ARRAY[Number(parseInt(offsetField, 2)) + Number(REGISTER_SLOT[parseInt(regA, 2)])] = Number(REGISTER_SLOT[parseInt(regB, 2)]);
    pc += 1;
    inst_count += 1;
}

// Branch if equal
function beqOps(regA, regB, offsetField) {
    let res = Number(checkTwoComplimentOffset(offsetField));

    if(REGISTER_SLOT[parseInt(regA, 2)] == REGISTER_SLOT[parseInt(regB, 2)]){
        pc = pc + res + 1;
    } else {
        pc += 1;
    }
    
    inst_count += 1;
}

// Jump and link register
function jalrOps(regA, regB) {
    pc += 1;
    REGISTER_SLOT[parseInt(regB, 2)] = pc;

    if(regA != regB) {
        pc = Number(REGISTER_SLOT[parseInt(regA, 2)]);
    }

    inst_count += 1;
}

// Halt command
function haltOps() {
    pc += 1;
    noHalted = false;
    inst_count += 1;
    
    // displayState();
}

// Noop command
function noopOps() {
    pc += 1;
    inst_count += 1;
    
    // displayState();
}

/* Display state */
function displayState() {
    console.log('@@@');
    console.log('state:');
    console.log(`   pc: ${pc}`);
    console.log('   memory:')
    MEM_DECIMAL_ARRAY.forEach((element, index) => {
        console.log(`       mem[${index}] ${element}`);
    });
    console.log('   registers:');
    REGISTER_SLOT.forEach((element, index) => {
        console.log(`       reg[${index}] ${element}`);
    });
    console.log('end state \n');
}


/* Main Procedure */
try {
    const start = Date.now();

    readTextFile(TEXT_PATH);
    displayState();

    while(noHalted){
        identifierBinary(MEM_BINARY_ARRAY[pc]);
        displayState();
    }

    console.log('# of instructions: ' + inst_count);
    // Memory usage
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

    // Execution time
    const stop = Date.now();
    console.log(`Time Taken to execute = ${(stop - start)/1000} seconds`);
} catch(err) {
    console.log(err);
}