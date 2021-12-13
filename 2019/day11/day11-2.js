const fs = require('fs')

function* Intcode(program) {
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
        const color = yield

        setParam(1, color)

        ip += 2
        break

      case OUTPUT_CODE:
        // console.log('yield output')
        yield getParam(1)

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
        return

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

const NORTH = 1
const EAST = 2
const SOUTH = 3
const WEST = 4

const COLOR_WHITE = {
  VALUE: 1,
  REPR: '█'
}

const COLOR_BLACK = {
  VALUE: 0,
  REPR: ' '
}

const TURN = {
  LEFT: 0,
  RIGHT: 1
}

class Hull {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.hull = []

    for (let y = 0; y < height; y++) {
      const row = []

      for (let x = 0; x < width; x++) {
        row.push(COLOR_BLACK.VALUE)
      }

      this.hull.push(row)
    }

    this.robotPosition = {
      x: 2,
      y: 2
    }
    this.robotFacing = NORTH
    this.setCurrentColor(COLOR_WHITE.VALUE)
  }

  getCurrentColor() {
    const { x, y } = this.robotPosition

    return this.hull[y][x]
  }

  setCurrentColor(value) {
    const { x, y } = this.robotPosition

    this.hull[y][x] = value
  }

  turnLeft() {
    this.robotFacing -= 1

    if (this.robotFacing < NORTH) {
      this.robotFacing = WEST
    }
  }

  turnRight() {
    this.robotFacing += 1

    if (this.robotFacing > WEST) {
      this.robotFacing = NORTH
    }
  }

  turn(side) {
    if (side === TURN.LEFT) {
      return this.turnLeft()
    }

    return this.turnRight()
  }

  moveForward() {
    if (this.robotFacing === NORTH) {
      this.robotPosition.y -= 1
    } else if (this.robotFacing === EAST) {
      this.robotPosition.x += 1
    } else if (this.robotFacing === SOUTH) {
      this.robotPosition.y += 1
    } else if (this.robotFacing === WEST) {
      this.robotPosition.x -= 1
    }

    if (
      this.robotPosition.x < 0 ||
      this.robotPosition.x >= this.width ||
      this.robotPosition.y < 0 ||
      this.robotPosition.y >= this.height
    ) {
      throw new Error(`Invalid position: ${this.robotPosition.x},${this.robotPosition.y}`)
    }
  }

  toString() {
    let str = ''

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.robotPosition.x !== x || this.robotPosition.y !== y) {
          str += this.hull[y][x] === COLOR_BLACK.VALUE ? COLOR_BLACK.REPR : COLOR_WHITE.REPR
        } else if (this.robotFacing === NORTH) {
          str += '^'
        } else if (this.robotFacing === EAST) {
          str += '>'
        } else if (this.robotFacing === SOUTH) {
          str += 'v'
        } else if (this.robotFacing === WEST) {
          str += '<'
        }
      }

      str += '\n'
    }

    return str
  }
}

class Robot {
  constructor(program) {
    this.intcode = Intcode(program)

    // initialize the program and wait for the first input
    this.next()
  }

  next(value) {
    this.result = this.intcode.next(value)

    return this.result
  }

  get done() {
    return this.result.done
  }
}

function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 5000))
}

async function main(input) {
  const program = input
    .trim()
    .split(',')
    .map((str) => parseInt(str, 10))
  const hull = new Hull(45, 10)
  const robot = new Robot(program)

  while (!robot.done) {
    const colorOutput = robot.next(hull.getCurrentColor())

    const { x, y } = hull.robotPosition

    hull.setCurrentColor(colorOutput.value)

    const turnOutput = robot.next()

    hull.turn(turnOutput.value)

    hull.moveForward()

    robot.next()

    console.log(hull.toString())

    await new Promise((resolve) => setTimeout(resolve, 15))
  }

  return hull.toString()
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

main(input).catch((error) => console.error(error))
