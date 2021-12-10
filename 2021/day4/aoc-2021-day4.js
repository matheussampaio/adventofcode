const fs = require('fs')

class Board {
  constructor(id, matrix) {
    this.id = id
    this.matrix = matrix

    this.flat = [...this.matrix]

    for (let x = 0; x < 5; x++) {
      const seq = []

      for (let y = 0; y < 5; y++) {
        seq.push(this.matrix[y][x])
      }

      this.flat.push(seq)
    }
  }

  mark(number) {
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (this.matrix[y][x].number === number) {
          this.matrix[y][x].marked = true
        }
      }
    }
  }

  get won() {
    return this.flat.some((seq) => {
      return seq.every((cell) => cell.marked)
    })
  }

  getScore(lastMarked) {
    const sumUnmarked = this.matrix
      .flat()
      .filter((c) => !c.marked)
      .reduce((sum, c) => c.number + sum, 0)

    return sumUnmarked * lastMarked
  }
}

function calculateFinalScore(input) {
  const lines = input.trim().split('\n')

  const randomPool = lines
    .shift()
    .split(',')
    .map((n) => parseInt(n, 10))

  const boards = {}

  let boardId = 0

  while (lines.length) {
    lines.shift()

    const columns = []

    for (let i = 0; i < 5; i++) {
      const row = lines
        .shift()
        .trim()
        .split(' ')
        .filter((e) => e)
        .map((n) => ({ number: parseInt(n, 10), marked: false }))

      columns.push(row)
    }

    boardId++

    boards[boardId] = new Board(boardId, columns)
  }

  let firstToWin = null

  while (Object.values(boards).length) {
    const number = randomPool.shift()

    for (const board of Object.values(boards)) {
      board.mark(number)

      if (board.won) {
        if (firstToWin == null) {
          firstToWin = board

          console.log('First board to win score:', board.getScore(number))
        }

        if (Object.values(boards).length === 1) {
          console.log('Last board to win score:', board.getScore(number))
        }

        delete boards[board.id]
      }
    }
  }

  return null
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`

console.log(calculateFinalScore(example))
console.log(calculateFinalScore(input))
