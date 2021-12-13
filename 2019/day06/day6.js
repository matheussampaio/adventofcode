const fs = require('fs')
function checksum(map) {
  const orbits = {}

  for (const orbit of map) {
    const [a, b] = orbit.split(')')

    orbits[b] = a
  }

  const myOrbit = getPathToCOM('YOU', orbits)
  const santaOrbit = getPathToCOM('SAN', orbits)

  let common = null
  let hops = 0

  for (let i = 0; i < myOrbit.length; i++) {
    if (santaOrbit.includes(myOrbit[i])) {
      common = myOrbit[i]
      hops = i - 1
      break
    }
  }

  for (let i = 0; i < santaOrbit.length; i++) {
    if (santaOrbit[i] === common) {
      hops += i - 1
    }
  }

  return hops
}

function getPathToCOM(start, orbits) {
  let position = start

  const path = []

  while (orbits[position]) {
    path.push(position)
    position = orbits[position]
  }

  return path
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(checksum(input.trim().split('\n')))
