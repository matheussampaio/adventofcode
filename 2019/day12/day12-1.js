const fs = require('fs')

function simulateMotion(moons = [], steps = 1) {
  if (!steps) {
    return moons
  }

  console.log(`After ${steps} steps:`)
  moons.forEach((moon) => {
    console.log(`pos=${formatXYZ(moon.position)}, vel=${formatXYZ(moon.velocity)}`)
  })
  console.log()

  for (let i = 0; i < moons.length; i++) {
    for (let k = i + 1; k < moons.length; k++) {
      const moonA = moons[i]
      const moonB = moons[k]

      const axises = ['x', 'y', 'z']

      for (const axis of axises) {
        // if positions are the same, skip this axis
        if (moonA.position[axis] === moonB.position[axis]) {
          continue
        }

        const diffA = moonA.position[axis] < moonB.position[axis] ? 1 : -1
        const diffB = moonB.position[axis] < moonA.position[axis] ? 1 : -1

        moonA.velocity[axis] += diffA
        moonB.velocity[axis] += diffB
      }
    }
  }

  for (const moon of moons) {
    moon.position.x += moon.velocity.x
    moon.position.y += moon.velocity.y
    moon.position.z += moon.velocity.z
  }

  return simulateMotion(moons, steps - 1)
}

function potentitalEnergy(moon) {
  const { x, y, z } = moon.position

  return Math.abs(x) + Math.abs(y) + Math.abs(z)
}

function kineticEnergy(moon) {
  const { x, y, z } = moon.velocity

  return Math.abs(x) + Math.abs(y) + Math.abs(z)
}

function totalEnergy(moon) {
  return potentitalEnergy(moon) * kineticEnergy(moon)
}

function formatXYZ({ x, y, z } = {}) {
  return `<x=${x.toString().padStart(3, ' ')}, y=${y.toString().padStart(3, ' ')} z=${z
    .toString()
    .padStart(3, ' ')}>`
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
      }
    }))

  const moons = simulateMotion(data, 1000)

  console.log(moons.map(totalEnergy).reduce((sum, current) => sum + current, 0))
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

main(input)
