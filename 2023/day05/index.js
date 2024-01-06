const _ = require('lodash')

const { read } = require('../utils')

function main(input, partTwo = false) {
  const maps = {}

  const blocks = input
    .trim()
    .split('\n\n')
    .map(block => block.split('\n'))

  let seeds = blocks.shift()[0].replace('seeds: ', '').split(' ').int()

  if (partTwo) {
    const [s1, r1, s2, r2] = seeds

    seeds = []

    for (let i = s1; i < s1 + r1; i++) {
      seeds.push(i)
    }

    for (let i = s2; i < s2 + r2; i++) {
      seeds.push(i)
    }
  }

  console.log(seeds)

  for (const block of blocks) {
    const [from, to] = block[0].replace(' map:', '').split('-to-')

    _.defaults(maps, {
      [from]: [],
    })

    for (const line of block.slice(1)) {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = line.split(' ').int()

      maps[from].push({
        start: sourceRangeStart,
        end: sourceRangeStart + rangeLength,
        d: destinationRangeStart - sourceRangeStart
      })
    }
  }

  return seeds.map(n => findLocation(n, maps)).min()
}

function findLocation(seed, maps) {
  const soil = findNext(maps.seed, seed)
  const fertilizer = findNext(maps.soil, soil)
  const water = findNext(maps.fertilizer, fertilizer)
  const light = findNext(maps.water, water)
  const temperature = findNext(maps.light, light)
  const humidity = findNext(maps.temperature, temperature)
  const location = findNext(maps.humidity, humidity)

  return location
  // return {
  //   seed,
  //   soil,
  //   fertilizer,
  //   water,
  //   light,
  //   temperature,
  //   humidity,
  //   location
  // }
}

function findNext(arr, num) {
  const range = arr.find(r => r.start <= num && num < r.end)

  if (range == null) {
    return num
  }

  return range.d + num
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

// console.log(main(example, true))
// console.log(main(input, true))
