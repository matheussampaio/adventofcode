const fs = require('fs')

function calculatePosition(course) {
  const instructions = course.trim().split('\n')

  let x = 0
  let y = 0
  let aim = 0

  for (const instruction of instructions) {
    const direction = instruction.split(' ')[0]
    const value = parseInt(instruction.split(' ')[1], 10)

    switch (direction) {
      case 'forward':
        x += value
        y += aim * value
        break
      case 'up':
        aim -= value
        break
      case 'down':
        aim += value
        break
    }
  }

  return x * y
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `forward 5
down 5
forward 8
up 3
down 8
forward 2`

console.log(calculatePosition(example))
console.log(calculatePosition(input))
