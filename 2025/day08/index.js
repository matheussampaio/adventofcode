const { read, Node } = require("../utils");

function main(input, iterations = 10) {
  const nodes = input
    .trim()
    .lines()
    .map(line => line.split(',').map(Number))
    .map(nums => new Node(...nums))

  const distances = []

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      distances.push({ a: nodes[i], b: nodes[j], distance: nodes[i].distanceTo(nodes[j]) })
    }
  }

  distances.sort((a, b) => a.distance - b.distance)

  for (let i = 0; i < iterations; i++) {
    const { a, b } = distances[i]

    a.connect(b)
  }

  const queue = [...nodes]
  const groupsSizes = []

  do {
    const node = nodes.find(n => !n.visited)

    if (node == null) {
      break
    }

    const queue = [node]
    let groupSize = 0

    while (queue.length) {
      const node = queue.pop()

      if (node.visited) {
        continue
      }

      node.visited = true
      groupSize += 1

      queue.push(...node.neighbors)
    }

    groupsSizes.push(groupSize)
  } while (true)

  groupsSizes.sort((a, b) => b - a)

  console.log(groupsSizes)

  return groupsSizes.slice(0, 3).reduce((sum, curr) => sum * curr, 1)
}

const input = read(`${__dirname}/input.txt`);

const example = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`

console.log(main(example));
console.log(main(input, 1000));
