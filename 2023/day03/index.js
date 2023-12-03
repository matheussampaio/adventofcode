const { read } = require('../utils')

function main(input) {
  const schematic = input.trim().split('\n').map(line => line.split(''))
  const symbols = {}

  for (let y = 0; y < schematic.length; y++) {
    for (let x = 0; x < schematic[y].length; x++) {
      const symbol = schematic[y][x]

      if (symbol !== '.' && !symbol.match(/\d/)) {
        symbols[`${x},${y}`] = { x, y, symbol, n: [] }
      }
    }
  }

  const partNumbers = []

  for (let y = 0; y < schematic.length; y++) {
    let partNumber = ''
    let neighboorsSymbols = new Set()

    for (let x = 0; x < schematic[y].length; x++) {
      const element = schematic[y][x]

      if (element.match(/\d/)) {
        partNumber += element

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const symbol = symbols[`${x + dx},${y + dy}`]

            if (symbol) {
              neighboorsSymbols.add(symbol)
            }
          }
        }

      } else if (partNumber.length) {
        if (neighboorsSymbols.size) {
          partNumbers.push(partNumber.int())

          for (const symbol of neighboorsSymbols) {
            symbol.n.push(partNumber.int())
          }
        }

        partNumber = ''
        neighboorsSymbols = new Set()
      }
    }

    if (partNumber.length && neighboorsSymbols.size) {
      partNumbers.push(partNumber.int())

      for (const symbol of neighboorsSymbols) {
        symbol.n.push(partNumber.int())
      }
    }
  }

  const part1 = partNumbers
    .reduce((sum, curr) => sum + curr, 0)

  console.info(`Part 1: ${part1}`)

  const part2 = Object.values(symbols)
    .filter(s => s.symbol === '*' && s.n.length === 2)
    .map(s => s.n.reduce((mult, curr) => mult * curr, 1))
    .reduce((sum, curr) => sum + curr, 0)

  pprint(part2)

  console.info(`Part 2: ${part2}`)
}

const DEBUG = true

function pprint(o) {
  if (!DEBUG) {
    return
  }

  console.log(JSON.stringify(o))
}

const input = read(`${__dirname}/input.txt`)

const example = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

main(example)
main(input)
