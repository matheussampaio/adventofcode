const _ = require('lodash')

const { read } = require('../utils')

function calc(input, q2 = false) {
  let heightmap = input.trim().split('\n')
    .map(line => line.split(''))

  const HEIGHT = heightmap.length
  const WIDTH = heightmap[0].length

  let sx, sy, ex, ey

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (heightmap[y][x] === 'S') {
        [sx, sy] = [x, y]
        heightmap[y][x] = 'a'
      }

      if (heightmap[y][x] === 'E') {
        [ex, ey] = [x, y]
        heightmap[y][x] = 'z'
      }

      heightmap[y][x] = heightmap[y][x].charCodeAt(0) - 97
    }
  }

  const best = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => Number.MAX_SAFE_INTEGER))

  let queue = [{ at: [sx, sy], steps: 0, visited: {} }]

  if (q2) {
    queue = []

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (heightmap[y][x] === 0) {
         queue.push({ at: [x, y], steps: 0, visited: {} })
        }
      }
    }
  }

  const coords = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
  ]

  while (queue.length) {
    const { at, steps, visited } = queue.shift()

    const [x, y] = at

    const key = `${x},${y}`

    if (visited[key]) {
      continue
    }

    visited[key] = true

    if (steps >= best[y][x] || steps >= best[ey][ex]) {
      continue
    }

    best[y][x] = steps

    if (x === ex && y === ey) {
      continue
    }

    const neighboors = coords
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < WIDTH && ny < HEIGHT) // valid coords
      .filter(([nx, ny]) => heightmap[y][x] - heightmap[ny][nx] >= -1) // destination is below, same level, or one higher
      .filter(([nx, ny]) => visited[`${nx},${ny}`] == null) // not visited yet

    for (const neighboor of neighboors) {
      queue.push({
        steps: steps + 1,
        at: neighboor,
        visited: { ...visited }
      })
    }
  }

  return best[ey][ex]
}

const input = read(`${__dirname}/input.txt`)

const example = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`

console.log(calc(example))
console.log(calc(input))

console.log(calc(example, true))
console.log(calc(input, true))
