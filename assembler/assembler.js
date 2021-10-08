// Import Library
const file_import = require('fs');
const export_file = require('fs');

// Test Cases
const TEXT_PATH = '../code-assembly.txt';
// const TEXT_PATH = '../assembly/combination.txt';
// const TEXT_PATH = '../assembly/factorial.txt';
// const TEXT_PATH = '../assembly/multiplication.txt';

// Array preservation
const ASSEMBLY_LINE = [];
const TEXT_INSTANCE = [];

// Dictionary
const LABEL_REF = {};
const FILL_REF = {};

// Program counter
let pc = 0;

/* Functions */
// function : read text file
function readTextFile(path) {
    const textFile = file_import.readFileSync(path, 'utf-8');

    const readLines = textFile.split(/\r?\n/);

    // split spacebar/tabs into array element -> filter out of those space elements
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

    while(index < line.length) {
        switch(ASSEMBLY_LINE[pc][index]) {
            case 'add':
                // console.log('found add');
                addBinary(ASSEMBLY_LINE[pc]);
                break;
            case 'nand':
                // console.log('found nand');
                nandBinary(ASSEMBLY_LINE[pc])
                break;
            case 'lw':
                // console.log('found lw');
                lwBinary(ASSEMBLY_LINE[pc]);
                break;
            case 'sw':
                // console.log('found sw');
                swBinary(ASSEMBLY_LINE[pc]);
                break;
            case 'beq':
                // console.log('found beq');
                beqBinary(ASSEMBLY_LINE[pc]);
                break;
            case 'jalr':
                // console.log('found jalr');
                jalrBinary(ASSEMBLY_LINE[pc]);
                break;
            case 'noop':
                // console.log('found noop');
                noopBinary(ASSEMBLY_LINE[pc]);
                break;
            case 'halt':
                // console.log('found halt');
                haltBinary(ASSEMBLY_LINE[pc]);
                break;
            case '.fill':
                // console.log('found .fill');
                fillBinary(ASSEMBLY_LINE[pc]);
                break;
        }
        index += 1;
    }
}

// function : 2's complement -> Credit : Apithep & Chanathip 
function convertExtend1Bit(value) {
    let operand = value.toString(2);
    let temp = '';
    // check each bit whether 1 or 0
    for(let i = 0; i < operand.length ; i++){
        if(operand.charAt(i) == 0) temp += 1;
        else temp += 0;
    }
    // extend bit
    if(operand.length < 16){
        for(let i = 0; i < (16 - operand.length) ; i++){
            temp = '1' + temp;
        }
    }
    //debugger
    // console.log('this is extend16 : ' + temp);
    return temp;
}

function extend3Bit(value) {
    let temp = value;
    if(value.length < 3){
        for(let i = 0; i < (3 - value.length) ; i++){
            temp = '0' + temp;
        }
    }
    // debugger
    // console.log('this is extend3 : ' + temp);
    return temp;
}

function extend16Bit(value) {
    let temp = value;
    if(value.length < 16){
        for(let i = 0; i < (16 - value.length) ; i++){
            temp = '0' + temp;
        }
    }
    //debugger
    // console.log('this is extend16 : ' + temp);
    return temp;
}

// function : check if offsetField matched with property names
function checkMatchedProps(elem){
    const validator = Object.getOwnPropertyNames(LABEL_REF);
    for(let i = 0; i < validator.length ; i++){
        if(elem == validator[i]){
            // const val = ASSEMBLY_LINE[LABEL_REF[validator[i]]][2];
            const val = LABEL_REF[validator[i]];
            if(val > pc) {
                let diff = val - pc; // diff returns amount of line that it must go
                console.log(diff);
                return extend16Bit(String(Number(diff).toString(2))); 
            } else if (val < pc) {
                let diff = pc - val;
                console.log(diff);
                return convertExtend1Bit(diff); // return as binary
            } else {
                return error;
            }
        } else {
            continue;
        }
    } 
    return extend16Bit(Number(elem).toString(2));
}

function checkMatchedPropForLoadLabel(elem){
    const validator = Object.getOwnPropertyNames(LABEL_REF);
    for(let i = 0; i < validator.length ; i++){
        if(elem == validator[i]){
            const val = LABEL_REF[validator[i]];
            // const val = LABEL_REF[validator[i]];
            return extend16Bit(String(Number(val).toString(2)));
        } else {
            continue;
        }
    } 
    return extend16Bit(String(Number(elem).toString(2)));
}


// get value of that label
function checkMatchedPropForFill(elem){
    const validator = Object.getOwnPropertyNames(LABEL_REF);
    for(let i = 0; i < validator.length ; i++){
        if(elem == validator[i]){
            if(typeof elem == Number){
                return `${val}`;
            } else {
                const val = LABEL_REF[validator[i]];
                // const val = ASSEMBLY_LINE[LABEL_REF[validator[i]]][2];
                return `${val}`;
            }
        } else {
            continue;
        }
    } 
    return `${elem}`;
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
    TEXT_INSTANCE.push(`${decimal}`);
    console.log('add as decimal : ' + decimal);

    pc += 1;
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
    TEXT_INSTANCE.push(`${decimal}`);
    console.log('nand as decimal : ' + decimal);

    pc += 1;
}

function lwBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '010';
    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let offset = trimmedCmd[trimmedCmd.length - 1];

    let offsetField = checkMatchedPropForLoadLabel(offset);

    let decimal = parseInt((opcode + regA + regB + offsetField), 2);
    TEXT_INSTANCE.push(`${decimal}`);
    console.log(opcode + regA + regB + offsetField);
    console.log('lw as decimal : '+ decimal);

    pc += 1;
}

function swBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '011';
    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let offset = trimmedCmd[trimmedCmd.length - 1];

    let offsetField = checkMatchedProps(offset);

    let decimal = parseInt((opcode + regA + regB + offsetField), 2);
    TEXT_INSTANCE.push(`${decimal}`);
    console.log('sw as decimal : '+ decimal);

    pc += 1;
}

function beqBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '100';
    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let offset = trimmedCmd[trimmedCmd.length - 1]; // no matter is number or label

    let offsetField = checkMatchedProps(offset);
    

    let decimal = parseInt((opcode + regA + regB + offsetField), 2);
    TEXT_INSTANCE.push(`${decimal}`);
    console.log(opcode + regA + regB + offsetField);
    console.log('beq as decimal : '+ decimal);

    pc += 1;
}

function jalrBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '101';
    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let notUsed = '0000000000000';

    let decimal = parseInt((opcode + regA + regB + notUsed), 2);
    TEXT_INSTANCE.push(`${decimal}`);
    console.log(decimal);

    pc += 1;
}

function haltBinary(cmd) {
    console.log(cmd);

    let opcode = '110';
    let notUsed = '0000000000000000000000';

    let decimal = parseInt((opcode + notUsed), 2);
    TEXT_INSTANCE.push(`${decimal}`);
    console.log('halt as decimal : ' + decimal);

    pc += 1;
}

function noopBinary(cmd) {
    console.log(cmd);

    let opcode = '111';
    let notUsed = '0000000000000000000000';

    let decimal = parseInt((opcode + notUsed), 2);
    TEXT_INSTANCE.push(`${decimal}`);
    console.log('noop as decimal : ' + decimal);

    pc += 1;
}

function fillBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);
    let elem = trimmedCmd[trimmedCmd.length - 1];

    let immidiate = checkMatchedPropForFill(elem);
    TEXT_INSTANCE.push(`${immidiate}`);
    console.log('fill as decimal : ' + immidiate);

    pc += 1;
}

/* Creating Text File */
function createFileTxt(){
    let file = export_file.createWriteStream('./export-maccode.txt');
    file.on('error', err => console.log(err));
    // TEXT_INSTANCE.forEach((e) => {
    //     file.write(e);
    // })
    for(let i = 0; i < TEXT_INSTANCE.length ; i++){
        file.write(TEXT_INSTANCE[i]);
        if(i < (TEXT_INSTANCE.length - 1)){
            file.write('\n');
        }
    }
    file.end();
}

/* Main procedure */
try {
    readTextFile(TEXT_PATH);
    preRead();
    while(pc < ASSEMBLY_LINE.length){
        formatChecker(ASSEMBLY_LINE[pc]);
    }
    console.log(TEXT_INSTANCE);
    createFileTxt();
}
catch(err) {
    console.log(err);
}