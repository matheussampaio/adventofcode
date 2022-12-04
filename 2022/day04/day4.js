const _ = require('lodash')

const { read } = require('../utils')

function fullyContains(input) {
  return _.chain(input)
    .trim()
    .split('\n')
    .map(r => r.replace(',', '-').split('-').toInt())
    .filter(([s1, e1, s2, e2]) => {
      if (s1 <= s2 && e1 >= e2) {
        return true
      }

      if (s2 <= s1 && e2 >= e1) {
        return true
      }

      return false
    })
    .size()
    .value()
}

function overlaps(input) {
  return _.chain(input)
    .trim()
    .split('\n')
    .map(r => r.replace(',', '-').split('-').toInt())
    .filter(([s1, e1, s2, e2]) => {
      if (s1 >= s2 && s1 <= e2) {
        return true
      }

      if (e1 >= s2 && e1 <= e2) {
        return true
      }

      if (s2 >= s1 && s2 <= e1) {
        return true
      }

      if (e2 >= s1 && e2 <= e1) {
        return true
      }

      return false
    })
    .size()
    .value()
}

const input = read(`${__dirname}/input.txt`)

const example = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`

console.log(fullyContains(example))
console.log(fullyContains(input))


console.log(overlaps(example))
console.log(overlaps(input))
