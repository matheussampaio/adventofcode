const fs = require('fs')

function* Intcode(program, inputs = []) {
  const memory = loadProgram(program)

  const STOP_CODE = 99
  const ADD_CODE = 1
  const MULT_CODE = 2
  const INPUT_CODE = 3
  const OUTPUT_CODE = 4
  const JUMP_IF_TRUE = 5
  const JUMP_IF_FALSE = 6
  const LESS_THAN = 7
  const EQUALS = 8
  const ADJUST_RELATIVE_BASE = 9

  const POSITION_MODE = 0
  const IMMEDIATE_MODE = 1
  const RELATIVE_MODE = 2

  let ip = 0
  let relativeBase = 0

  while (memory[ip] !== STOP_CODE) {
    const opcode = memory[ip] % 100

    switch (opcode) {
      case ADD_CODE:
        setParam(3, getParam(1) + getParam(2))
        ip += 4
        break

      case MULT_CODE:
        setParam(3, getParam(1) * getParam(2))
        ip += 4
        break

      case INPUT_CODE:
        // console.log('ask input')
        const value = inputs.length ? inputs.shift() : yield { type: 'input' }

        setParam(1, value)

        ip += 2
        break

      case OUTPUT_CODE:
        // console.log('yield output')
        yield { data: getParam(1), type: 'output' }

        ip += 2
        break

      case JUMP_IF_TRUE:
        ip = getParam(1) !== 0 ? getParam(2) : ip + 3
        break

      case JUMP_IF_FALSE:
        ip = getParam(1) === 0 ? getParam(2) : ip + 3
        break

      case LESS_THAN:
        setParam(3, getParam(1) < getParam(2) ? 1 : 0)
        ip += 4
        break

      case EQUALS:
        setParam(3, getParam(1) === getParam(2) ? 1 : 0)
        ip += 4
        break

      case STOP_CODE:
        ip += 1
        break

      case ADJUST_RELATIVE_BASE:
        relativeBase += getParam(1)
        ip += 2
        break

      default:
        throw new Error(`Invalid OPCODE: ${opcode}`)
    }
  }

  function loadProgram(program) {
    const memory = Array(100000).fill(0)

    for (let i = 0; i < program.length; i++) {
      memory[i] = program[i]
    }

    return memory
  }

  function getParam(pos) {
    const mode = Math.floor(memory[ip] / (10 * Math.pow(10, pos)))
    const val = memory[ip + pos]

    if (mode % 10 === POSITION_MODE) {
      return memory[val]
    }

    if (mode % 10 === IMMEDIATE_MODE) {
      return val
    }

    if (mode % 10 === RELATIVE_MODE) {
      return memory[val + relativeBase]
    }

    throw new Error(`Invalid get param mode: ${mode % 10}`)
  }

  function setParam(pos, value) {
    const mode = Math.floor(memory[ip] / (10 * Math.pow(10, pos)))
    const val = memory[ip + pos]

    if (mode % 10 === POSITION_MODE) {
      memory[val] = value
    } else if (mode % 10 === RELATIVE_MODE) {
      memory[val + relativeBase] = value
    } else {
      throw new Error(`Invalid set param mode: ${mode % 10}`)
    }
  }
}

async function main(input) {
  const program = input
    .trim()
    .split(',')
    .map((str) => parseInt(str, 10))
  const intcode = Intcode(program)

  const movementHistory = []

  let str = ''
  let result

  do {
    result = intcode.next()

    if (result.value && result.value.type === 'output') {
      str += String.fromCharCode(result.value.data)
    }
  } while (!result.done)

  console.log(str)

  const lines = str.split('\n')

  let sum = 0

  for (let y = 1; y < lines.length - 1; y++) {
    for (let x = 1; x < lines[0].length - 1; x++) {
      if (
        lines[y][x] !== '#' ||
        lines[y - 1][x] !== '#' ||
        lines[y + 1][x] !== '#' ||
        lines[y][x - 1] !== '#' ||
        lines[y][x + 1] !== '#'
      ) {
        continue
      }

      sum += x * y
    }
  }

  console.log(sum, str.length)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

main(input)
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
