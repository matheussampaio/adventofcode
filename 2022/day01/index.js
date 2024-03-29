const { read } = require('../utils')

function maxCalories(input, limit = 1) {
  const bags = input.trim().split('\n\n')

  const calories = bags
    .map(bag => bag.split('\n').int().sum())
    .desc()

  return calories.slice(0, limit).sum()
}

const input = read(`${__dirname}/input.txt`)

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

console.log(maxCalories(example, 3))
console.log(maxCalories(input, 3))

