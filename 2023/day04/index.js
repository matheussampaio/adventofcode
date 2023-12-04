const _ = require('lodash')

const { read } = require('../utils')

function main(input, size = 5) {
  return input
    .trim()
    .split('\n')
    .map(line => [...line.matchAll(/(\d+)/g)].int())
    .map(numbers => ({ id: numbers[0], winningNumbers: numbers.slice(1, size + 1), numbersIHave: numbers.slice(size + 1) }))
    .map(cards => _.intersection(cards.winningNumbers, cards.numbersIHave))
    .map(cards => Math.floor(Math.pow(2, cards.length - 1)))
    .sum()
}

function main2(input, size = 5) {
  const cards = {}

  input
    .trim()
    .split('\n')
    .map(line => [...line.matchAll(/(\d+)/g)].int())
    .map(numbers => ({ id: numbers[0], winningNumbers: numbers.slice(1, size + 1), numbersIHave: numbers.slice(size + 1) }))
    .map(cards => ({ ...cards, winners: _.intersection(cards.winningNumbers, cards.numbersIHave).length, instances: 1 }))
    .forEach(card => cards[card.id] = card)

  for (const cardId in cards) {
    const card = cards[cardId]

    for (let i = 1; i <= card.winners; i++) {
      cards[cardId.int() + i].instances += card.instances
    }
  }

  return Object.values(cards).map(card => card.instances).sum()
}


const input = read(`${__dirname}/input.txt`)

const example = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

console.log(JSON.stringify(main(example)))
console.log(JSON.stringify(main(input, 10)))

console.log(JSON.stringify(main2(example)))
console.log(JSON.stringify(main2(input, 10)))
