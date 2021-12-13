const fs = require('fs')

function simulateUniverse(moons = [], axis) {
  const initialState = moons.map((moon) => moon.toString()).join(',')

  let steps = 0

  while (true) {
    for (let i = 0; i < moons.length - 1; i++) {
      for (let k = i + 1; k < moons.length; k++) {
        const moonA = moons[i]
        const moonB = moons[k]

        if (moonA.position[axis] === moonB.position[axis]) {
          continue
        }

        const diffA = moonA.position[axis] < moonB.position[axis] ? 1 : -1
        const diffB = moonB.position[axis] < moonA.position[axis] ? 1 : -1

        moonA.velocity[axis] += diffA
        moonB.velocity[axis] += diffB
      }
    }

    for (const moon of moons) {
      moon.position[axis] += moon.velocity[axis]
    }

    const state = moons.map((moon) => moon.toString()).join(',')

    steps += 1

    if (initialState === state) {
      return steps
    }
  }
}

function lcm_two_numbers(x, y) {
  if (typeof x !== 'number' || typeof y !== 'number') return false
  return !x || !y ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y))
}

function gcd_two_numbers(x, y) {
  x = Math.abs(x)
  y = Math.abs(y)
  while (y) {
    var t = y
    y = x % y
    x = t
  }
  return x
}

function main(input) {
  const data = input
    .trim()
    .split('\n')
    .map((coord) => coord.match(/<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/))
    .map((result) => ({
      position: {
        x: parseInt(result[1], 10),
        y: parseInt(result[2], 10),
        z: parseInt(result[3], 10)
      },
      velocity: {
        x: 0,
        y: 0,
        z: 0
      },
      toString() {
        const p = this.position
        const v = this.velocity

        return `${p.x},${p.y},${p.z}-${v.x},${v.y},${v.z}`
      }
    }))

  const periods = ['x', 'y', 'z'].map((axis) => simulateUniverse(data, axis))

  console.log(periods)

  console.log(lcm_two_numbers(periods[0], lcm_two_numbers(periods[1], periods[2])))
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

main(input)
