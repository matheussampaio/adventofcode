const _ = require('lodash')

const { read } = require('../utils')

function countVisibleTrees(input) {
  const grid = input.trim()
    .split('\n')
    .map(row => row.split('').map(Number))

  let visibleTrees = 0

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (isTreeVisible(grid, x, y)) {
        visibleTrees += 1
      }
    }
  }

  return visibleTrees
}

function findTreeWithBestView(input) {
  const grid = input.trim()
    .split('\n')
    .map(row => row.split('').map(Number))

  let bestSenicScore = 0

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const score = scenicScore(grid, x, y)

      if (score > bestSenicScore) {
        bestSenicScore = score
      }
    }
  }

  return bestSenicScore
}

function isTreeVisible(grid, x, y) {
  // edges are always visible
  if (x === 0 || y === 0 || y === grid.length - 1 || x === grid[y].length - 1) {
    return true
  }

  // is visible from north
  const isVisibleFromNorth = _.range(0, y)
    .map(dy => grid[dy][x])
    .every(n => n < grid[y][x])

  if (isVisibleFromNorth) {
    return true
  }

  // is visible from south
  const isVisibleFromSouth = _.range(y + 1, grid.length)
    .map(dy => grid[dy][x])
    .every(n => n < grid[y][x])

  if (isVisibleFromSouth) {
    return true
  }

  // is visible from west
  const isVisibleFromWest = _.range(0, x)
    .map(dx => grid[y][dx])
    .every(n => n < grid[y][x])

  if (isVisibleFromWest) {
    return true
  }

  // is visible from east
  const isVisibleFromEast = _.range(x + 1, grid.length)
    .map(dx => grid[y][dx])
    .every(n => n < grid[y][x])

  if (isVisibleFromEast) {
    return true
  }

  return false
}

function scenicScore(grid, x, y) {
  // edges are always visible
  if (x === 0 || y === 0 || y === grid.length - 1 || x === grid[y].length - 1) {
    return true
  }

  let score = 1

  let north = 0

  // scenic score from north
  for (let dy = y - 1; dy >= 0; dy--) {
    north += 1

    if (grid[dy][x] >= grid[y][x]) {
      break
    }
  }

  score *= north

  let south = 0

  // scenic score from south
  for (let dy = y + 1; dy < grid.length; dy++) {
    south += 1

    if (grid[dy][x] >= grid[y][x]) {
      break
    }
  }

  score *= south

  let west = 0

  // scenic score from west
  for (let dx = x - 1; dx >= 0; dx--) {
    west += 1

    if (grid[y][dx] >= grid[y][x]) {
      break
    }
  }

  score *= west

  let east = 0

  // scenic score from east
  for (let dx = x + 1; dx < grid[y].length; dx++) {
    east += 1

    if (grid[y][dx] >= grid[y][x]) {
      break
    }
  }

  score *= east

  return score
}

const input = read(`${__dirname}/input.txt`)

const example =
`30373
25512
65332
33549
35390`

console.log(countVisibleTrees(example))
console.log(countVisibleTrees(input))

console.log(findTreeWithBestView(example))
console.log(findTreeWithBestView(input))
