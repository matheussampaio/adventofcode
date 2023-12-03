const { read } = require('../utils')

function main(input) {

  return input.trim().split('\n')
    .map(line => {
      const id = parseInt(line.match(/Game (\d+):/)[1], 10)

      const sets = line.replace(/Game \d+: /, '')
        .split(';')
        .map(set => ({
          red: parseInt(set.match(/(\d+) red/)?.[1] ?? '0', 10),
          green: parseInt(set.match(/(\d+) green/)?.[1] ?? '0', 10),
          blue: parseInt(set.match(/(\d+) blue/)?.[1] ?? '0', 10),
        }))

      return { id, sets }
    })
    // part 1
    // .filter(game => !game.sets.some(set => set.red > 12 || set.green > 13 || set.blue > 14))
    // .map(game => game.id)

    // part 2
    .map(game => ({
      red: Math.max(...game.sets.map(s => s.red)),
      green: Math.max(...game.sets.map(s => s.green)),
      blue: Math.max(...game.sets.map(s => s.blue)),
    }))
    .map(game => game.red * game.green * game.blue)

    .reduce((sum, curr) => sum + curr, 0)
}
const input = read(`${__dirname}/input.txt`)

const example = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

console.log(JSON.stringify(main(example)))
console.log(main(input))
