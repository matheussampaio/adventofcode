const { read } = require('../utils')
const _ = require('lodash')

function main(input, partTwo = false) {
  const [firstBlock, secondBlock] = input.trim().split('\n\n')

  const pageOrderingRules = {}

  for (const line of firstBlock.split('\n')) {
    const [left, right] = line.split('|')

    if (pageOrderingRules[left] == null) {
      pageOrderingRules[left] = {}
    }

    pageOrderingRules[left][right] = true
  }

  const manuals = secondBlock
    .lines()
    .map((line) => line.split(',').int())
    .filter((manual) => {
      const pages = {}

      for (const page of manual) {
        pages[page] = true

        if (pageOrderingRules[page] == null) {
          continue
        }

        for (const rule in pageOrderingRules[page]) {
          if (pages[rule]) {
            return partTwo
          }
        }
      }

      return !partTwo
    })

  if (partTwo) {
    manuals.forEach((manual) => {
      manual.sort((a, b) => {
        if (pageOrderingRules[a]?.[b]) {
          return -1
        }
        if (pageOrderingRules[b]?.[a]) {
          return 1
        }
        return 0
      })
    })
  }

  return manuals.map((manual) => manual[Math.floor(manual.length / 2)]).sum()
}

const input = read(`${__dirname}/input.txt`)

const example = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`

console.log(main(example))
console.log(main(input))

console.log(main(example, true))
console.log(main(input, true))
