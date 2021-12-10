const fs = require('fs')

const dp = {}

function grow(days = 0) {
  if (dp[days] != null) {
    return dp[days]
  }

  if (days <= 0) {
    return 0
  }

  dp[days] = 1 + grow(days - 7) + grow(days - 9)

  return dp[days]
}

function numberOfLanternFishes(input, days = 80) {
  const founders = input.split(',').map((n) => parseInt(n, 10))

  return founders.reduce((sum, curr) => sum + 1 + grow(days - curr), 0)
}

function numberOfLanternFishesNaive(input, days) {
  const lanternfishes = input.split(',').map((n) => parseInt(n, 10))

  for (let i = 0; i < days; i++) {
    let size = lanternfishes.length

    for (let k = 0; k < size; k++) {
      if (lanternfishes[k] === 0) {
        lanternfishes[k] = 6
        lanternfishes.push(8)
      } else {
        lanternfishes[k] -= 1
      }
    }
  }

  return lanternfishes.length
}

function coolIdeaFromReddit(input, days) {
  const ages = input.split(',').map((n) => parseInt(n, 10))

  const state = [0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (const age of ages) {
    state[age]++
  }

  for (let i = 0; i < days; i++) {
    state.push(state.shift())

    state[6] += state[8]
  }

  return state.reduce((sum, n) => sum + n, 0)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `3,4,3,1,2`

console.log(numberOfLanternFishes(example, 80))
console.log(numberOfLanternFishes(example, 256))

console.log(coolIdeaFromReddit(example, 80))
console.log(coolIdeaFromReddit(example, 256))

console.log(numberOfLanternFishes(input, 80))
console.log(numberOfLanternFishes(input, 256))
