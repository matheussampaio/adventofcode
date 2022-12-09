const _ = require('lodash')

const { read } = require('../utils')

function countVisitedCells(input, knots = 2) {
  const movements = input.trim()
    .split('\n')
    .map(line => line.split(' '))

  const bridge = new Bridge(knots)

  for (let [direction, times] of movements) {
    times = parseInt(times, 10)

    for (let i = 0; i < times; i++) {
      bridge.moveRope(direction)
    }
  }

  return bridge.countVisited()
}

class Bridge {
  constructor(knots = 2) {
    this.visited = {
      "0,0": true
    }

    this.knots = _.range(knots).map(n => [0, 0])
  }

  isKnotsToFar(tail, head) {
    let [hx, hy] = this.knots[head]
    let [tx, ty] = this.knots[tail]

    return Math.abs(hx - tx) >= 2 || Math.abs(hy - ty) >= 2
  }

  moveKnotsCloser(tail, head) {
    let [hx, hy] = this.knots[head]
    let [tx, ty] = this.knots[tail]

    if (hx > tx) {
      tx += 1
    } else if (hx < tx) {
      tx -= 1
    }

    if (hy > ty) {
      ty += 1
    } else if (hy < ty) {
      ty -= 1
    }

    this.knots[tail] = [tx, ty]
  }

  moveRope(direction) {
    let knot = this.knots.length - 1
    let [x, y] = this.knots[knot]

    if (direction === 'R') {
      x += 1
    } else if (direction === 'L') {
      x -= 1
    } else if (direction === 'U') {
      y -= 1
    } else if (direction === 'D') {
      y += 1
    }

    this.knots[knot] = [x, y]

    while (knot && this.isKnotsToFar(knot - 1, knot)) {
      this.moveKnotsCloser(knot - 1, knot)

      knot -= 1
    }

    let [tx, ty] = this.knots[0]

    this.visited[`${tx},${ty}`] = true
  }

  countVisited() {
    return Object.keys(this.visited).length
  }
}

const input = read(`${__dirname}/input.txt`)

const example = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`

console.log(countVisitedCells(example))
console.log(countVisitedCells(input))


const example2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`

console.log(countVisitedCells(example, 10))
console.log(countVisitedCells(example2, 10))
console.log(countVisitedCells(input, 10))
