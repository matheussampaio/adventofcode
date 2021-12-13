const fs = require('fs')

function dfs(cave, seen, caves, hasRepeatedCave) {
  if (cave === 'end') {
    return 1
  }

  let paths = 0

  for (const neighboor of caves[cave]) {
    if (neighboor.toUpperCase() === neighboor) {
      paths += dfs(neighboor, seen, caves, hasRepeatedCave)
      continue
    }

    if (!seen[neighboor]) {
      paths += dfs(neighboor, { ...seen, [neighboor]: true }, caves, hasRepeatedCave)
      continue
    }

    if (!hasRepeatedCave && neighboor !== 'start' && neighboor !== 'end') {
      paths += dfs(neighboor, { ...seen, [neighboor]: true }, caves, true)
    }
  }

  return paths
}

function xyz(input) {
  const lines = input.trim().split('\n')

  const caves = {}

  for (const line of lines) {
    const [from, to] = line.split('-')

    if (caves[from] == null) caves[from] = []
    if (caves[to] == null) caves[to] = []

    caves[from].push(to)
    caves[to].push(from)
  }

  console.log('Part 1', dfs('start', { start: true }, caves, true))
  console.log('Part 2', dfs('start', { start: true }, caves, false))
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`

console.log(xyz(example))
console.log(xyz(input))
