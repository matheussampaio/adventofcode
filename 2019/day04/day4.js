const fs = require('fs')

function isValidPassword(pass) {
  for (let i = 1; i < pass.length; i++) {
    if (pass[i - 1] > pass[i]) {
      return false
    }
  }

  let twoAdjIsSame = false

  for (let i = 1; i < pass.length; i++) {
    if (pass[i - 1] === pass[i]) {
      twoAdjIsSame = true
    }
  }

  if (!twoAdjIsSame) {
    return false
  }

  let hasDouble = false
  let current = pass[0]
  let count = 1

  for (let i = 1; i < pass.length; i++) {
    if (pass[i - 1] != pass[i]) {
      if (count === 2) {
        hasDouble = true
      }

      count = 1
      current = pass[i]
    } else {
      count += 1
    }
  }

  if (count === 2) {
    hasDouble = true
  }

  if (!hasDouble) {
    return false
  }

  return true
}

function findPassowrd(input) {
  const [start, end] = input
    .trim()
    .split('-')
    .map((str) => parseInt(str, 10))

  let c = 0

  for (let i = start; i <= end; i++) {
    if (isValidPassword(i.toString())) {
      c += 1
    }
  }

  return c
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(findPassowrd(input))
