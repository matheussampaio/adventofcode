const _ = require('lodash')

const { read } = require('../utils')

function main(input, partTwo = false) {
  return input
    .trim()
    .split('\n\n')
    .map((block) => block.split('\n'))
    .map((grid) => {
      let total = 0

      total += findMirror(grid, partTwo) * 100

      total += findMirror(
        _.zip(...grid.map((r) => r.split(''))).map((r) => r.join('')),
        partTwo
      )

      return total
    })
    .sum()
}

function findMirror(grid, partTwo) {
  for (let i = 1; i < grid.length; i++) {
    const top = grid.slice(0, i).reverse()
    const bottom = grid.slice(i, grid.length)

    const maxSize = Math.min(top.length, bottom.length)

    top.splice(maxSize)
    bottom.splice(maxSize)

    const isMirror = partTwo ? countDifferences(top, bottom) === 1 : _.isEqual(top, bottom)

    if (isMirror) {
      return i
    }
  }

  return 0
}

function countDifferences(a, b) {
  let total = 0

  for (let y = 0; y < a.length; y++) {
    for (let x = 0; x < a[y].length; x++) {
      total += a[y][x] !== b[y][x] ? 1 : 0
    }
  }

  return total
}

const input = read(`${__dirname}/input.txt`)

const example = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`

console.log(main(example))
console.log(main(input))

console.log(main(example, true))
console.log(main(input, true))
