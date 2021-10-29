// Import Library
const file_import = require('fs');
const export_file = require('fs');

// Test Cases
// const TEXT_PATH = '../code-assembly.txt';
const TEXT_PATH = '../assembly/factorial.txt';
// const TEXT_PATH = '../assembly/combine.txt';
// const TEXT_PATH = '../assembly/multiplication.txt';
// const TEXT_PATH = '../assembly/multiplication-up.txt';
// const TEXT_PATH = '../assembly/combination-up.txt';

// Array preservation
const ASSEMBLY_LINE = []; // for storing assembly command
const TEXT_INSTANCE = [];

// Dictionary
const LABEL_REF = {};

// Program counter
let pc = 0;


// Termintor
let terminator = 0;

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
    console.log(LABEL_REF); // print label name with line number
}


// function : recognize that line's label and value
function recogLabel(value, line) {
    checkRedundantLabel(value);
    LABEL_REF[value] = line;
}

// function : check using undefined label
function checkUndefinedLabel(keyword) {
    let exit = 0
    if(keyword == Number(keyword)){
        return keyword;
    }
    else {
        let labels = Object.keys(LABEL_REF);
        for(let i = 0; i < labels.length || exit != 1; i++){
            if(keyword == labels[i]){
                return keyword;
            } else if (keyword != labels[i] && i == labels.length-1) {
                exit = 1;
                terminator = 1;
                throw 'Error : Undefined label';
            }
        }
    }
}

// function : check redundant label
function checkRedundantLabel(keyword) {
    let exit = 0
    for(let i = 0; i < Object.keys(LABEL_REF).length && exit != 1; i++){
        if(Object.keys(LABEL_REF)[i] == keyword){
            exit = 1;
            terminator = 1;
            throw 'Error : Redundant label';
        }
    }
}

//function : CheckError; Check Label is underfine,Check the same Label ,OffsetField
function CheckLeak16bitOffset(offset) {
    if(offset < -65536 || offset > 65535){
        terminator = 1;
        throw 'Error : Exceed offset';
    }
}

//function : Check Opcode;Check Opcode that underfined and Check correct of Opcode 
function CheckOpcode(opcode){
    if( opcode != '000' &&
        opcode != '001' &&
        opcode != '010' &&
        opcode != '011' &&
        opcode != '100' &&
        opcode != '101' &&
        opcode != '110' &&
        opcode != '111'){
            terminator = 1;
            throw 'Error : Wrong opcode usage';
        }
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

// function : 2's complement -> Credit : Brandon Sarà 
function convertExtend1Bit(value) {
    let binaryStr, bitCount = 16;
    
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

// function : extend unsigned 3 bit
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

// function : extend unsigned 16 bit
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

// get line's NUMBER which has the matched command
function checkMatchedPropForLoad(elem){
    const validator = Object.getOwnPropertyNames(LABEL_REF);
    for(let i = 0; i < validator.length ; i++){
        if(elem == validator[i]){
            const val = LABEL_REF[validator[i]];
            return extend16Bit(String(Number(val).toString(2)));
        } else {
            continue;
        }
    } 
    return extend16Bit(String(Number(elem).toString(2)));
}


// get THE VALUE within that label FOR DISPLAY .FILL ONLY
function checkMatchedPropForFill(elem){
    const validator = Object.getOwnPropertyNames(LABEL_REF);
    for(let i = 0; i < validator.length ; i++){
        if(elem == validator[i]){
            if(typeof elem == Number){
                return `${val}`; // if .fill is imm -> return as that value as number
            } else {
                const val = LABEL_REF[validator[i]]; // we got line's num which has this label
                return `${val}`;
            }
        } else {
            continue;
        }
    } 
    return `${elem}`;
}

// get line's number from the matched label, check with pc by conditions and return extended binary
function getLineNumFromLabel(elem){

    if(elem == Number(elem)){
        return extend16Bit(Number(elem).toString(2));
    } else if (String(elem) == 'halt'){
        return haltBinary(elem);
    } else {
        const validator = Object.getOwnPropertyNames(LABEL_REF); // array of label name
        for(let i = 0; i < validator.length ; i++){
            if(elem == validator[i]){
                const lineNum =  checkMatchedPropForFill(validator[i]); // get THE VALUE within that label (line number)

                // debugger
                // console.log('lineNum : ' + lineNum);
                // console.log('pc : ' + pc);
                if(lineNum > pc) {
                    let diff = (Number(lineNum) - 1) - pc;
                    // debugger
                    // console.log('diff : ' + diff);
                    // console.log('pc after diff : ' + pc);
                    return extend16Bit(Number(diff).toString(2));
                } else if (lineNum < pc){
                    let diff = pc - Number(lineNum);
                    // debugger
                    // console.log('diff : ' + diff);
                    // console.log('pc after diff : ' + pc);
                    // console.log(Number(~diff));
                    return convertExtend1Bit(Number(~diff));
                } else {
                    return error;
                }
            } else {
                continue;
            }
        } 
    } 
}

/* functions : translate add command to bin */
function addBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '000';

    CheckOpcode(opcode);

    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let notUsed = '0000000000000';
    let destReg = extend3Bit(Number(trimmedCmd[trimmedCmd.length - 1]).toString(2));

    let decimal = parseInt((opcode + regA + regB + notUsed + destReg), 2);
    TEXT_INSTANCE.push(`${decimal}`);

    // print
    console.log(opcode + regA + regB + notUsed + destReg);
    console.log('add as decimal : ' + decimal);

    pc += 1;
}

function nandBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '001';

    CheckOpcode(opcode);

    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let notUsed = '0000000000000';
    let destReg = extend3Bit(Number(trimmedCmd[trimmedCmd.length - 1]).toString(2));

    let decimal = parseInt((opcode + regA + regB + notUsed + destReg), 2);
    TEXT_INSTANCE.push(`${decimal}`);

    // print
    console.log(opcode + regA + regB + notUsed + destReg);
    console.log('nand as decimal : ' + decimal);

    pc += 1;
}

function lwBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '010';

    CheckOpcode(opcode);

    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let offset = trimmedCmd[trimmedCmd.length - 1];

    checkUndefinedLabel(offset);

    let offsetField = checkMatchedPropForLoad(offset);

    CheckLeak16bitOffset(parseInt(offsetField, 2));

    let decimal = parseInt((opcode + regA + regB + offsetField), 2);
    TEXT_INSTANCE.push(`${decimal}`);

    // print
    console.log(opcode + regA + regB + offsetField);
    console.log('lw as decimal : '+ decimal);

    pc += 1;
}

function swBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '011';

    CheckOpcode(opcode);

    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let offset = trimmedCmd[trimmedCmd.length - 1];

    checkUndefinedLabel(offset);

    let offsetField = checkMatchedPropForLoad(offset);

    CheckLeak16bitOffset(parseInt(offsetField, 2));

    let decimal = parseInt((opcode + regA + regB + offsetField), 2);
    TEXT_INSTANCE.push(`${decimal}`);

    // print
    console.log(opcode + regA + regB + offsetField);
    console.log('sw as decimal : '+ decimal);

    pc += 1;
}

function beqBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '100';

    CheckOpcode(opcode);

    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let offset = trimmedCmd[trimmedCmd.length - 1]; // no matter is number or label
    
    checkUndefinedLabel(offset);
    
    let offsetField = getLineNumFromLabel(offset);

    CheckLeak16bitOffset(parseInt(offsetField, 2));

    let decimal = parseInt((opcode + regA + regB + offsetField), 2);
    TEXT_INSTANCE.push(`${decimal}`);

    // print
    console.log(opcode + regA + regB + offsetField);
    console.log('beq as decimal : '+ decimal);

    pc += 1;
}

function jalrBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);

    let opcode = '101';

    CheckOpcode(opcode);

    let regA = extend3Bit(Number(trimmedCmd[1]).toString(2));
    let regB = extend3Bit(Number(trimmedCmd[2]).toString(2));
    let notUsed = '0000000000000000';
    let decimal = parseInt((opcode + regA + regB + notUsed), 2);
    TEXT_INSTANCE.push(`${decimal}`);

    // print
    console.log(opcode + regA + regB + notUsed);
    console.log('jalr as decimal : ' + decimal);

    pc += 1;
}

function haltBinary(cmd) {
    console.log(cmd);

    let opcode = '110';

    CheckOpcode(opcode);

    let notUsed = '0000000000000000000000';

    let decimal = parseInt((opcode + notUsed), 2);
    TEXT_INSTANCE.push(`${decimal}`);

    // print
    console.log(opcode + notUsed);
    console.log('halt as decimal : ' + decimal);

    pc += 1;
}

function noopBinary(cmd) {
    console.log(cmd);

    let opcode = '111';

    CheckOpcode(opcode);

    let notUsed = '0000000000000000000000';

    let decimal = parseInt((opcode + notUsed), 2);
    TEXT_INSTANCE.push(`${decimal}`);

    // print
    console.log(opcode + notUsed);
    console.log('noop as decimal : ' + decimal);

    pc += 1;
}

function fillBinary(cmd) {
    console.log(cmd);

    let trimmedCmd = checkForTrim(cmd);
    let elem = trimmedCmd[trimmedCmd.length - 1];

    let immidiate = checkMatchedPropForFill(elem);
    TEXT_INSTANCE.push(`${immidiate}`);

    // print
    // console.log(immidiate);
    console.log('fill as decimal : ' + immidiate);

    // let immidiate = checkMatchedPropForFill(cmd);
    // TEXT_INSTANCE.push(`${immidiate}`);
    // console.log('fill as decimal : ' + immidiate);

    pc += 1;
}

/* Creating Text File */
function createFileTxt(content){
    let file = export_file.createWriteStream('./export-maccode.txt');
    file.on('error', err => console.log(err));

    for(let i = 0; i < content.length ; i++){
        file.write(content[i]);
        if(i < (content.length - 1)){
            file.write('\n');
        }
    }

    file.end();
}

/* Main procedure */
try {
    readTextFile(TEXT_PATH);
    preRead();
    while(pc < ASSEMBLY_LINE.length && terminator != 1){
        formatChecker(ASSEMBLY_LINE[pc]);
    }
    console.log(TEXT_INSTANCE);
    createFileTxt(TEXT_INSTANCE);
}
catch(err) {
    console.log(err);
}