const fs = require('fs')

function xyz(input, part2) {
  let map = input
    .trim()
    .split('\n')
    .map((r) => r.split('').map((s) => parseInt(s, 10)))

  let ROWS = map.length
  let COLS = map[0].length

  const d = [
    [0, 1, 2, 3, 4],
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
    [3, 4, 5, 6, 7],
    [4, 5, 6, 7, 8]
  ]

  if (part2) {
    let map2 = []

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const v = d[r][c]

        for (let y = 0; y < ROWS; y++) {
          if (map2[r * ROWS + y] == null) {
            map2[r * ROWS + y] = []
          }

          for (let x = 0; x < COLS; x++) {
            let n = map[y][x] + v

            if (n > 9) {
              n += 1
            }

            map2[r * ROWS + y].push(n % 10)
          }
        }
      }
    }

    map = map2
  }

  ROWS = map.length
  COLS = map[0].length

  const dist = []

  for (let i = 0; i < ROWS; i++) {
    dist.push(Array(COLS).fill(Number.MAX_SAFE_INTEGER))
  }

  dist[0][0] = 0

  const dx = [-1, 0, 1, 0]
  const dy = [0, 1, 0, -1]

  const queue = [[0, 0, 0]]

  while (queue.length) {
    const [x, y] = queue.shift()

    for (let i = 0; i < 4; i++) {
      const x1 = x + dx[i]
      const y1 = y + dy[i]

      if (x1 < 0 || x1 >= COLS) {
        continue
      }

      if (y1 < 0 || y1 >= ROWS) {
        continue
      }

      if (dist[y][x] + map[y1][x1] < dist[y1][x1]) {
        dist[y1][x1] = dist[y][x] + map[y1][x1]

        queue.push([x1, y1, dist[y1][x1]])
      }
    }
  }

  return dist[dist.length - 1][dist[0].length - 1]
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`

console.log('Part 1', xyz(example))
console.log('Part 2', xyz(example, true))

console.log('Part 1', xyz(input))
console.log('Part 2', xyz(input, true))
