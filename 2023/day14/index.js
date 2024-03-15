const _ = require('lodash')

const { read } = require('../utils')

function main(input, partTwo = false) {
  const grid = new Grid(input)

  if (!partTwo) {
    grid.north();
    return grid.load()
  }

  const cache = {}
  const CYCLES = 1000000000

  for (let i = 1; i <= CYCLES; i++) {
    grid.cycle()

    const fingerprint = grid.toString()

    if (cache[fingerprint] == null) {
      cache[fingerprint] = []
    }

    cache[fingerprint].push(i)

    if (cache[fingerprint].length > 0) {
      const at = cache[fingerprint]

      const cycleLength = at[at.length - 1] - at[at.length - 2]

      if ((CYCLES - i) % cycleLength === 0) {
        console.log(cache[fingerprint])
        console.log({ load: grid.load(), i })

        break
      }
    }
  }

  return grid.load()
}

class Grid {
  constructor(input) {
    this.grid = input.trim().split('\n').map(line => line.split(''))
  }

  cycle() {
    this.north()
    this.west()
    this.south()
    this.east()
  }

  north() {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === 'O') {
          let newY = y

          while (newY >= 1 && this.grid[newY - 1][x] === '.') {
            newY -= 1
          }

          this.grid[y][x] = '.'
          this.grid[newY][x] = 'O'
        }
      }
    }
  }

  east() {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = this.grid.length - 1; x >= 0; x--) {
        if (this.grid[y][x] === 'O') {
          let newX = x

          while (newX < this.grid.length && this.grid[y][newX + 1] === '.') {
            newX += 1
          }

          this.grid[y][x] = '.'
          this.grid[y][newX] = 'O'
        }
      }
    }
  }

  south() {
    for (let y = this.grid.length - 1; y >= 0; y--) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === 'O') {
          let newY = y

          while (newY < this.grid.length - 1 && this.grid[newY + 1][x] === '.') {
            newY += 1
          }

          this.grid[y][x] = '.'
          this.grid[newY][x] = 'O'
        }
      }
    }
  }

  west() {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === 'O') {
          let newX = x

          while (newX >= 1 && this.grid[y][newX - 1] === '.') {
            newX -= 1
          }

          this.grid[y][x] = '.'
          this.grid[y][newX] = 'O'
        }
      }
    }
  }

  load() {
    let load = 0

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === 'O') {
          load += this.grid.length - y
        }
      }
    }

    return load
  }

  toString() {
    return this.grid.map(arr => arr.join('')).join('\n')
  }
}

const input = read(`${__dirname}/input.txt`)

const example = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`

console.log(main(example))
console.log(main(input))

console.log(main(example, true))
console.log(main(input, true))
