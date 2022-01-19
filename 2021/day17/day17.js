const fs = require('fs')

function xyz(input) {
  const re = /(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/

  const match = input.trim().match(re)

  const x1 = parseInt(match[1], 10)
  const y1 = parseInt(match[3], 10)
  const x2 = parseInt(match[2], 10)
  const y2 = parseInt(match[4], 10)

  const area = {
    x1: Math.min(x1, x2),
    y1: Math.min(y1, y2),
    x2: Math.max(x1, x2),
    y2: Math.max(y1, y2)
  }

  let bestTop = Number.MIN_SAFE_INTEGER

  const goodShot = []

  for (let y = -500; y <= 500; y++) {
    for (let x = -500; x <= 500; x++) {
      const top = steps(x, y, area)

      if (top != null) {
        goodShot.push({ x, y })

        if (top > bestTop) {
          bestTop = top
        }
      }
    }
  }

  console.log('Part 1:', bestTop)
  console.log('Part 2:', goodShot.length)
}

function steps(dx, dy, area) {
  let x = 0
  let y = 0

  let top = Number.MIN_SAFE_INTEGER

  while (true) {
    x += dx
    y += dy

    if (y > top) {
      top = y
    }

    if (dx > 0) {
      dx -= 1
    } else if (dx < 0) {
      dx += 1
    }

    dy -= 1

    if (contains(area, x, y)) {
      return top
    }

    if (dx === 0 && (x < area.x1 || x > area.x2)) {
      return null
    }

    if (dx < 0 && x < area.x1) {
      return null
    }

    if (dx > 0 && x > area.x2) {
      return null
    }

    if (dy < 0 && y < area.y1) {
      return null
    }
  }
}

function contains(area, x, y) {
  if (x < area.x1 || x > area.x2) {
    return false
  }

  if (y < area.y1 || y > area.y2) {
    return false
  }

  return true
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `target area: x=20..30, y=-10..-5`

xyz(example)
xyz(input)
