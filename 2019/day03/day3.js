const fs = require('fs')

function manhattanDistance(input) {
  const [redMovements, blueMovements] = input
    .trim()
    .split(`\n`)
    .map((wire) => wire.split(','))

  const red = getWirePositions(redMovements)
  const blue = getWirePositions(blueMovements)

  let minSteps = Number.MAX_VALUE

  for (const pos in red) {
    if (blue[pos]) {
      const steps = red[pos].steps + blue[pos].steps

      if (steps < minSteps) {
        minSteps = steps
      }
    }
  }

  return minSteps
}

function getWirePositions(movements) {
  const wirePositions = {}

  let x = 0
  let y = 0
  let steps = 0

  for (const move of movements) {
    const dir = move.substring(0, 1)
    const dis = parseInt(move.substring(1), 10)

    for (let i = 0; i < dis; i++) {
      if (dir === 'U') {
        y -= 1
      }
      if (dir === 'R') {
        x += 1
      }
      if (dir === 'D') {
        y += 1
      }
      if (dir === 'L') {
        x -= 1
      }

      steps += 1

      wirePositions[`${x},${y}`] = { x, y, steps }
    }
  }

  return wirePositions
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(manhattanDistance(input))
