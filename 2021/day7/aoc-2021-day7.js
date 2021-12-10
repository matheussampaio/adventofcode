const fs = require('fs')

function findBestPosition(input) {
  const positions = input.split(',').map((n) => parseInt(n, 10))

  positions.sort((a, b) => a - b)

  let best = null

  const dp = {}

  for (const pos in positions) {
    const dist = calculateDist(pos, positions, dp)

    if (best == null || dist < best.dist) {
      best = { dist, pos }
    }
  }

  return best
}

function calculateDist(n, numbers, dp = {}) {
  if (dp[n]) {
    return dp[n]
  }

  let sum = 0

  for (let e of numbers) {
    if (e !== n) {
      const i = Math.abs(n - e)

      sum += (i / 2) * (i + 1)
    }
  }

  dp[n] = sum

  return sum
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `16,1,2,0,4,2,7,1,2,14`

console.log(findBestPosition(example))
console.log(findBestPosition(input))
