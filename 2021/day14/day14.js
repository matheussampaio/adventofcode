const fs = require('fs')

function xyz(input, steps) {
  const lines = input.trim().split('\n')

  let template = lines.shift()

  lines.shift()

  const rules = {}

  for (const line of lines) {
    const [from, to] = line.split(' -> ')

    const [left, right] = from.split('')

    rules[from] = [left + to, to + right]
  }

  let polymer = {}

  for (let i = 0; i + 1 < template.length; i++) {
    const e = template[i] + template[i + 1]

    polymer[e] = (polymer[e] ?? 0) + 1
  }

  for (let s = 0; s < steps; s++) {
    let nextPolymer = {}

    for (const reaction in polymer) {
      const [left, right] = rules[reaction]

      if (nextPolymer[left] == null) nextPolymer[left] = 0
      if (nextPolymer[right] == null) nextPolymer[right] = 0

      nextPolymer[left] += polymer[reaction]
      nextPolymer[right] += polymer[reaction]
    }

    polymer = { ...nextPolymer }
  }

  const elements = {}

  const keys = Object.keys(polymer)

  for (let i = 0; i < keys.length; i++) {
    const reaction = keys[i]
    const [left, right] = reaction.split('')

    if (i === 0) {
      if (elements[left] == null) elements[left] = 0

      elements[left] += polymer[reaction]
    }

    if (elements[right] == null) elements[right] = 0

    elements[right] += polymer[reaction]
  }

  const frequency = Object.values(elements).sort((a, b) => b - a)

  return frequency[0] - frequency[frequency.length - 1]
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`

console.log('Part 1', xyz(example, 10))
console.log('Part 2', xyz(example, 40))

console.log('Part 1', xyz(input, 10))
console.log('Part 2', xyz(input, 40))
