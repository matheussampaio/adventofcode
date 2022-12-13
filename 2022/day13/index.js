const _ = require('lodash')

const { read } = require('../utils')

const IN_ORDER = 1
const NOT_IN_ORDER = -1
const UNSURE = 0

function calc1(input) {
  const pairs = input.trim().split('\n\n')

  return pairs
    .map(pair => pair.split('\n').map(eval))
    .map(([left, right]) => isPairInOrder(left, right) === 1)
    .map((r, i) => r ? i + 1 : 0)
    .sum()
}

function calc2(input) {
  const packets = (input + '\n[[2]]\n[[6]]')
    .split('\n')
    .filter(line => line.length)
    .sort((p1, p2) => isPairInOrder(eval(p1), eval(p2)))
    .reverse()

  const i = packets.findIndex(p => p === '[[2]]') + 1
  const k = packets.findIndex(p => p === '[[6]]') + 1

  return i * k
}

function isPairInOrder(left, right, original) {
  while (left.length && right.length) {
    const l = left.shift()
    const r = right.shift()

    if (_.isNumber(l) && _.isNumber(r)) {
      if (l < r) {
        return IN_ORDER
      }

      if (l > r) {
        return NOT_IN_ORDER
      }
    } else if (_.isArray(l) && _.isArray(r)) {
      const result = isPairInOrder(l, r)

      if (result != UNSURE) {
        return result
      }
    } else if (_.isNumber(l)) {
      const result = isPairInOrder([l], r)

      if (result != UNSURE) {
        return result
      }
    } else {
      const result = isPairInOrder(l, [r])

      if (result != UNSURE) {
        return result
      }
    }
  }

  if (left.length === 0 && right.length > 0) {
    return IN_ORDER
  }

  if (left.length > 0 && right.length === 0) {
    return NOT_IN_ORDER
  }

  return UNSURE
}

const input = read(`${__dirname}/input.txt`)

const example = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`

console.log(calc1(example))
console.log(calc1(input))

console.log(calc2(example))
console.log(calc2(input))
