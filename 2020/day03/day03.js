const fs = require('fs')

function part1(input, move = { x: 3, y: 1 }) {
  const pos = { x: 0, y: 0 }

  const rows = input.trim().split('\n')

  let trees = 0

  while (true) {
    pos.x += move.x
    pos.y += move.y

    const row = rows[pos.y]

    if (row == null) {
      break
    }

    const cell = rows[pos.y][pos.x % rows[0].length]

    if (cell === '#') {
      trees += 1
    }
  }

  return trees
}

function part2(input) {
  const moves = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 }
  ]

  return moves
    .map((move) => part1(input, move))
    .reduce((result, current) => {
      return result * current
    }, 1)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(part1(input))
console.log(part2(input))
