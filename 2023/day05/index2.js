const _ = require('lodash')

const { read } = require('../utils')

function main(input) {
  const blocks = input
    .trim()
    .split('\n\n')
    .map(block => block.split('\n'))

  let seeds = blocks.shift()[0]
    .replace('seeds: ', '')
    .split(' ')
    .int()
    .chunk(2)
    .map(([start, length]) => [start, start + length - 1])
    .sort((a, b) => a[0] - b[0])

  const maps = {}

  for (const block of blocks) {
    const [from, to] = block[0].replace(' map:', '').split('-to-')

    _.defaults(maps, {
      [from]: [],
    })

    for (const line of block.slice(1)) {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = line.split(' ').int()

      maps[from].push([
        sourceRangeStart,
        sourceRangeStart + rangeLength - 1,
        destinationRangeStart - sourceRangeStart
      ])

      maps[from].sort()
    }
  }

  return _.chain(seeds)
    .map(range => expand(range, maps.seed)).flattenDeep().chunk(2)
    .map(range => expand(range, maps.soil)).flattenDeep().chunk(2)
    .map(range => expand(range, maps.fertilizer)).flattenDeep().chunk(2)
    .map(range => expand(range, maps.water)).flattenDeep().chunk(2)
    .map(range => expand(range, maps.light)).flattenDeep().chunk(2)
    .map(range => expand(range, maps.temperature)).flattenDeep().chunk(2)
    .map(range => expand(range, maps.humidity)).flattenDeep().chunk(2)
    .sort((a, b) => a[0] - b[0])
    .get(0)
    .get(0)
    .value()
}

function expand(range, transforms) {
  let [x, y] = range

  for (const [s, e, n] of transforms) {
    if (x >= s && y <= e) {
      return [[x + n, y + n]]
    }

    if (x < s && y >= s) {
      return [
        expand([x, s - 1], transforms),
        expand([s, y], transforms)
      ]
    }

    if (x <= e && y > e) {
      return [
        expand([x, e], transforms),
        expand([e + 1, y], transforms)
      ]
    }
  }

  return [[x, y]]
}

const input = read(`${__dirname}/input.txt`)

const example = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

console.log(main(example))
console.log(main(input))
