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

const TILES = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  PADDLE: 3,
  BALL: 4
}

const MOVEMENTS = {
  LEFT: -1,
  NETRAL: 0,
  RIGHT: 1
}

class Screen {
  constructor() {
    this.grid = {}
  }

  setTile(x, y, value) {
    if (y == null || x == null || value == null) {
      return
    }

    if (this.grid[y] == null) {
      this.grid[y] = {}
    }

    this.grid[y][x] = value
  }

  get width() {
    const Xs = []

    for (const y in this.grid) {
      for (const x in this.grid[y]) {
        Xs.push(parseInt(x, 10))
      }
    }

    return Math.max(...Xs)
  }

  get height() {
    const Ys = []

    for (const y in this.grid) {
      Ys.push(parseInt(y, 10))
    }

    return Math.max(...Ys)
  }

  toString() {
    let frame = ''

    for (let y = 0; y <= this.height; y++) {
      for (let x = 0; x <= this.width; x++) {
        switch (this.grid[y][x]) {
          case TILES.EMPTY:
            frame += ' '
            break
          case TILES.WALL:
            frame += '█'
            break
          case TILES.BLOCK:
            frame += '░'
            break
          case TILES.PADDLE:
            frame += '█'
            break
          case TILES.BALL:
            frame += '■'
            break
        }
      }

      frame += '\n'
    }

    return frame
  }
}

class Game {
  constructor(program, inputs) {
    this.intcode = Intcode(program, inputs)
    this.screen = new Screen()
    this.score = 0
    this.currentBallPosition = { x: -1, y: -1 }
    this.currentPaddlePosition = { x: -1, y: -1 }
  }

  tickNext(input) {
    const result = this.next(input)

    if (result.value == null) {
      return
    }

    if (result.value.type === 'input') {
      return
    }

    const { data: x } = result.value
    const { data: y } = this.next().value
    const { data } = this.next().value

    if (x === -1 && y === 0) {
      this.score = data
    } else {
      this.screen.setTile(x, y, data)

      if (data === TILES.PADDLE) {
        this.currentPaddlePosition = { x, y }
      }

      if (data === TILES.BALL) {
        this.currentBallPosition = { x, y }
      }
    }

    return this.tickNext(input)
  }

  next(input) {
    this.result = this.intcode.next(input)

    return this.result
  }

  get done() {
    return this.result && this.result.done
  }

  toString() {
    return this.screen.toString()
  }
}

async function main(input) {
  const program = input
    .trim()
    .split(',')
    .map((str) => parseInt(str, 10))

  program[0] = 2

  for (let i = 1430; i < 1525; i++) {
    program[i] = 1
  }

  const game = new Game(program, [0, 0, 0, 1])
  let movement = MOVEMENTS.NETRAL

  while (!game.done) {
    game.tickNext(movement)

    // movement = Math.sign(game.currentBallPosition.x - game.currentPaddlePosition.x)

    console.log(game.toString())
  }

  return game.score
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

main(input)
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
