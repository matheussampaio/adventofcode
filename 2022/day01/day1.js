const fs = require('fs')

function maxCalories(input, n = 1) {
  const bags = input
    .trim()
    .split('\n\n')

  const calories = bags.map(bag => bag
    .split('\n')
    .map((n) => parseInt(n, 10))
    .reduce((cur, sum) => cur + sum, 0))
    .sort((a, b) => b - a)

  return calories.slice(0, n)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

console.log(maxCalories(example))
console.log(maxCalories(input))

console.log(maxCalories(example, 3).reduce((cur, sum) => cur + sum, 0))
console.log(maxCalories(input, 3).reduce((cur, sum) => cur + sum, 0))

