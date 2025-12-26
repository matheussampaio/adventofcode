const { read } = require("../utils");
const _ = require('lodash')

function main(input) {
  const grid = input.toGrid()

  const start = grid.find(cell => cell.value === 'S')
  start.value = 1

  const queue = [start]

  while (queue.length) {
    const cell = queue.shift()

    const below = grid.get(cell.x, cell.y + 1)

    if (below == null) {
      continue
    }

    if (below.value === '.') {
      below.value = cell.value
      queue.push(below)
    } else if (below.value === '^') {
      const left = grid.get(below.x - 1, below.y)

      if (left && left.value !== '^') {
        if (left.value === '.') {
          queue.push(left)
        }

        left.value = left.value === '.' ? cell.value : left.value + cell.value
      }

      const right = grid.get(below.x + 1, below.y)

      if (right && right.value !== '^') {
        if (right.value === '.') {
          queue.push(right)
        }

        right.value = right.value === '.' ? cell.value : right.value + cell.value
      }

      continue
    } else {
      below.value += cell.value
    }
  }

  return grid.rows[grid.rows.length - 1].filter(cell => cell.value !== '.').map(cell => cell.value).sum()
}

const input = read(`${__dirname}/input.txt`);

const example = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`

console.log(main(example));
console.log(main(input));
