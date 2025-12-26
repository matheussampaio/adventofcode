const { read } = require("../utils");

function main(input) {
  let [firstBlock, ingredients] = input.split('\n\n')

  firstBlock = firstBlock
    .lines()
    .map(l => l.split('-').int())
    .sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1])

  const freshRanges = []

  for (const [s1, e1] of firstBlock) {
    const intersect = freshRanges.find(([s2, e2]) => (s2 <= s1 && s1 <= e2) || (s2 <= e1 && e1 <= e2))

    if (intersect != null) {
      intersect[0] = Math.min(s1, intersect[0])
      intersect[1] = Math.max(e1, intersect[1])
    } else {
      freshRanges.push([s1, e1])
    }
  }

  return freshRanges.map(r => r[1] - r[0] + 1).sum()
}

const input = read(`${__dirname}/input.txt`);

const example = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

console.log(main(example));
console.log(main(input));
