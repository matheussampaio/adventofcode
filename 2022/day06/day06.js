const _ = require('lodash')

const { read } = require('../utils')

function findStartOfMessage(input, size = 4) {
  for (let i = size; i < input.length; i++) {
    const set = new Set(input.slice(i - size, i))

    if (set.size === size) {
      return i
    }
  }
}

const input = read(`${__dirname}/input.txt`)

const examples = [
  `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
  `bvwbjplbgvbhsrlpgdmjqwftvncz`,
  `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
  `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`
]

examples.forEach(example => console.log(findStartOfMessage(example)))
console.log(findStartOfMessage(input))

examples.forEach(example => console.log(findStartOfMessage(example, 14)))
console.log(findStartOfMessage(input, 14))
