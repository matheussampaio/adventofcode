const fs = require('fs')

function part1(input) {
  const numbers = input.split('\n').map((n) => parseInt(n, 10))

  const nums = {}

  for (const n of numbers) {
    nums[n] = true

    if (nums[2020 - n] != null) {
      return (2020 - n) * n
    }
  }
}

function part2() {
  const numbers = input.split('\n').map((n) => parseInt(n, 10))
  const numbersMap = {}

  for (const num of numbers) {
    numbersMap[num] = true
  }

  for (let i = 0; i < numbers.length - 2; i++) {
    const a = numbers[i]

    for (let k = i + 1; k < numbers.length - 1; k++) {
      const b = numbers[k]

      const c = 2020 - a - b

      if (numbersMap[c] != null) {
        return a * b * c
      }
    }
  }
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(part1(input))
console.log(part2(input))
