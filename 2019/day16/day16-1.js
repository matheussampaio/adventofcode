const fs = require('fs')

function FFT(signal) {
  const newSignal = []

  let it = 0

  for (let p = 1; p <= signal.length; p++) {
    let sum = 0

    for (let g = p - 1; g < signal.length; g += p) {
      const value = Math.floor((g + 1) / p) % 4

      if (value === 0 || value === 2) {
        continue
      }

      const factor = value === 1 ? 1 : -1

      for (let k = 0; k < p && g + k < signal.length; k++) {
        const num = signal[g + k]

        if (value === 1) {
          sum += num
        } else {
          sum -= num
        }
      }
    }

    newSignal.push(Math.abs(sum % 10))
  }

  return newSignal
}

function main(input) {
  let signal = input
    .trim()
    .split('')
    .map((n) => parseInt(n, 10))

  for (let i = 0; i < 100; i++) {
    signal = FFT(signal)
  }

  const result = signal.slice(0, 8).join('')

  console.log(result)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

main(input)
