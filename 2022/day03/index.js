const _ = require('lodash')

const { read } = require('../utils')

function sumPriority(input) {
  return _.chain(input)
    .trim()
    .split('\n')
    .map(r => r.split(''))
    .map(rucksack => {
      const half = Math.ceil(rucksack.length / 2)

      const leftPocket = rucksack.slice(0, half)
      const rightPocket = rucksack.slice(half)

      return [leftPocket, rightPocket]
    })
    .map(rucksack => _.intersection(...rucksack))
    .flatMap()
    .map(getItemTypePriority)
    .sum()
    .value()
}

function sumPrioritiesCommonItemType(input) {
  return _.chain(input)
    .trim()
    .split('\n')
    .map(r => r.split(''))
    .chunk(3)
    .map(group => _.intersection(...group))
    .flatMap()
    .map(getItemTypePriority)
    .sum()
    .value()
}

function getItemTypePriority(c) {
  let priority = c.charCodeAt(0) - 96

  if (priority < 0) {
    priority += 58
  }

  return priority
}

const input = read(`${__dirname}/input.txt`)

const example = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`

console.log(sumPriority(example))
console.log(sumPriority(input))

console.log(sumPrioritiesCommonItemType(example))
console.log(sumPrioritiesCommonItemType(input))

