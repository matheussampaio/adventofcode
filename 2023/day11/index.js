const _ = require('lodash')

const { read } = require('../utils')

function main(input, age = 1) {
  const map = input.trim().split('\n')

  const rowsToExpand = map
    .map((row, i) => (row.indexOf('#') === -1 ? i : null))
    .filter((row) => row != null)
    .reverse()

  const colsToExpand = _.zip(...map.map((r) => r.split('')))
    .map((row) => row.join(''))
    .map((col, i) => (col.indexOf('#') === -1 ? i : null))
    .filter((col) => col != null)
    .reverse()

  const galaxies = []

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '#') {
        galaxies.push([x, y])
      }
    }
  }

  for (const row of rowsToExpand) {
    for (const galaxy of galaxies) {
      if (galaxy[1] > row) {
        galaxy[1] += age
      }
    }
  }

  for (const col of colsToExpand) {
    for (const galaxy of galaxies) {
      if (galaxy[0] > col) {
        galaxy[0] += age
      }
    }
  }

  let sum = 0

  for (let i = 0; i < galaxies.length; i++) {
    for (let k = i + 1; k < galaxies.length; k++) {
      const a = galaxies[i]
      const b = galaxies[k]

      sum += Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])
    }
  }

  return sum
}

const input = read(`${__dirname}/input.txt`)

const example = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`

console.log(main(example))
console.log(main(input))

console.log(main(example, 999999))
console.log(main(input, 999999))
