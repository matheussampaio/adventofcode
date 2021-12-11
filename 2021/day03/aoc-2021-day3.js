const fs = require('fs')

function calculatePowerConsumption(input) {
  const reports = input.trim().split('\n')

  const rate = calculateRate(reports)

  const gammaRateBin = rate.map((bit) => (bit >= 0 ? '1' : '0')).join('')
  const epsilonRateBin = rate.map((bit) => (bit >= 0 ? '0' : '1')).join('')

  const gammaRate = parseInt(gammaRateBin, 2)
  const epsilonRate = parseInt(epsilonRateBin, 2)

  return gammaRate * epsilonRate
}

function calculateLifeSupportRating(input) {
  const reports = input.trim().split('\n')

  const oxygenGeneratorRating = findBy(reports, (e) => (e >= 0 ? '1' : '0'))
  const CO2ScrubberRating = findBy(reports, (e) => (e >= 0 ? '0' : '1'))

  return parseInt(oxygenGeneratorRating, 2) * parseInt(CO2ScrubberRating, 2)
}

function findBy(reports, fn) {
  let items = reports.slice()
  let bitPos = 0

  while (items.length > 1) {
    const rate = calculateRate(items)

    items = items.filter((e) => e[bitPos] === fn(rate[bitPos]))

    bitPos += 1
  }

  return items[0]
}

function calculateRate(reports) {
  const rate = Array(reports[0].length).fill(0)

  for (const report of reports) {
    for (let i = 0; i < report.length; i++) {
      rate[i] += report[i] === '0' ? -1 : +1
    }
  }

  return rate
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`

console.log(calculatePowerConsumption(example))
console.log(calculatePowerConsumption(input))

console.log(calculateLifeSupportRating(example))
console.log(calculateLifeSupportRating(input))
