const _ = require('lodash')

const { read } = require('../utils')

function findWorriedLevels(input, rounds, q2 = false) {
  const blocks = input.trim().split('\n\n')

  const monkeys = []

  for (const block of blocks) {
    const lines = block.split('\n')

    const items = lines[1].match(/\d.+/)[0].split(',').map(Number)

    const n = parseInt(lines[2].match(/\d+/)?.[0] ?? 0, 10)

    const div = parseInt(lines[3].match(/\d+/)[0], 10)
    const t1 = parseInt(lines[4].match(/\d+/)[0], 10)
    const t2 = parseInt(lines[5].match(/\d+/)[0], 10)

    let op = null

    if (lines[2].indexOf('old * old') !== -1) {
      op = i => (i * i)
    } else if (lines[2].indexOf('+') !== -1) {
      op = i => (i + n)
    } else {
      op = i => (i * n)
    }

    monkeys.push({ items, op, div, t1, t2, times: 0, })
  }

  const mod = monkeys.reduce((mod, monkey) => mod * monkey.div, 1)

  for (let i = 0; i < rounds; i++) {
    for (const monkey of monkeys) {
      while (monkey.items.length) {
        monkey.times += 1

        let item = monkey.op(monkey.items.shift())

        if (q2) {
          item = item % mod
        } else {
          item = Math.floor(item / 3)
        }

        const target = item % monkey.div === 0 ? monkey.t1 : monkey.t2

        monkeys[target].items.push(item)
      }
    }
  }

  return monkeys
    .map(m => m.times)
    .desc()
    .slice(0, 2)
    .mult()
}

const input = read(`${__dirname}/input.txt`)

const example = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`

console.log(findWorriedLevels(example, 20))
console.log(findWorriedLevels(input, 20))

console.log(findWorriedLevels(example, 10000, true))
console.log(findWorriedLevels(input, 10000, true))
