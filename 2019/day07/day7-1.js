const fs = require('fs')

function Intcode(memory, input = [], output = console.log) {
  const STOP_CODE = 99
  const ADD_CODE = 1
  const MULT_CODE = 2
  const INPUT_CODE = 3
  const OUTPUT_CODE = 4
  const JUMP_IF_TRUE = 5
  const JUMP_IF_FALSE = 6
  const LESS_THAN = 7
  const EQUALS = 8

  const POSITION_MODE = 0
  const IMMEDIATE_MODE = 1

  let ip = 0

  while (memory[ip] !== STOP_CODE) {
    const opcode = memory[ip] % 100

    const pos1 = memory[ip + 1]
    const pos2 = memory[ip + 2]
    const pos3 = memory[ip + 3]

    const mode1 = Math.floor(memory[ip] / 100) % 10
    const mode2 = Math.floor(memory[ip] / 1000) % 10

    const param1 = mode1 === IMMEDIATE_MODE ? pos1 : memory[pos1]
    const param2 = mode2 === IMMEDIATE_MODE ? pos2 : memory[pos2]

    switch (opcode) {
      case ADD_CODE:
        memory[pos3] = param1 + param2
        ip += 4
        break

      case MULT_CODE:
        memory[pos3] = param1 * param2
        ip += 4
        break

      case INPUT_CODE:
        memory[pos1] = input.shift()
        ip += 2
        break

      case OUTPUT_CODE:
        output(param1)
        ip += 2
        break

      case JUMP_IF_TRUE:
        ip = param1 !== 0 ? param2 : ip + 3
        break

      case JUMP_IF_FALSE:
        ip = param1 === 0 ? param2 : ip + 3
        break

      case LESS_THAN:
        memory[pos3] = param1 < param2 ? 1 : 0
        ip += 4
        break

      case EQUALS:
        memory[pos3] = param1 === param2 ? 1 : 0
        ip += 4
        break

      case STOP_CODE:
        ip += 1
        return

      default:
        throw new Error(`Invalid OPCODE: ${opcode}`)
    }
  }

  // return memory
}

async function getThrustSignal(signals, program) {
  const [sA, sB, sC, sD, sE] = signals

  const outputA = await new Promise((resolve) => Intcode(program.slice(), [sA, 0], resolve))
  const outputB = await new Promise((resolve) => Intcode(program.slice(), [sB, outputA], resolve))
  const outputC = await new Promise((resolve) => Intcode(program.slice(), [sC, outputB], resolve))
  const outputD = await new Promise((resolve) => Intcode(program.slice(), [sD, outputC], resolve))
  const outputE = await new Promise((resolve) => Intcode(program.slice(), [sE, outputD], resolve))

  return outputE
}

function permutation(array) {
  function p(array, temp) {
    var i, x
    if (!array.length) {
      result.push(temp)
    }
    for (i = 0; i < array.length; i++) {
      x = array.splice(i, 1)[0]
      p(array, temp.concat(x))
      array.splice(i, 0, x)
    }
  }

  var result = []
  p(array, [])
  return result
}

async function main(input) {
  const program = input
    .trim()
    .split(',')
    .map((str) => parseInt(str, 10))

  const allSignalsPerms = permutation([0, 1, 2, 3, 4])

  let max = Number.MIN_VALUE

  for (const perm of allSignalsPerms) {
    const thrustSignal = await getThrustSignal(perm, program)

    if (thrustSignal > max) {
      max = thrustSignal
    }
  }

  console.log(max)

  return max
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(main(input))
