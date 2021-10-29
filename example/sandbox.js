let label = {
    loop1: 5,
    loop2: 9,
    end: 16,
    mcand: 17,
    mplier: 18,
    pos1: 19,
    neg1: 20,
    exit: 21
}

// function checkRedundantLabel(obj) {
//     // for(let i = 0,)
//     // terminator = 1;
// }

let exit = 0;

function checkRedundantLabel(keyword) {
    let i = 0;
    while(exit != 1) {
        if(Object.keys(label)[i] === keyword){
            exit = 1;
            console.log('error!');
        }
        i++;
    }
    console.log('completed!');
}

checkRedundantLabel('end')

// console.log(Object.keys(label)[1]);