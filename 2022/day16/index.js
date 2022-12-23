const _ = require('lodash')

const { read } = require('../utils')

function calc1(input, steps = 30) {
  const dp = Array.from({ length: steps}, () => {})

  const valves = {}

  input.trim().split('\n').forEach(line => {
    const [id, rate, tunnels] = line.match(/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/).slice(1)

    valves[id] = {
      id,
      rate: parseInt(rate, 10),
      tunnels: tunnels.split(', ')
    }
  })

  for (let i = 1; i <= steps; i++) {
    for (const startingFrom in valves) {
      xyz(i, valves, startingFrom, i)
    }
  }

  return dp[steps - 1]['AA']
}

function xyz(dp, valves, startingFrom, steps) {
  if (steps <= 1) {
    return dp[steps][startingFrom] = 0
  }

  if (steps <= 2) {
    return dp[steps][startingFrom] = valves[startingFrom].rate
  }

  if (dp[steps][startingFrom]) {
    return dp[steps][startingFrom]
  }

  return dp[steps][startingFrom] = Math.max(
    ...valves[startingFrom].tunnels.map(v => xyz(dp, valves, v, steps - 1)), // maxOfGoingDirectlyToOtherValves
    ...valves[startingFrom].tunnels.map(v => xyz(dp, valves, v, steps - 2)).map(n => n + valves[startingFrom].rate), // maxOfGoingToOtherValvesAfterTurningCurrentValveOn
  )

  // const queue = [
  //   { steps, at: valves[startingFrom], flow: 0, on: {} }
  // ]

  // while (queue.length) {
  //   const c = queue.shift()

  //   if (c.flow > maxFlow) {
  //     maxFlow = c.flow
  //   }

  //   if (c.steps <= 0 || Object.keys(c.on).length >= Object.keys(valves).length) {
  //     continue
  //   }

  //   // go everywhere without turning on this valve
  //   for (const tunnel of c.at.tunnels) {
  //     queue.push({
  //       steps: c.steps - 1,
  //       at: valves[tunnel],
  //       flow: c.flow,
  //       on: {
  //         ...c.on
  //       }
  //     })
  //   }

  //   // only if current valve is OFF
  //   if (c.on[c.at.id] == null) {
  //     c.on[c.at.id] = true
  //     c.steps -= 1
  //     c.flow += c.steps * c.at.rate

  //     for (const tunnel of c.at.tunnels) {
  //       queue.push({
  //         steps: c.steps - 1,
  //         at: valves[tunnel],
  //         flow: c.flow,
  //         on: {
  //           ...c.on
  //         }
  //       })
  //     }
  //   }
  // }

  // return { maxFlow }
}

const input = read(`${__dirname}/input.txt`)

const example = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`

console.log(calc1(example, 1))
// console.log(calc1(input))
