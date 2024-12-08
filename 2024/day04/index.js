const { read } = require('../utils')
const _ = require('lodash')

function main(input) {
  const m = input
    .trim()
    .split('\n')
    .map((lines) => lines.split(''))

  let countXmas = 0

  const directions = getDirections()

  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] === 'X') {
        for (const dir of directions) {
          if ('XMAS' === getWord(x, y, dir, m)) {
            countXmas += 1
          }
        }
      }
    }
  }

  let countMas = 0

  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] === 'A') {
        const SM = m[y - 1]?.[x - 1] === 'S' && m[y + 1]?.[x + 1] === 'M'
        const MS = m[y - 1]?.[x - 1] === 'M' && m[y + 1]?.[x + 1] === 'S'

        const SM2 = m[y - 1]?.[x + 1] === 'S' && m[y + 1]?.[x - 1] === 'M'
        const MS2 = m[y - 1]?.[x + 1] === 'M' && m[y + 1]?.[x - 1] === 'S'

        if ((SM || MS) && (SM2 || MS2)) {
          countMas += 1
        }
      }
    }
  }

  return [countXmas, countMas]
}

function getWord(x, y, dir, matrix) {
  let word = ''

  for (let { dx, dy } of dir) {
    word += _.get(matrix, `${y + dy}.${x + dx}`, '')
  }

  return word
}

function getDirections(wordSize = 4) {
  const dirs = []

  // N
  dirs.push(_.range(wordSize).map((i) => ({ dx: 0, dy: -i })))
  // NE
  dirs.push(_.range(wordSize).map((i) => ({ dx: i, dy: -i })))
  // E
  dirs.push(_.range(wordSize).map((i) => ({ dx: i, dy: 0 })))
  // SE
  dirs.push(_.range(wordSize).map((i) => ({ dx: i, dy: i })))
  // S
  dirs.push(_.range(wordSize).map((i) => ({ dx: 0, dy: i })))
  // SW
  dirs.push(_.range(wordSize).map((i) => ({ dx: -i, dy: i })))
  // W
  dirs.push(_.range(wordSize).map((i) => ({ dx: -i, dy: 0 })))
  // NW
  dirs.push(_.range(wordSize).map((i) => ({ dx: -i, dy: -i })))

  return dirs
}

const input = read(`${__dirname}/input.txt`)

const example = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`

console.log(main(example))
console.log(main(input))
