function convertToBinary(value) {
    let binaryStr, bitCount = 25;
    
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

function identifierBinary(cmd) {
    let converted = convertToBinary(cmd);
    switch(converted.substring(0,3)){
        case '000' :
            console.log(converted);
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
}

const arr = 5

identifierBinary(arr)