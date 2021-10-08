function checkTwoComplimentOffset(value) {
    let sqrtNum = Math.pow(2, value.length) - 1;
    if(value.substr(0,1) ==  1){
        const packed = sqrtNum - parseInt(value, 2);
        return `${~packed}`;
    } else {
        const same = parseInt(value, 2);
        return `${same}`;
    }
}

console.log(checkTwoComplimentOffset('11101'));