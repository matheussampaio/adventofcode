const fs = require('fs')

function parseGroups(input) {
  const groups = []
  let group = []

  for (const line of input.trim().split('\n')) {
    if (line === '') {
      groups.push(group)

      group = []

      continue
    }

    group.push(line)
  }

  groups.push(group)

  return groups
}

function anyoneAnsweredYesTo(group) {
  const questions = {}

  for (const letter of group.join('')) {
    questions[letter] = true
  }

  return Object.keys(questions).length
}

function everyoneAnsweredYesTo(group) {
  const questions = {}

  for (const letter of group[0]) {
    questions[letter] = true
  }

  for (let i = 1; i < group.length; i++) {
    for (const question in questions) {
      if (group[i].indexOf(question) === -1) {
        delete questions[question]
      }
    }
  }

  return Object.keys(questions).length
}

function part1(input) {
  const groups = parseGroups(input)
  const answers = groups.map((group) => anyoneAnsweredYesTo(group))
  const sum = answers.reduce((sum, current) => sum + current, 0)

  return sum
}

function part2(input) {
  const groups = parseGroups(input)
  const answers = groups.map((group) => everyoneAnsweredYesTo(group))
  const sum = answers.reduce((sum, current) => sum + current, 0)

  return sum
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(part1(input))
console.log(part2(input))
