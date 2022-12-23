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

  // const queues = {}

  // _.range(steps + 1).forEach((n) => queues[n] = [])

  // queues[1].push({ steps, at: valves.AA, flow: 0, on: {} })
  const queue = [{ steps, at: valves.AA, flow: 0, on: {} }]

  let maxFlow = 0

  // for (let i = 1; i <= steps; i++) {
  //   console.log('processing size', i)
  //   console.log(`before prune, queue has ${queues[i].length} items`)

    // const queue = queues[1].sort((t1, t2) => t2.flow - t1.flow).slice(0, 10000)

    while (queue.length) {
      const c = queue.pop()

      console.log(c)

      if (c.flow > maxFlow) {
        maxFlow = c.flow
      }

      if (c.steps <= 0) {
        continue
      }

      // go everywhere without turning on this valve
      for (const tunnel of c.at.tunnels) {
        queue.push({
          steps: c.steps - 1,
          at: valves[tunnel],
          flow: c.flow,
          on: {
            ...c.on
          }
        })
      }

      // only if current valve is OFF
      if (c.on[c.at.id] == null && c.flow > 0) {
        c.on[c.at.id] = true
        c.steps -= 1
        c.flow += c.steps * c.at.rate

        for (const tunnel of c.at.tunnels) {
          queue.push({
            steps: c.steps - 1,
            at: valves[tunnel],
            flow: c.flow,
            on: {
              ...c.on
            }
          })
        }
      }
    }
  // }

  return { maxFlow }
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

console.log(calc1(example))
// console.log(calc1(input))
