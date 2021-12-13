const fs = require('fs')

function isValidPassword(policy, password) {
  const lettersInPolicy = password.split('').filter((letter) => letter === policy.letter).length

  return lettersInPolicy >= policy.min && lettersInPolicy <= policy.max
}

function isValidOficialTobogganCorporatePolicyPassword(policy, password) {
  const letterA = policy.min <= password.length ? password[policy.min - 1] : ''
  const letterB = policy.max <= password.length ? password[policy.max - 1] : ''

  if (letterA === policy.letter && letterB !== policy.letter) {
    return true
  }

  if (letterA !== policy.letter && letterB === policy.letter) {
    return true
  }

  return false
}

function part1(input) {
  return input
    .trim()
    .split('\n')
    .filter((line) => {
      const [minMax, letter, password] = line.trim().split(' ')

      const [min, max] = minMax.split('-')

      const policy = {
        letter: letter[0],
        min: parseInt(min, 10),
        max: parseInt(max, 10)
      }

      return isValidPassword(policy, password)
    }).length
}

function part2(input) {
  return input
    .trim()
    .split('\n')
    .filter((line) => {
      const [minMax, letter, password] = line.trim().split(' ')

      const [min, max] = minMax.split('-')

      const policy = {
        letter: letter[0],
        min: parseInt(min, 10),
        max: parseInt(max, 10)
      }

      return isValidOficialTobogganCorporatePolicyPassword(policy, password)
    }).length
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(part1(input))
console.log(part2(input))
