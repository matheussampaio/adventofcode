const _ = require('lodash')

const { read } = require('../utils')

function topOfTheStacks(input, size = 4) {
  const letters = input.split('').slice(0, size)

  for (let i = size; i < input.length; i++) {
    if (allDiff(letters, size)) {
      return i
    }

    letters.shift()
    letters.push(input[i])
  }
}

function allDiff(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let k = i + 1; k < arr.length; k++) {
      if (arr[i] === arr[k]) {
        return false
      }
    }
  }

  return true
}

const input = read(`${__dirname}/input.txt`)

const examples = [
  `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
  `bvwbjplbgvbhsrlpgdmjqwftvncz`,
  `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
  `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`
]

examples.forEach(example => console.log(topOfTheStacks(example)))
console.log(topOfTheStacks(input))

examples.forEach(example => console.log(topOfTheStacks(example, 14)))
console.log(topOfTheStacks(input, 14))
