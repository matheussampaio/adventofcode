const { read } = require("../utils");

function main(input, partTwo = false) {
  const grid = input.toGrid()

  let cells
  let count = 0

  do {
    cells = grid.filter(c => c.value === '@' && c.neighbors.filter(c => c.value === '@').length < 4).map(c => c.value = '.')
    count += cells.length
  } while (cells.length > 0 && partTwo)

  return count
}

const input = read(`${__dirname}/input.txt`);

const example = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

console.log(main(example));
console.log(main(input));

console.log(main(example, true));
console.log(main(input, true));
