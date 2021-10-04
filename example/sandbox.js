a = '1111111111111111'

function checkTwoComplimentOffset(value) {
    if(value.substr(0,1) ==  1){
        const packed = 65535 - parseInt(value, 2);
        return `${~packed}`;
    } else {
        const same = parseInt(value, 2)
        return `${same}`;
    }
 }

console.log(parseInt(a, 2));
console.log(checkTwoComplimentOffset(a));