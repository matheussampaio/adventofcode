const { read } = require("../utils");
const _ = require('lodash')

const OPERATIONS = {
  '*': (a, b) => a * b,
  '+': (a, b) => a + b,
}

function main(input, partTwo = false) {
  const lines = input.lines().map(line => line.split(''))
  const operations = lines.pop()

  const problems = []

  while (operations.length) {
    const operation = operations.shift()

    const mIndex = operations.indexOf('*')
    const pIndex = operations.indexOf('+')

    let width = 0

    if (pIndex !== -1 && mIndex !== -1) {
      width = Math.min(pIndex, mIndex)
    } else if (pIndex !== -1) {
      width = pIndex
    } else if (mIndex !== -1) {
      width = mIndex
    } else {
      width = operations.length + 1
    }

    operations.splice(0, width) // advance operations pointer

    const problem = []

    for (let i = 0; i < lines.length; i++) {
      problem.push(lines[i].splice(0, width))

      lines[i].splice(0, 1) // consume column separators
    }

    const numbers = _.zip(...problem).map(n => n.join('').trim().int())

    const result = numbers.slice(1).reduce((acc, num) => OPERATIONS[operation](num, acc), numbers[0])

    problems.push(result)
  }

  return problems.sum()
}

const input = read(`${__dirname}/input.txt`);

const example = [
  `123 328  51 64 `,
  ` 45 64  387 23 `,
  `  6 98  215 314`,
  `*   +   *   +  `
].join('\n')

// console.log(main(example));
// console.log(main(input));

console.log(main(example, true));
console.log(main(input, true));
