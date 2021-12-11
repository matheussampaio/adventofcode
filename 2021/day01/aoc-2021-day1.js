const fs = require('fs')

function deapthIncreaseFrequence(input) {
  const report = input
    .trim()
    .split('\n')
    .map((line) => parseInt(line, 10))

  let frequency = 0

  for (let i = 1; i < report.length; i++) {
    if (report[i - 1] < report[i]) {
      frequency++
    }
  }

  return frequency
}

function threeMeasurementSlidingWindowIncreaseFrequence(input) {
  const report = input
    .trim()
    .split('\n')
    .map((line) => parseInt(line, 10))

  let frequency = 0

  for (let i = 1; i < report.length - 2; i++) {
    const previousSlidingWindow = report.slice(i - 1, i - 1 + 3)
    const currentSlidingWindow = report.slice(i, i + 3)

    const previousSlidingWindowSum = previousSlidingWindow.reduce((n, sum) => sum + n, 0)
    const currentSlidingWindowSum = currentSlidingWindow.reduce((n, sum) => sum + n, 0)

    if (previousSlidingWindowSum < currentSlidingWindowSum) {
      frequency++
    }
  }

  return frequency
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `199
200
208
210
200
207
240
269
260
263`

// console.log(deapthIncreaseFrequence(example))
// console.log(deapthIncreaseFrequence(input))

// console.log(threeMeasurementSlidingWindowIncreaseFrequence(example))
console.log(threeMeasurementSlidingWindowIncreaseFrequence(input))
