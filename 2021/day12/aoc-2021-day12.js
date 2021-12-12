const fs = require('fs')

class Cave {
  constructor(name) {
    this.name = name
    this.isBig = name.toUpperCase() === name

    this.connections = {}
  }

  add(cave) {
    this.connections[cave.name] = cave
  }
}

function PathFinder(from, to, canRepeat) {
  const paths = []
  const queue = [{ repeatedCave: false, path: [from] }]

  while (queue.length) {
    const { repeatedCave, path } = queue.pop()
    const cave = path[path.length - 1]

    for (const neighboorName in cave.connections) {
      const neighboor = cave.connections[neighboorName]

      // we can't visist start again.
      if (neighboor.name === from.name) {
        continue
      }

      // if reached the end, mark as possible path
      if (neighboor.name === to.name) {
        paths.push([...path, neighboor])

        continue
      }

      // we can always visit again the big caves
      if (neighboor.isBig) {
        queue.push({ repeatedCave, path: [...path, neighboor] })
        continue
      }

      const timesVisitedThisCave = path.filter((c) => c.name === neighboor.name).length

      // if we haven't visisted this cave, we can try it
      if (timesVisitedThisCave === 0) {
        queue.push({ repeatedCave, path: [...path, neighboor] })

        continue
      }

      // if we can't repeat caves, we should stop this path here.
      if (!canRepeat) {
        continue
      }

      // we can only repeat caves once
      if (timesVisitedThisCave >= 2) {
        continue
      }

      // we already repeated a cave this path, can't do it twice.
      if (repeatedCave) {
        continue
      }

      // otherwise, continue visiting
      queue.push({ repeatedCave: true, path: [...path, neighboor] })
    }
  }

  return paths
}

class CaveSystem {
  constructor() {
    this.caves = {}
  }

  add(from, to) {
    if (this.caves[from] == null) {
      this.caves[from] = new Cave(from)
    }

    if (this.caves[to] == null) {
      this.caves[to] = new Cave(to)
    }

    this.caves[from].add(this.caves[to])
    this.caves[to].add(this.caves[from])
  }
}

function xyz(input) {
  const lines = input.trim().split('\n')

  const caveSystem = new CaveSystem()

  for (const line of lines) {
    const [from, to] = line.split('-')

    caveSystem.add(from, to)
  }

  console.log('Part 1', PathFinder(caveSystem.caves.start, caveSystem.caves.end).length)
  console.log('Part 2', PathFinder(caveSystem.caves.start, caveSystem.caves.end, true).length)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`

// console.log(xyz(example))
console.log(xyz(input))
