const _ = require('lodash')

const { read } = require('../utils')

function countVisitedCells(input) {

  const instructions = input.trim().split('\n')

  let signalStrength = 0
  let cycle = 0
  let X = 1

  // start crt with 240 pixels, all black.
  const crt = Array.from({ length: 240 }, () => '.')

  while (instructions.length) {
    cycle += 1

    // update crt
    const pos = cycle - 1
    crt[pos % crt.length] = pos % 40 >= X - 1 && pos % 40 <= X + 1 ? '#' : '.'

    // calculate signal strength every once in a while
    if ((cycle + 20) % 40 === 0) {
      signalStrength += cycle * X
    }

    // process instructions
    const instruction = instructions[0]

    if (instruction.startsWith('addx')) {
      const [_, value] = instruction.split(' ')

      instructions[0] = `addn ${value}`

    } else if (instruction.startsWith('addn')) {
      const [_, value] = instruction.split(' ')

      X += parseInt(value, 10)
      instructions.shift()

    } else if (instruction.startsWith('noop')) {
      instructions.shift()
    }
  }

  // print crt at the end
  console.log(_.chunk(crt, 40).map(line => line.join('')).join('\n'))

  return signalStrength
}

const input = read(`${__dirname}/input.txt`)

const example = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`

console.log(countVisitedCells(example))
console.log(countVisitedCells(input))
