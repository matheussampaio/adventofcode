const _ = require('lodash')

const { read } = require('../utils')

const memo = {}

function main(input, partTwo = false) {
  const arragements = input
    .trim()
    .split('\n')
    .map((line) => {
      let [cfg, right] = line.split(' ')

      if (partTwo) {
        cfg = ('?' + cfg).repeat(5).slice(1)
        right = (',' + right).repeat(5).slice(1)
      }

      return count(cfg, right.split(',').int())
    })
    .sum()

  return arragements
}

function count(cfg, nums) {
  if (cfg === '') {
    return nums.empty() ? 1 : 0
  }

  if (nums.empty()) {
    return cfg.indexOf('#') === -1 ? 1 : 0
  }

  const key = `${cfg}-${nums}`

  if (memo[key] != null) {
    return memo[key]
  }

  let result = 0

  if (cfg[0] === '.' || cfg[0] === '?') {
    result += count(cfg.slice(1), nums.copy())
  }

  if (cfg[0] === '#' || cfg[0] === '?') {
    if (
      nums[0] <= cfg.length &&
      cfg.slice(0, nums[0]).indexOf('.') === -1 &&
      (nums[0] === cfg.length || cfg[nums[0]] !== '#')
    ) {
      result += count(cfg.slice(nums[0] + 1), nums.slice(1))
    }
  }

  memo[key] = result

  return result
}

const input = read(`${__dirname}/input.txt`)

const example = `.# 1
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`

console.log(main(example))
console.log(main(input))

console.log(main(example, true))
console.log(main(input, true))
