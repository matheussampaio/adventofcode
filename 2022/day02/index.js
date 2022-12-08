const { read } = require('../utils')

const SCORES = {
  X: 1,
  Y: 2,
  Z: 3,

  'A_X': 3, // rock <- rock = draw
  'A_Y': 6, // rock <- paper = win
  'A_Z': 0, // rock <- scissors = lose

  'B_X': 0, // paper <- rock = lose
  'B_Y': 3, // paper <- paper = draw
  'B_Z': 6, // paper <- scissors = win

  'C_X': 6, // scissors <- rock = win
  'C_Y': 0, // scissors <- paper = lose
  'C_Z': 3, // scissors <- scissors = draw
}

const CHEATSHEET = {
  'A_X': 'Z', // rock <- lose = scissors
  'A_Y': 'X', // rock <- draw = rock
  'A_Z': 'Y', // rock <- win = paper

  'B_X': 'X', // paper <- lose = rock
  'B_Y': 'Y', // paper <- draw = paper
  'B_Z': 'Z', // paper <- win = scissors

  'C_X': 'Y', // scissors <- lose = paper
  'C_Y': 'Z', // scissors <- draw = scissors
  'C_Z': 'X', // scissors <- win = rock
}

function calcScore(input, q2 = false) {
  return input
    .trim()
    .split('\n')
    .map(round => {
      let [h1, h2] = round.split(' ')

      if (q2) {
        h2 = CHEATSHEET[`${h1}_${h2}`]
      }

      return SCORES[h2] + SCORES[`${h1}_${h2}`]
    })
    .sum()
}

const input = read(`${__dirname}/input.txt`)

const example = `A Y
B X
C Z`

console.log(calcScore(example))
console.log(calcScore(input))

console.log(calcScore(example, true))
console.log(calcScore(input, true))
