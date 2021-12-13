const fs = require('fs')
const _ = require('lodash')

const scores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,

  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4
}

const openBrackets = ['(', '[', '{', '<']
const closeBrackets = [')', ']', '}', '>']

function validate(line) {
  const stack = []

  for (const c of line) {
    if (openBrackets.includes(c)) {
      stack.push(c)
      continue
    }

    // if the stack is empty, the line is corrupted
    if (stack.length <= 0) {
      return
    }

    const openBracketIndex = closeBrackets.indexOf(c)

    if (stack[stack.length - 1] !== openBrackets[openBracketIndex]) {
      return false
    }

    stack.pop()
  }

  return stack
}

function xyz(input) {
  const lines = input.trim().split('\n')

  const points = []

  for (const line of lines) {
    const brakets = validate(line.trim())

    if (brakets) {
      const score = brakets.reverse().reduce((sum, b) => sum * 5 + scores[b], 0)

      points.push(score)
    }
  }

  points.sort((a, b) => a - b)

  return points[Math.floor(points.length / 2)]
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`

console.log(xyz(example))
console.log(xyz(input))
