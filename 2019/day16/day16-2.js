const fs = require('fs')

function FFT(signal, offset) {
  const newSignal = signal.slice()

  for (let i = signal.length - 2; i >= offset; i--) {
    newSignal[i] = (signal[i] + newSignal[i + 1]) % 10
  }

  return newSignal
}

function main(input) {
  let signal = ''

  const offset = parseInt(input.split('').slice(0, 7).join(''), 10)

  for (let i = 0; i < 10000; i++) {
    signal += input
  }

  signal = signal
    .trim()
    .split('')
    .map((n) => parseInt(n, 10))

  for (let i = 0; i < 100; i++) {
    signal = FFT(signal, offset)
  }

  console.log('result', signal.slice(offset, offset + 8).join(''))
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

main(input.trim())
