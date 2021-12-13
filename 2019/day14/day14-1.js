const fs = require('fs')

function getCost(reactions, amount = 1, quemical = 'FUEL', inventory = {}) {
  // console.log(inventory)

  if (inventory[quemical] == null) {
    inventory[quemical] = 0
  }

  // if the item is available
  if (amount <= inventory[quemical]) {
    inventory[quemical] -= amount

    // console.log('cost of', amount, quemical, 'is 0. since we have it!')
    return 0
  }

  // consume inventory
  const missingAmount = amount - inventory[quemical]
  inventory[quemical] = 0

  if (reactions[quemical].recipe.ORE) {
    const factor = Math.ceil(missingAmount / reactions[quemical].amount)

    const cost = reactions[quemical].recipe.ORE * factor

    inventory[quemical] += reactions[quemical].amount * factor - missingAmount

    // console.log('cost of', amount, quemical, 'is', cost)

    return cost
  }

  const materialCosts = []
  const factor = Math.ceil(missingAmount / reactions[quemical].amount)

  for (const material in reactions[quemical].recipe) {
    const amountNeeded = reactions[quemical].recipe[material] * factor

    // console.log('getting price of', amountNeeded, material, 'for', quemical)

    materialCosts.push(getCost(reactions, amountNeeded, material, inventory))
  }

  inventory[quemical] += reactions[quemical].amount * factor - missingAmount

  const cost = materialCosts.reduce((sum, current) => sum + current, 0)

  // console.log('cost of', amount, quemical, 'is', cost)

  return cost
}

function parseReactions(input) {
  const reactions = {}

  for (const reaction of input.split('\n')) {
    const [inputQuemicals, outputQuemicals] = reaction.split('=>')

    const recipe = {}

    for (const ingredient of inputQuemicals.split(',')) {
      const [n, name] = ingredient.trim().split(' ')

      recipe[name] = parseInt(n, 10)
    }

    const [n, name] = outputQuemicals.trim().split(' ')

    reactions[name] = { amount: parseInt(n, 10), recipe }
  }

  return reactions
}

function main() {
  const data = input.trim()

  console.log('result from my puzzle input:', getCost(parseReactions(data)))
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

main(input)
