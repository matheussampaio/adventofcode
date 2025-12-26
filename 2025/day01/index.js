const { read } = require("../utils");

function main(input) {
  const angles = input
    .trim()
    .split("\n")
    .map(line => line.replace('L', '-').replace('R', '+'))
    .map(Number)

  let pos = 50
  let atZero = 0

  for (let angle of angles) {
    while (angle != 0) {
      const rotation = angle > 0 ? -1 : 1

      pos += rotation
      angle += rotation

      if (pos === -1) {
        pos = 99
      }

      if (pos === 100) {
        pos = 0
      }

      if (pos === 0) {
        atZero++
      }
    }
  }

  return atZero
}

const input = read(`${__dirname}/input.txt`);

const example = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

console.log(main(example));
console.log(main(input));
