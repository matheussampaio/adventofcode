const _ = require('lodash')

const { read } = require('../utils')

function calc(input, q2 = false) {
  const grid = Array(200).fill().map(() => Array(750).fill(' '))

  for (const line of input.trim().split('\n')) {
    const coords = line.split(' -> ')

    for (let i = 1; i < coords.length; i++) {
      const [x1, y1] = coords[i - 1].split(',').int()
      const [x2, y2] = coords[i].split(',').int()

      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
          grid[y][x] = '#'
        }
      }
    }
  }

  // add a horizontal line at the bottom of the grid if Q2
  if (q2) {
    const maxY = _.findLastIndex(grid, el => el.indexOf('#') !== -1)

    for (let x = 0; x < grid[maxY + 2].length; x++) {
      grid[maxY + 2][x] = '#'
    }
  }

  let units = 0

  while (sand(grid)) {
    units++
  }

  return units
}

function sand(grid) {
  let [x, y] = [500, 0]

  // is source blocked
  if (grid[y][x] === 'o') {
    return false
  }

  while (y + 1 < grid.length) {
    // can go south
    if (grid[y + 1][x] === ' ') {
      y += 1

    // can go south-west
    } else if (grid[y + 1][x - 1] === ' ') {
      y += 1
      x -= 1

    // can go south-east
    } else if (grid[y + 1][x + 1] === ' ') {
      y += 1
      x += 1

    // rest
    } else {
      grid[y][x] = 'o'
      return true
    }
  }

  // into void
  return false
}

const input = read(`${__dirname}/input.txt`)

const example = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`

console.log(calc(example))
console.log(calc(input))

console.log(calc(example, true))
console.log(calc(input, true))
