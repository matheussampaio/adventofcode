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
  FLOOR: 2,
  OXYGEN: 3
}

const MOVEMENTS = {
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4
}

class Screen {
  constructor() {
    this.grid = {
      0: {
        0: TILES.FLOOR
      }
    }
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

  get Xs() {
    const Xs = []

    for (const y in this.grid) {
      for (const x in this.grid[y]) {
        Xs.push(parseInt(x, 10))
      }
    }

    return Xs
  }

  get Ys() {
    const Ys = []

    for (const y in this.grid) {
      Ys.push(parseInt(y, 10))
    }

    return Ys
  }

  toString(droid) {
    let frame = ''

    for (let y = Math.min(...this.Ys); y <= Math.max(...this.Ys); y++) {
      for (let x = Math.min(...this.Xs); x <= Math.max(...this.Xs); x++) {
        if (x === droid.x && y === droid.y) {
          frame += 'D'
          continue
        }

        switch (this.grid[y][x]) {
          case TILES.WALL:
            frame += '█'
            break
          case TILES.FLOOR:
            frame += '░'
            break
          case TILES.OXYGEN:
            frame += '0'
            break
          default:
            frame += '?'
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
    this.currentDroidPosition = { x: 0, y: 0 }
    this.oxygenSource = null
  }

  move(movement) {
    let { x, y } = this.currentDroidPosition

    switch (movement) {
      case MOVEMENTS.NORTH:
        y -= 1
        break
      case MOVEMENTS.SOUTH:
        y += 1
        break
      case MOVEMENTS.EAST:
        x += 1
        break
      case MOVEMENTS.WEST:
        x -= 1
        break
    }

    this.currentDroidPosition = { x, y }
    this.screen.setTile(x, y, TILES.FLOOR)
  }

  setWall(movement) {
    let { x, y } = this.currentDroidPosition

    switch (movement) {
      case MOVEMENTS.NORTH:
        y -= 1
        break
      case MOVEMENTS.SOUTH:
        y += 1
        break
      case MOVEMENTS.EAST:
        x += 1
        break
      case MOVEMENTS.WEST:
        x -= 1
        break
    }

    this.screen.setTile(x, y, TILES.WALL)
  }

  next(input) {
    this.result = this.intcode.next(input)

    return this.result
  }

  get done() {
    return this.result && this.result.done
  }

  getDirectionToEmptyTile() {
    const { x, y } = this.currentDroidPosition

    if (this.screen.grid[y][x - 1] == null) {
      return MOVEMENTS.WEST
    }

    if (this.screen.grid[y][x + 1] == null) {
      return MOVEMENTS.EAST
    }

    if (this.screen.grid[y - 1] == null || this.screen.grid[y - 1][x] == null) {
      return MOVEMENTS.NORTH
    }

    if (this.screen.grid[y + 1] == null || this.screen.grid[y + 1][x] == null) {
      return MOVEMENTS.SOUTH
    }

    return null
  }

  toString() {
    return this.screen.toString(this.currentDroidPosition, this.oxygenSource)
  }
}

async function main(input) {
  const program = input
    .trim()
    .split(',')
    .map((str) => parseInt(str, 10))
  const game = new Game(program)
  const movementHistory = []

  while (true) {
    game.next()

    // console.log(game.toString())

    // if around empty square, try moving there
    let movement = game.getDirectionToEmptyTile()

    let output

    if (movement) {
      output = game.next(movement)

      if (output.value.data !== 0) {
        movementHistory.push(movement)
      }
    } else if (movementHistory.length) {
      switch (movementHistory.pop()) {
        case MOVEMENTS.NORTH:
          movement = MOVEMENTS.SOUTH
          break
        case MOVEMENTS.SOUTH:
          movement = MOVEMENTS.NORTH
          break
        case MOVEMENTS.EAST:
          movement = MOVEMENTS.WEST
          break
        case MOVEMENTS.WEST:
          movement = MOVEMENTS.EAST
          break
        default:
          throw new Error('Empty history')
      }

      output = game.next(movement)
    } else {
      break
    }

    // hit wall
    if (output.value.data === 0) {
      game.setWall(movement)

      // moved one step
    } else if (output.value.data === 1) {
      game.move(movement)
    } else if (output.value.data === 2) {
      game.move(movement)

      game.screen.setTile(game.currentDroidPosition.x, game.currentDroidPosition.y, TILES.OXYGEN)
      game.oxygenSource = { ...game.currentDroidPosition }
    }
  }

  let totalTime = 0

  const queue = [{ ...game.oxygenSource, time: totalTime }]

  while (queue.length) {
    const { x, y, time } = queue.shift()

    if (game.screen.grid[y][x - 1] === TILES.FLOOR) {
      queue.push({ x: x - 1, y, time: time + 1 })
      game.screen.grid[y][x - 1] = TILES.OXYGEN
      totalTime = time + 1
    }

    if (game.screen.grid[y][x + 1] === TILES.FLOOR) {
      queue.push({ x: x + 1, y, time: time + 1 })
      game.screen.grid[y][x + 1] = TILES.OXYGEN
      totalTime = time + 1
    }

    if (game.screen.grid[y - 1] && game.screen.grid[y - 1][x] === TILES.FLOOR) {
      queue.push({ x, y: y - 1, time: time + 1 })
      game.screen.grid[y - 1][x] = TILES.OXYGEN
      totalTime = time + 1
    }

    if (game.screen.grid[y + 1] && game.screen.grid[y + 1][x] === TILES.FLOOR) {
      queue.push({ x, y: y + 1, time: time + 1 })
      game.screen.grid[y + 1][x] = TILES.OXYGEN
      totalTime = time + 1
    }
  }

  console.log(game.toString())

  return totalTime
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

main(input)
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
