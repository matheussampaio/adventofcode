const _ = require('lodash')

const { read } = require('../utils')

function topOfTheStacks(input, q2 = false) {
  const [repr, moves] = input.split('\n\n')

  const stacks = parseStacks(repr)

  const re = /move (\d+) from (\d+) to (\d+)/

  for (const move of moves.trim().split('\n')) {
    const [times, from, to] = re.exec(move).slice(1).int()

    if (q2) {
        stacks[to - 1].push(...stacks[from - 1].splice(stacks[from - 1].length - times))
    } else {
      for (let i = 0; i < times; i++) {
        stacks[to - 1].push(stacks[from - 1].pop())
      }
    }
  }

  return stacks
    .map(stack => stack.pop())
    .join('')
}

function parseStacks(repr) {
  repr = _.chain(repr)
    .split('\n')
    .reverse()
    .value()

  const stacks = {}

  for (const line of repr) {
    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char.match(/\d/)) {
        stacks[i] = []
      }

      if (char.match(/[A-Z]/)) {
        stacks[i].push(char)
      }
    }
  }

  return Object.values(stacks)
}

const input = read(`${__dirname}/input.txt`)

const example = `    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`

console.log(topOfTheStacks(example))
console.log(topOfTheStacks(input))

console.log(topOfTheStacks(example, true))
console.log(topOfTheStacks(input, true))
