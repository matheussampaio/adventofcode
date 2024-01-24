const _ = require('lodash')

const { read } = require('../utils')

const COORDS = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0]
}

function main(input, partTwo = false) {
  const field = input
    .trim()
    .split('\n')
    .map((line) => line.trim().split(''))

  const [startX, startY] = findStart(field)

  const pipes = _.chain(COORDS)
    .keys()
    .map((moveTo) => walk(field, startX, startY, moveTo))
    .filter((item) => item !== null)
    .max()
    .value()

  const start = pipes[pipes.length - 1].moveTo
  const first = pipes[0].moveTo

  if (start === 'E' && first === 'N') {
    pipes[pipes.length - 1].pipe = 'J'
  }
  if (start === 'E' && first === 'E') {
    pipes[pipes.length - 1].pipe = '-'
  }
  if (start === 'E' && first === 'S') {
    pipes[pipes.length - 1].pipe = '7'
  }

  if (start === 'S' && first === 'E') {
    pipes[pipes.length - 1].pipe = 'L'
  }
  if (start === 'S' && first === 'S') {
    pipes[pipes.length - 1].pipe = '|'
  }
  if (start === 'S' && first === 'W') {
    pipes[pipes.length - 1].pipe = 'J'
  }

  if (start === 'W' && first === 'S') {
    pipes[pipes.length - 1].pipe = 'F'
  }
  if (start === 'W' && first === 'W') {
    pipes[pipes.length - 1].pipe = '-'
  }
  if (start === 'W' && first === 'N') {
    pipes[pipes.length - 1].pipe = 'L'
  }

  if (start === 'N' && first === 'W') {
    pipes[pipes.length - 1].pipe = '7'
  }
  if (start === 'N' && first === 'N') {
    pipes[pipes.length - 1].pipe = '|'
  }
  if (start === 'N' && first === 'E') {
    pipes[pipes.length - 1].pipe = 'F'
  }

  if (!partTwo) {
    return pipes.length / 2
  }

  const open = Array.create({ rows: field[0].length, columns: field.length, fill: '.' })

  for (const item of pipes) {
    open[item.y][item.x] = item.pipe
  }

  let inside = 0
  let isInside = false
  let isUp = false

  for (let y = 0; y < open.length; y++) {
    isInside = false

    for (let x = 0; x < open[y].length; x++) {
      const pipe = open[y][x]

      if (pipe === '.' && isInside) {
        inside += 1
        open[y][x] = 'X'
      }

      if (pipe === '-') {
        continue
      }

      if (pipe === '|') {
        isInside = !isInside
      }

      if (pipe === 'L') {
        isUp = true
      }

      if (pipe === 'F') {
        isUp = false
      }

      if (pipe === 'J') {
        if (isUp) {
        } else {
          isInside = !isInside
        }

        isUp = false
      }

      if (pipe === '7') {
        if (isUp) {
          isInside = !isInside
        }

        isUp = false
      }
    }
  }

  // console.log(open.map((r) => r.join('')).join('\n'))

  // const queue = []

  // for (const item of pipes) {
  //   if (item.moveTo === 'N' && open[item.y][item.x + 1] === OPEN) {
  //     queue.push([item.x + 1, item.y])
  //   }

  //   if (item.moveTo === 'E' && open[item.y + 1][item.x] === OPEN) {
  //     queue.push([item.x, item.y + 1])
  //   }

  //   if (item.moveTo === 'S' && open[item.y][item.x - 1] === OPEN) {
  //     queue.push([item.x - 1, item.y])
  //   }

  //   if (item.moveTo === 'W' && open[item.y - 1][item.x] === OPEN) {
  //     queue.push([item.x, item.y - 1])
  //   }
  // }

  // while (queue.length) {
  //   const [x, y] = queue.shift()

  //   if (open[y][x] !== OPEN) {
  //     continue
  //   }

  //   open[y][x] = INSIDE

  //   for (const [dx, dy] of Object.values(COORDS)) {
  //     if (open[y + dy][x + dx] === OPEN) {
  //       queue.push([x + dx, y + dy])
  //     }
  //   }
  // }

  console.log(
    open
      .map((row) =>
        row
          .map((c) => {
            const map = {
              F: '┌',
              J: '┘',
              '-': '─',
              '|': '│',
              L: '└',
              7: '┐'
            }

            return map[c] ?? c
          })
          .join('')
      )
      .join('\n')
  )

  // return _.chain(open)
  //   .map((row) => row.filter((c) => c === INSIDE).length)
  //   .sum()
  //   .value()

  return inside
}

function findStart(field) {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === 'S') {
        return [x, y]
      }
    }
  }
}

function walk(field, x, y, from) {
  let dx = x
  let dy = y
  let moveTo = from
  let pipe = null

  const path = []

  do {
    dx += COORDS[moveTo][0]
    dy += COORDS[moveTo][1]

    if (dy < 0 || dy >= field.length) {
      return null
    }

    if (dx < 0 || dx >= field[dy].length) {
      return null
    }

    pipe = field[dy][dx]

    path.push({ x: dx, y: dy, pipe, moveTo })

    // left
    if (moveTo === 'N' && pipe === '7') {
      moveTo = 'W'
    }

    // straight
    if (moveTo === 'N' && pipe === '|') {
      moveTo = 'N'
    }

    // right
    if (moveTo === 'N' && pipe === 'F') {
      moveTo = 'E'
    }

    // left
    if (moveTo === 'E' && pipe === 'J') {
      moveTo = 'N'
    }

    // straight
    if (moveTo === 'E' && pipe === '-') {
      moveTo = 'E'
    }

    // right
    if (moveTo === 'E' && pipe === '7') {
      moveTo = 'S'
    }

    // left
    if (moveTo === 'S' && pipe === 'L') {
      moveTo = 'E'
    }

    // straight
    if (moveTo === 'S' && pipe === '|') {
      moveTo = 'S'
    }

    // right
    if (moveTo === 'S' && pipe === 'J') {
      moveTo = 'W'
    }

    // left
    if (moveTo === 'W' && pipe === 'F') {
      moveTo = 'S'
    }

    // straight
    if (moveTo === 'W' && pipe === '-') {
      moveTo = 'W'
    }

    // right
    if (moveTo === 'W' && pipe === 'L') {
      moveTo = 'N'
    }
  } while (pipe !== 'S')

  return path
}

const input = read(`${__dirname}/input.txt`)

const examples = [
  `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`,
  `7-F7-
  .FJ|7
  SJLL7
  |F--J
  LJ.LJ`,
  `FF7FSF7F7F7F7F7F---7
     L|LJ||||||||||||F--J
     FL-7LJLJ||||||LJL-77
     F--JF--7||LJLJ7F7FJ-
     L---JF-JLJ.||-FJLJJ7
     |F|F-JF---7F7-L7L|7|
     |FFJF7L7F-JF7|JL---7
     7-L-JL7||F7|L7F-7F7|
     L.L7LFJ|||||FJL7||LJ
     L7JLJL-JLJLJL--JLJ.L`
]

examples.forEach((example) => console.log(main(example) + '\n'))
console.log(main(input) + '\n')

examples.forEach((example) => console.log(main(example, true) + '\n'))
console.log(main(input, true))
