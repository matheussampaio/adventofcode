const _ = require('lodash')

const { read } = require('../utils')

function calc1(valves, targets, dt, steps) {
  const queue = [{ steps, at: valves.AA, flow: 0, on: {} }]

  let maxFlow = 0

  while (queue.length) {
    const c = queue.shift()

    if (c.flow > maxFlow) {
      maxFlow = c.flow
    }

    targets
      .filter(v => c.on[v.name] == null)
      .filter(v => c.steps - dt[c.at.name][v.name] >= 0)
      .forEach(v => {
        const steps = c.steps - dt[c.at.name][v.name] - 1

        queue.push({
          steps,
          at: valves[v.name],
          flow: c.flow + steps * valves[v.name].flow,
          on: {
            ...c.on,
            [v.name]: true
          }
        })
      })
  }

  return maxFlow
}

function createDistanceTable(valves) {
  const dt = {}

  for (const name in valves) {
    dt[name] = {}

    const queue = [[name, 0]]
    const visited = {}

    while (queue.length) {
      const [v, n] = queue.shift()

      if (visited[v]) {
        continue
      }

      visited[v] = true
      dt[name][v] = n

      for (const c of valves[v].tunnels) {
        queue.push([c, n + 1])
      }
    }
  }

  return dt
}

function calc2(valves, dt) {
  let bestScore = Infinity
  let bestLeft = null
  let bestRight = null

  const calcScore = (left, right) => {
    let score = 0

    for (let i = 0; i < left.length; i++) {
      for (let j = i + 1; j < left.length; j++) {
        score += dt[left[i].name][left[j].name]
      }
    }

    for (let i = 0; i < right.length; i++) {
      for (let j = i + 1; j < right.length; j++) {
        score += dt[right[i].name][right[j].name]
      }
    }

    return score
  }

  for (let i = 0; i < 100000; i++) {
    const left = []
    const right = []

    for (const v of Object.values(valves).filter(v => v.flow > 0)) {
      if (Math.random() > 0.33) {
        left.push(v)
      } else {
        right.push(v)
      }
    }

    const score = calcScore(left, right, dt)

    if (score < bestScore) {
      bestScore = score
      bestLeft = left
      bestRight = right
    }
  }

  return calc1(valves, bestLeft, dt, 26) + calc1(valves, bestRight, dt, 26)
}

function main(input) {
  let valves = {}

  input.trim().split('\n').forEach(line => {
    const [name, flow, tunnels] = line.match(/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/).slice(1)

    valves[name] = {
      name,
      flow: parseInt(flow, 10),
      tunnels: tunnels.split(', ')
    }
  })

  const dt = createDistanceTable(valves)

  console.log(calc1(valves, Object.values(valves).filter(v => v.flow > 0), dt, 30))
  console.log(calc2(valves, dt))
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

// main(example)
main(input)

