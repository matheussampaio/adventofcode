const fs = require('fs')

function Intcode(memory) {
  const STOP_CODE = 99
  const ADD_CODE = 1
  const MULT_CODE = 2

  let ip = 0

  while (memory[ip] !== STOP_CODE) {
    const opcode = memory[ip]

    const p1 = memory[ip + 1]
    const p2 = memory[ip + 2]
    const p3 = memory[ip + 3]

    switch (opcode) {
      case ADD_CODE:
        memory[p3] = memory[p1] + memory[p2]
        ip += 4
        break
      case MULT_CODE:
        memory[p3] = memory[p1] * memory[p2]
        ip += 4
        break
      case STOP_CODE:
        return memory
      default:
        throw new Error(`Invalid OPCODE: ${opcode}`)
    }
  }

  return memory
}

function findFirstAnswer(input) {
  const program = input
    .trim()
    .split(',')
    .map((str) => parseInt(str, 10))

  program[1] = 12
  program[2] = 2

  return Intcode(program)[0]
}

function findNounAndVerbAndCalculateAnswer(input) {
  const program = input
    .trim()
    .split(',')
    .map((str) => parseInt(str, 10))

  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      const memory = [...program]

      memory[1] = noun
      memory[2] = verb

      if (Intcode(memory)[0] === 19690720) {
        return 100 * noun + verb
      }
    }
  }
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(findFirstAnswer(input))
console.log(findNounAndVerbAndCalculateAnswer(input))
