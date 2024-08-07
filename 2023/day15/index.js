const _ = require('lodash')

const { read } = require('../utils')

function main(input, partTwo = false) {
  const steps = input.trim().split(',')

  if (!partTwo) {
    return steps.map(hash).sum()
  }

  const hashmap = {}

  for (const step of steps) {
    const cmd = step.indexOf('=') !== -1 ? '=' : '-'
    const [lens, focal] = step.split(cmd)

    const pos = hash(lens)

    const box = hashmap[pos] ?? (hashmap[pos] = [])

    const idx = box.findIndex((i) => i[0] === lens)

    if (cmd === '-' && idx !== -1) {
      box.splice(idx, 1)
    }

    if (cmd === '=' && idx === -1) {
      box.push([lens, focal])
    }

    if (cmd === '=' && idx !== -1) {
      box[idx][1] = focal
    }
  }

  let power = 0

  for (let i = 0; i <= 255; i++) {
    if (hashmap[i] == null) {
      continue
    }

    for (let l = 0; l < hashmap[i].length; l++) {
      const lens = hashmap[i][l]

      power += (i + 1) * (l + 1) * lens[1]
    }
  }

  return power
}

function hash(str) {
  return str.split('').reduce((sum, cur) => ((sum + cur.charCodeAt(0)) * 17) % 256, 0)
}

const input = read(`${__dirname}/input.txt`)

const example = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`

console.log(main(example))
console.log(main(input))

console.log(main(example, true))
console.log(main(input, true))
