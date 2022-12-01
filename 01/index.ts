const fs = require("fs");
const { EOL } = require("os");

try {
    var data = fs.readFileSync("input", "utf8");
    data = data.split(EOL);
  } catch (err) {
    console.error(err);
  }

var index = 0;
var munged = data.reduce((a: number[], c: string) => {
    if (c.length == 0){
        index = index + 1
        a[index] = 0
        return a
    }

    a[index] = a[index] + parseInt(c)
    return a

}, [0])

munged.sort().reverse()

const answer = munged[0] + munged[1] + munged[2]

console.log(answer)