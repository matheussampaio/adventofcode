const { read } = require('../utils')

function main(input, partTwo = false) {
  return input.trim().split('\n')
    .map(line => findDigit(line).toString() + findDigit(line, false).toString())
    .map(n => parseInt(n, 10))
    .reduce((sum, curr) => sum + curr, 0)
}

function findDigit(line, left2right = true) {
  const left = /^.*?(\d|one|two|three|four|five|six|seven|eight|nine).*$/
  const right = /.*(\d|one|two|three|four|five|six|seven|eight|nine).*?$/

  const numbers = ['_zero_', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

  const match = line.match(left2right ? left : right)[1]

  return match.length > 1 ? numbers.findIndex(n => n === match) : match
}

const input = read(`${__dirname}/input.txt`)

const example = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`

// console.log(main(example))
// console.log(main(input))

const example2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

console.log(main(example2, true))
console.log(main(input, true))
