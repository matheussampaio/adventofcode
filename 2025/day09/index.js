const { read, Grid } = require("../utils");

function getRectangleArea(x1, y1, x2, y2) {
  return Math.abs(x1 - x2 + 1) * Math.abs(y1 - y2 + 1)
}

function isPointInsideRectangle(x, y, grid) {
  // if the point is in the border, consider it inside
  if (grid.get(x, y).value === '#') {
    return true
  }

  let intersections = 0
  let isOnEdge = false

  for (let i = x; i >= -1; i--) {
    if (grid.get(x + i, y)?.value === '#') {
      isOnEdge = true
    } else if (isOnEdge) {
      intersections++
      isOnEdge = false
    }
  }

  return intersections % 2 === 1
}

function main(input, partTwo = false) {
  const points = input.lines().map(line => line.split(',').map(Number))

  const areas = []

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const [x1, y1] = points[i]
      const [x2, y2] = points[j]

      const area = getRectangleArea(x1, y1, x2, y2)

      areas.push({ area, i, j })
    }
  }

  areas.sort((a, b) => b.area - a.area)

  if (!partTwo) {
    return areas[0].area
  }

  console.log('creating grid')

  const maxX = Math.max(...points.map(point => point[0]))
  const maxY = Math.max(...points.map(point => point[1]))

  // adding a extra row and column to avoid boundary checks
  const grid = new Grid(maxX + 1, maxY + 1)

  console.log('adding borders')
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[(i + 1) % points.length]

    if (x1 === x2) {
      // move horizontally
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        grid.get(x1, y).value = '#'
      }
    }

    if (y1 === y2) {
      // move vertically
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        grid.get(x, y1).value = '#'
      }
    }
  }

  console.log('filling grid')

  const queue = points
    .slice(0, 10)
    .map(([x, y]) => [x + 1, y + 1])
    .filter(([x, y]) => isPointInsideRectangle(x, y, grid))
    .map(([x, y]) => grid.get(x, y))

  while (queue.length) {
    const cell = queue.shift()

    if (cell.value === '#') {
      continue
    }

    cell.value = '#'

    queue.push(...cell.neighbors.filter(c => c.value === '.'))
  }

  let maxArea = 0

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const [x1, y1] = points[i]
      const [x2, y2] = points[j]

      if (grid.get(x1, y2).value !== '#' || grid.get(x2, y1).value !== '#') {
        continue
      }

      maxArea = Math.max(maxArea, getRectangleArea(x1, y1, x2, y2))
    }
  }

  return maxArea
}

const input = read(`${__dirname}/input.txt`);

const example = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`

// console.log(main(example));
// console.log(main(input));

// console.log(main(example, true));
console.log(main(input, true));
