const _ = require('lodash')

const { read } = require('../utils')

function calc1(input, target) {
  const position = new Set()

  const squares = parse(input)

  for (const square of squares) {
    const distToTarget = distance(square.x, square.y, square.x, target)

    if (distToTarget <= square.distance) {
      const diff = square.distance - distToTarget

      for (let dx = square.x - diff; dx < square.x + diff; dx++) {
        position.add(dx)
      }
    }
  }

  return position.size
}

function calc2(input, searchArea) {
  const squares = parse(input)

  for (let y = 0; y <= searchArea; y++) {
    const ranges = squares
      .filter(s => Math.abs(y - s.y) < s.distance)
      .map(s => {
        let dy = Math.abs(y - s.y)

        return [s.x - (s.distance - dy), s.x + (s.distance - dy)]
      })
      .sort((r1, r2) => r1[0] - r2[0])

    const x = findUncoveredColumn(ranges, searchArea)

    if (x != null) {
      return x * 4_000_000 + y
    }
  }
}

function parse(input) {
  return input.trim().split('\n').map(line => {
    const [sx, sy, bx, by] = line.match(/x=(-?\d+).*y=(-?\d+).*x=(-?\d+).*y=(-?\d+)/)
      .slice(1, 5)
      .int()

    return {
      x: sx,
      y: sy,
      distance: distance(sx, sy, bx, by),
    }
  })
}

function findUncoveredColumn(ranges, searchArea) {
  let [_, end] = ranges[0];

  for (let i = 1; i < ranges.length && end < searchArea; i++) {
    const [range_start, range_end] = ranges[i]

    if (range_start > end) {
      return range_start - 1

    } else if (range_end > end) {
      end = range_end;
    }
  }
}

function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

const input = read(`${__dirname}/input.txt`)

const example = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`

console.log(calc1(example, 10))
console.log(calc1(input, 2000000))

console.log(calc2(example, 20))
console.log(calc2(input, 4_000_000))
