const fs = require('fs')

function getRow(code) {
  let min = 0
  let max = 127

  for (let i = 0; i <= 5; i++) {
    const letter = code[i]
    const halfSize = (max - min) / 2

    if (letter === 'F') {
      max = Math.floor(max - halfSize)
    } else {
      min = Math.ceil(min + halfSize)
    }
  }

  if (code[6] === 'F') {
    return min
  }

  return max
}

function getColumn(code) {
  let min = 0
  let max = 7

  for (let i = 7; i <= 8; i++) {
    const letter = code[i]
    const halfSize = (max - min) / 2

    if (letter === 'L') {
      max = Math.floor(max - halfSize)
    } else {
      min = Math.ceil(min + halfSize)
    }
  }

  if (code[9] === 'L') {
    return min
  }

  return max
}

function getSeatId(row, column) {
  return row * 8 + column
}

function part1(input) {
  return input
    .trim()
    .split('\n')
    .map((code) => {
      const row = getRow(code)
      const column = getColumn(code)
      const seatId = getSeatId(row, column)

      return seatId
    })
    .sort((a, b) => b - a)[0]
}

function part2(input) {
  const seatIds = input
    .trim()
    .split('\n')
    .map((code) => {
      const row = getRow(code)
      const column = getColumn(code)
      const seatId = getSeatId(row, column)

      return seatId
    })
    .sort((a, b) => a - b)

  const firstSeat = seatIds[0]

  for (let i = 0; i < seatIds.length; i++) {
    if (firstSeat + i !== seatIds[i]) {
      return firstSeat + i
    }
  }

  return -1
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(part1(input))
console.log(part2(input))
