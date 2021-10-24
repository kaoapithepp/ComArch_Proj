let a = '            lw          0         1         five';


let arr = [];
// function : check format
function isAssemblyChecker(line) {
    let splitter = line.split(' ').filter(e => e != '');
    // let checker = line.match('add' | 'nand' | 'lw' | 'sw' | 'beq' | 'jalr' | 'noop' | 'halt' | '.fill')
    console.log(splitter[0]);
}

// function splitAndCheck(line){
//     console.log(line.split(' ').filter((e) => e != ''));
// }

// let b = 'Today is aespa comeback'
// console.log(b.split(' '));
// splitAndCheck(a);

isAssemblyChecker(a);