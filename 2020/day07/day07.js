const fs = require('fs')
const re1 = /^(.*) bags contain (.*)\.$/
const re2 = /^(\d+) (\w+ \w+) bags?$/

function parseRules(input) {
  const rules = {}

  for (const line of input.trim().split('\n')) {
    const result1 = re1.exec(line.trim())

    const [_, color, rest] = result1

    rules[color] = {}

    for (const part of rest.split(',')) {
      const result2 = re2.exec(part.trim())

      if (result2 == null) {
        continue
      }

      const [_, num, color2] = result2

      rules[color][color2] = parseInt(num, 10)
    }
  }

  return rules
}

function getBagsThatDirectlyCarry(rules, bag) {
  const bags = []

  for (let key in rules) {
    if (rules[key][bag]) {
      bags.push(key)
    }
  }

  return bags
}

function getBagsThatIndirectlyCarry(rules, bag) {
  const bags = {}
  const queue = [bag]

  while (queue.length) {
    const bag = queue.pop()

    const result = getBagsThatDirectlyCarry(rules, bag)

    for (let color of result) {
      if (bags[color] == null) {
        bags[color] = true
        queue.push(color)
      }
    }
  }

  return Object.keys(bags)
}

function part1(input) {
  const rules = parseRules(input)

  return getBagsThatIndirectlyCarry(rules, 'shiny gold').length
}

function part2(input) {
  const rules = parseRules(input)

  const queue = ['shiny gold']
  let sum = 0

  while (queue.length) {
    const current = queue.pop()

    sum += 1

    for (const color in rules[current]) {
      const shouldContainNBagsOfThisColor = rules[current][color]

      for (let i = 0; i < shouldContainNBagsOfThisColor; i++) {
        queue.push(color)
      }
    }
  }

  return sum - 1
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(part1(input))
console.log(part2(input))
