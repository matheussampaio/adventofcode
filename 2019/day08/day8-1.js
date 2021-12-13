const fs = require('fs')
const _ = require('lodash')

function day8(input, width, height) {
  input = input.trim()
  const layers = []

  for (let w = 0; w < input.length; w += width * height) {
    const layer = input.substring(w, w + width * height)

    layers.push(layer)
  }

  layers.sort((l1, l2) => {
    const l1Zeros = l1.split('').filter((e) => e === '0').length
    const l2Zeros = l2.split('').filter((e) => e === '0').length

    return l1Zeros - l2Zeros
  })

  const layerWithMostZeros = layers[0]

  const lOnes = layerWithMostZeros.split('').filter((e) => e === '1').length
  const lTwos = layerWithMostZeros.split('').filter((e) => e === '2').length

  return lOnes * lTwos
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(day8(input, 25, 6))
