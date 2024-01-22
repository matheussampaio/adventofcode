const _ = require('lodash')

const { read } = require('../utils')

function main(input, partTwo = false) {
  const [rawInstructions, rawNetwork] = input
    .trim()
    .split('\n\n')

  const instructions = rawInstructions.split('')
  const network = {}

  for (const line of rawNetwork.split('\n')) {
    const [from, left, right] = line.match(/[0-9A-Z]{3}/g)

    network[from] = [left, right]
  }

  const steps = _.chain(network)
    .keys()
    .filter(node => partTwo ? node[2] === 'A' : node === 'AAA')
    .map(node => getMinSteps(node, instructions, network, partTwo))
    .reduce((a, b) => Math.abs(a * b) / gcd(a, b), 1)
    .value()

  return steps
}

function getMinSteps(node, instructions, network, partTwo) {
  let steps = 0
  let at = node

  while (partTwo ? at[2] !== 'Z' : at !== 'ZZZ') {
    const move = instructions[steps % instructions.length]

    at = network[at][move === 'L' ? 0 : 1]

    steps += 1
  }

  return steps
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b)
}

const input = read(`${__dirname}/input.txt`)

const example = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ`

console.log(main(example))
console.log(main(input))

const example2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

console.log(main(example2, true))
console.log(main(input, true))
