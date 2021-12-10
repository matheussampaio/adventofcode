const fs = require('fs')
const _ = require('lodash')

function xyz(input) {
  const matrix = input
    .trim()
    .split('\n')
    .map((l) => l.split('').map((n) => parseInt(n, 10)))

  const lows = []

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      const neighboors = []

      let hasLow = false

      for (let dy = -1; dy <= 1; dy++) {
        if (y + dy < 0 || y + dy >= matrix.length) {
          continue
        }

        for (let dx = -1; dx <= 1; dx++) {
          if (x + dx < 0 || x + dx >= matrix[0].length) {
            continue
          }

          if (matrix[y][x] > matrix[y + dy][x + dx]) {
            hasLow = true
          }
        }
      }

      if (!hasLow) {
        lows.push({ x, y, n: matrix[y][x] })
      }
    }
  }

  console.log(
    'Part 1:',
    lows.reduce((sum, l) => sum + l.n + 1, 0)
  )

  const basins = []

  for (let coord of lows) {
    const size = flood(matrix, coord.x, coord.y)

    basins.push({ size })
  }

  basins.sort((b1, b2) => b2.size - b1.size)

  console.log(
    'Part 2:',
    basins.slice(0, 3).reduce((sum, b) => sum * b.size, 1)
  )
}

function flood(matrix, x, y) {
  const queue = [{ x, y }]
  const visited = { [`${x},${y}`]: true }

  let size = 0

  const coords = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ]

  while (queue.length) {
    const { x, y } = queue.shift()

    size += 1

    for (const [dx, dy] of coords) {
      if (y + dy < 0 || y + dy >= matrix.length) {
        continue
      }

      if (x + dx < 0 || x + dx >= matrix[0].length) {
        continue
      }

      if (matrix[y + dy][x + dx] >= 9) {
        continue
      }

      if (visited[`${x + dx},${y + dy}`]) {
        continue
      }

      if (matrix[y][x] < matrix[y + dy][x + dx]) {
        queue.push({ x: x + dx, y: y + dy })
        visited[`${x + dx},${y + dy}`] = true
      }
    }
  }

  return size
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `2199943210
3987894921
9856789892
8767896789
9899965678`

console.log(xyz(example))
console.log(xyz(input))
