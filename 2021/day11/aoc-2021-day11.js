const fs = require('fs')

class OctopusGrid {
  constructor(matrix) {
    this.matrix = matrix
  }

  step() {
    const charged = []

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        this.matrix[y][x]++

        if (this.matrix[y][x] > 9) {
          charged.push({ x, y })
        }
      }
    }

    const flashed = {}

    while (charged.length) {
      const { x, y } = charged.shift()
      const key = `${x},${y}`

      if (flashed[key]) {
        continue
      }

      flashed[key] = { x, y }

      for (let dy = -1; dy <= 1; dy++) {
        if (y + dy < 0 || y + dy >= 10) {
          continue
        }

        for (let dx = -1; dx <= 1; dx++) {
          if (x + dx < 0 || x + dx >= 10) {
            continue
          }

          this.matrix[y + dy][x + dx]++

          if (this.matrix[y + dy][x + dx] > 9) {
            charged.push({ x: x + dx, y: y + dy })
          }
        }
      }
    }

    for (let octopus of Object.values(flashed)) {
      this.matrix[octopus.y][octopus.x] = 0
    }

    return Object.keys(flashed).length
  }

  toString() {
    return this.matrix.map((row) => row.join()).join('\n')
  }
}

function xyz(input) {
  const matrix = input
    .trim()
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split('')
        .map((n) => parseInt(n, 10))
    )

  const octopusGrid = new OctopusGrid(matrix)

  let totalFlashesAfter100Steps = 0
  let steps = 0
  let flashesThisStep = 0

  do {
    steps += 1
    totalFlashesAfter100Steps += flashesThisStep = octopusGrid.step()

    if (steps === 100) {
      console.info('Total flashes after 100 steps', totalFlashesAfter100Steps)
    }
  } while (flashesThisStep !== 100)

  console.info('Sync after', steps)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`

xyz(example)
xyz(input)
