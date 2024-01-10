const _ = require('lodash')

const { read } = require('../utils')

class Projection {
  constructor() {
    this.dp = []
  }

  get(time) {
    if (this.dp[time] == null) {
      this.dp[time] = []

      for (let h = 0; h <= time; h++) {
        this.dp[time].push((time - h) * h)
      }
    }

    return this.dp[time]
  }
}

const p = new Projection()

function main(input, partTwo = false) {
  let rows = input
    .trim()
    .split('\n')
    .map(row => row.match(/\d+/g))

  if (partTwo) {
    rows = rows.map(row => [row.reduce((n, str) => n + str, '').int()])
  }

  const pairs = []

  for (let i = 0; i < rows[0].length; i++) {
    pairs.push({
      time: rows[0][i],
      distance: rows[1][i]
    })
  }

  const result = pairs.reduce((n, pair) => n * p.get(pair.time).filter(n => n > pair.distance).length, 1)

  return result
}

const input = read(`${__dirname}/input.txt`)

const example = `Time:      7  15   30
Distance:  9  40  200`

console.log(main(example))
console.log(main(input))

console.log(main(example, true))
console.log(main(input, true))
