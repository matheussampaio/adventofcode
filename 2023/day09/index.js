const _ = require('lodash')

const { read } = require('../utils')

function main(input, partTwo = false) {
  const seqs = input
    .split('\n')
    .map(line => line.split(' ').int())
    .map(history => predict(history, partTwo))
    .sum()

  return seqs
}

function predict(history, partTwo) {
  if (history.length <= 1) {
    return 0
  }

  const diff = []

  for (let i = 0; i < history.length - 1; i++) {
    diff.push(history[i + 1] - history[i])
  }

  if (partTwo) {
    return history[0] - predict(diff, partTwo)
  }

  return history[history.length - 1] + predict(diff, partTwo)
}

const input = read(`${__dirname}/input.txt`)

const example = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

console.log(main(example))
console.log(main(input))

console.log(main(example, true))
console.log(main(input, true))
