const fs = require('fs')

class Map {
  constructor() {
    this.matrix = []

    this.x = 0
    this.y = 0
  }

  mark(x1, y1, x2, y2) {
    this.resizeX(Math.max(x1, x2) + 1)
    this.resizeY(Math.max(y1, y2) + 1)

    if (x1 != x2 && y1 != y2) {
      return this.markDiagonal(x1, y1, x2, y2)
    }

    if (x1 > x2) {
      ;[x1, x2] = [x2, x1]
    }

    if (y1 > y2) {
      ;[y1, y2] = [y2, y1]
    }

    this.markHorizontalOrVertical(x1, y1, x2, y2)
  }

  markDiagonal(x1, y1, x2, y2) {
    while (x1 != x2 && y1 != y2) {
      this.matrix[y1][x1] += 1

      x1 += x1 >= x2 ? -1 : 1
      y1 += y1 >= y2 ? -1 : 1
    }

    this.matrix[y1][x1] += 1
  }

  markHorizontalOrVertical(x1, y1, x2, y2) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        this.matrix[y][x] += 1
      }
    }
  }

  resizeX(newSize) {
    if (this.x >= newSize) {
      return
    }

    for (let y = 0; y < this.y; y++) {
      for (let i = this.x; i < newSize; i++) {
        this.matrix[y].push(0)
      }
    }

    this.x = newSize
  }

  resizeY(newSize) {
    if (this.y >= newSize) {
      return
    }

    for (let i = this.y; i < newSize; i++) {
      this.matrix.push(Array(this.x).fill(0))
    }

    this.y = newSize
  }

  getOverlapsCounts() {
    return this.matrix.flat().reduce((sum, curr) => sum + (curr > 1 ? 1 : 0), 0)
  }

  toString() {
    let str = ''

    for (let y = 0; y < this.y; y++) {
      for (let x = 0; x < this.x; x++) {
        if (this.matrix[y][x] === 0) {
          str += '.'
        } else {
          str += this.matrix[y][x]
        }
      }

      str += '\n'
    }

    return str
  }
}

function numberOfPoints(input) {
  const lines = input.trim().split('\n')

  const map = new Map()

  for (const line of lines) {
    const [x1, y1, x2, y2] = line
      .split(' -> ')
      .map((coord) => coord.split(',').map((n) => parseInt(n, 10)))
      .flat()

    map.mark(x1, y1, x2, y2)

    console.log(map.toString())
  }

  // console.log(map.toString())
  console.log(map.getOverlapsCounts())
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`

console.log(numberOfPoints(example))
// console.log(numberOfPoints(input))
