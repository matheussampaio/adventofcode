const fs = require('fs')
const _ = require('lodash')

function day8(input, width, height) {
  input = input.trim()

  const layers = []

  for (let w = 0; w < input.length; w += width * height) {
    const layer = input.substring(w, w + width * height)

    layers.push(layer)
  }

  const visible = []

  const TRANSPARENT = '2'
  const WHITE = '1'
  const BLACK = '0'

  for (let i = 0; i < layers[0].length; i++) {
    let visiblePixel = TRANSPARENT

    for (let k = 0; k < layers.length; k++) {
      const layer = layers[k]
      const pixel = layer[i]

      if (visiblePixel === TRANSPARENT) {
        visiblePixel = pixel
      }
    }

    visible.push(visiblePixel)
  }

  for (let w = 0; w < width * height; w += width) {
    console.log(
      visible
        .slice(w, w + width)
        .map((e) => (e === '0' ? ' ' : '█'))
        .join('')
    )
  }

  console.log(visible.length, 25 * 6)
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(day8(input, 25, 6))
