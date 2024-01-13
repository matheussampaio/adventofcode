const _ = require('lodash')

const { read } = require('../utils')

class Hand {
  constructor(hand, bet, { jokers = false } = {}) {
    this.hand = hand
    this.bet = bet
    this.jokers = jokers ? _.chain(this.hand).split('').filter(c => c === 'J').size().value() : 0

    this.transform = this.hand
      .split('')
      .map(c => {
        switch (c) {
          case 'A': return 14
          case 'K': return 13
          case 'Q': return 12
          case 'J': return jokers ? 1 : 11
          case 'T': return 10
          default: return c.int()
        }
      })

    this.type = this.getType()
  }

  hasFiveOfAKind() {
    if (this.jokers >= 5)
      return true

    return _.chain(this.hand).split('').filter(c => c !== 'J').groupBy().values().some(card => card.length >= 5 - this.jokers).value()
  }

  hasFourOfAKind() {
    if (this.jokers >= 4)
      return true

    return _.chain(this.hand).split('').filter(c => c !== 'J').groupBy().values().some(card => card.length >= 4 - this.jokers).value()
  }

  hasFullHouse() {
    if (this.jokers === 1)
      return _.chain(this.hand).split('').filter(c => c !== 'J').groupBy().values().reduce((sum, card) => card.length === 2 ? sum + 1 : sum, 0).value() === 2 ||
      _.chain(this.hand).split('').filter(c => c !== 'J').groupBy().values().reduce((sum, card) => card.length === 3 ? sum + 1 : sum, 0).value() === 1

    if (this.jokers === 2)
      return _.chain(this.hand).split('').filter(c => c !== 'J').groupBy().values().reduce((sum, card) => card.length === 2 ? sum + 1 : sum, 0).value() === 1 ||
      _.chain(this.hand).split('').filter(c => c !== 'J').groupBy().values().reduce((sum, card) => card.length === 3 ? sum + 1 : sum, 0).value() === 1

    if (this.jokers >= 3)
      return true

    const hasThreeOfAKind = _.chain(this.hand).split('').groupBy().values().some(card => card.length === 3).value()
    const hasTwoOfAKind = _.chain(this.hand).split('').groupBy().values().some(card => card.length === 2).value()

    return hasThreeOfAKind && hasTwoOfAKind
  }

  hasThreeOfAKind() {
    if (this.jokers >= 3)
      return true

    return _.chain(this.hand).split('').filter(c => c !== 'J').groupBy().values().some(card => card.length >= 3 - this.jokers).value()
  }

  hasTwoPairs() {
    if (this.jokers >= 3)
      return true

    if (this.jokers === 1 || this.jokers === 2)
      return _.chain(this.hand).split('').filter(c => c !== 'J').groupBy().values().reduce((sum, card) => card.length === 2 ? sum + 1 : sum, 0).value() === 1

    return _.chain(this.hand).split('').groupBy().values().reduce((sum, card) => card.length === 2 ? sum + 1 : sum, 0).value() === 2
  }

  hasPair() {
    if (this.jokers >= 1)
      return true

    return _.chain(this.hand).split('').groupBy().values().reduce((sum, card) => card.length === 2 ? sum + 1 : sum, 0).value() === 1
  }

  hasHighCard() {
    return _.chain(this.hand).split('').groupBy().values().size().value()
  }

  getType() {
    if (this.hasFiveOfAKind()) {
      return 6
    } else if (this.hasFourOfAKind()) {
      return 5
    } else if (this.hasFullHouse()) {
      return 4
    } else if (this.hasThreeOfAKind()) {
      return 3
    } else if (this.hasTwoPairs()) {
      return 2
    } else if (this.hasPair()) {
      return 1
    } else if (this.hasHighCard()) {
      return 0
    }
  }

  compareTo(other) {
    if (this.type !== other.type) {
      return this.type - other.type
    }

    const left = this.transform
    const right = other.transform

    for (let i = 0; i < 5; i++) {
      if (left[i] === right[i]) {
        continue
      }

      return left[i] - right[i]
    }

    return 0
  }

  toString() {
    return `${this.hand} (${this.bet}) [J: ${this.jokers}]: ${this.type}`
  }
}

function main(input, partTwo = false) {
  const hands = input
    .trim()
    .split('\n')
    .map(line => line.split(' '))
    .map(([hand, bet]) => new Hand(hand, bet.int(), { jokers: partTwo }))
    .sort((a, b) => a.compareTo(b))

  // hands.forEach(h => console.log(h.toString()))

  return hands.reduce((n, hand, i) => n + hand.bet * (i + 1), 0)
}

const input = read(`${__dirname}/input.txt`)

const example = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

console.log(main(example))
console.log(main(input))

console.log(main(example, true))
console.log(main(input, true))
