const fs = require('fs')

class BITS {
  constructor(input) {
    if (typeof input === 'string') {
      this.buf = input
        .trim()
        .split('')
        .map((c) => parseInt(c, 16))
        .map((n) => n.toString(2))
        .map((s) => s.padStart(4, '0'))
        .join('')
        .split('')
    }

    if (typeof input === 'object') {
      this.buf = input
    }

    this.ap = 0
  }

  decode() {
    const version = this.readInt(3)
    const typeId = this.readInt(3)

    if (typeId === 4) {
      const value = this.readLiteralValue()

      return { version, typeId, value }
    }

    const operators = []
    const lengthTypeId = this.readInt(1)

    if (lengthTypeId === 1) {
      const numSubPackets = this.readInt(11)

      for (let i = 0; i < numSubPackets; i++) {
        operators.push(this.decode())
      }

      return { version, typeId, operators }
    }

    const totalLengthBits = this.readInt(15)

    const bits = new BITS(this.read(totalLengthBits))

    while (bits.ap < totalLengthBits) {
      operators.push(bits.decode())
    }

    return { version, typeId, operators }
  }

  static calc(packet) {
    switch (packet.typeId) {
      case 0:
        return packet.operators.reduce((sum, p) => sum + BITS.calc(p), 0)

      case 1:
        return packet.operators.reduce((product, p) => product * BITS.calc(p), 1)

      case 2:
        return Math.min(...packet.operators.map((p) => BITS.calc(p)))

      case 3:
        return Math.max(...packet.operators.map((p) => BITS.calc(p)))

      case 5:
        return BITS.calc(packet.operators[0]) > BITS.calc(packet.operators[1]) ? 1 : 0

      case 6:
        return BITS.calc(packet.operators[0]) < BITS.calc(packet.operators[1]) ? 1 : 0

      case 7:
        return BITS.calc(packet.operators[0]) === BITS.calc(packet.operators[1]) ? 1 : 0

      default:
        return packet.value
    }
  }

  readLiteralValue() {
    let bits = ''

    let fragment

    do {
      fragment = this.read(5)

      bits += fragment.slice(1, fragment.length).join('')
    } while (fragment[0] === '1')

    return parseInt(bits, 2)
  }

  read(length) {
    const bits = this.buf.slice(this.ap, this.ap + length)

    this.ap += length

    return bits
  }

  readInt(length) {
    const bits = this.read(length)

    return parseInt(bits.join(''), 2)
  }
}

function xyz(input) {
  const bits = new BITS(input)

  const packets = bits.decode()

  const queue = [packets]

  let sum = 0

  while (queue.length) {
    const operator = queue.shift()

    if (operator.operators) {
      queue.push(...operator.operators)
    }

    sum += operator.version
  }

  console.log('Part 1', sum)
  console.log('Part 2', BITS.calc(packets))
}

function int(buf, start, size) {
  return parseInt(buf.slice(start, start + size).join(''), 2)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

xyz(input)
