const fs = require('fs')

function calculateFuelRequirements(input) {
  const modules = input
    .trim()
    .split('\n')
    .map((str) => parseInt(str, 10))

  console.log(
    'Part 1:',
    modules.map((n) => Math.floor(n / 3) - 2).reduce((sum, n) => sum + n, 0)
  )

  let totalFuel = 0

  while (modules.length) {
    const mass = modules.shift()

    const fuel = Math.floor(mass / 3) - 2

    if (fuel <= 0) {
      continue
    }

    totalFuel += fuel

    modules.push(fuel)
  }

  console.log('Part 2:', totalFuel)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(calculateFuelRequirements(input))
