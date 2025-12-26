const { read } = require('../utils')
const _ = require('lodash')

function main(input, partTwo = false) {
  const map = input.lines().map((line) => line.split(''))

  const [gx, gy] = getStartingPoint(map)

  const visited = walk(map, gx, gy)

  if (!partTwo) {
    return Object.keys(visited).length
  }

  const baseline = Object.values(visited)
    .map((o) => Object.keys(o).length)
    .sum()

  // const baseline = 10000

  let loops = {}

  for (let i = 0; i < baseline; i++) {
    const result = walk(map.copy(), gx, gy, i)

    if (typeof result === 'string') {
      loops[result] = true
    }
  }

  return Object.keys(loops).length
}

function getStartingPoint(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '^') {
        return [x, y]
      }
    }
  }
}

function walk(map, gx, gy, blockAt) {
  let dir = 'up'

  let visited = {}

  let steps = 0

  let blockX, blockY

  while (gy >= 0 && gx >= 0 && gy < map.length && gx < map[gy].length) {
    const key = `${gx},${gy}`

    if (visited[key] == null) {
      visited[key] = {}
    }

    if (dir in visited[key]) {
      return `${blockX},${blockY}`
    }

    visited[key][dir] = true

    if (steps === blockAt) {
      if (dir === 'up' && map[gy - 1]?.[gx]) {
        map[gy - 1][gx] = '#'
        blockX = gx
        blockY = gy - 1
      } else if (dir === 'right' && map[gy][gx + 1]) {
        map[gy][gx + 1] = '#'
        blockX = gx + 1
        blockY = gy
      } else if (dir === 'down' && map[gy + 1]?.[gx]) {
        map[gy + 1][gx] = '#'
        blockX = gx
        blockY = gy + 1
      } else if (dir === 'left' && map[gy][gx - 1]) {
        map[gy][gx - 1] = '#'
        blockX = gx - 1
        blockY = gy
      }

      visited = {}
    }

    if (dir === 'up' && map[gy - 1]?.[gx] === '#') {
      dir = 'right'
    } else if (dir === 'right' && map[gy][gx + 1] === '#') {
      dir = 'down'
    } else if (dir === 'down' && map[gy + 1]?.[gx] === '#') {
      dir = 'left'
    } else if (dir === 'left' && map[gy][gx - 1] === '#') {
      dir = 'up'
    }

    if (dir === 'up') {
      gy -= 1
    } else if (dir === 'right') {
      gx += 1
    } else if (dir === 'down') {
      gy += 1
    } else if (dir === 'left') {
      gx -= 1
    }

    steps += 1
  }

  return visited
}

const input = read(`${__dirname}/input.txt`).trim()

const example = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`

console.log(main(example))
console.log(main(input))

console.log(main(example, true))
console.log(main(input, true))
