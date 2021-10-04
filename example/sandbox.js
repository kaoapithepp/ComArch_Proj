var num = '1111111111'
function nandOps() {
    let regA = '0111';
    let regB = '0010';

    let str='';
    for(let i = 0; i < regA.length ; i++){
        if(1 == regA.charAt(i) && 1 == regB.charAt(i)){
            str += '0';
        } else {
            str += '1';
        }
    }
    console.log(parseInt(str, 2));
}

nandOps();

console.log(num.length);