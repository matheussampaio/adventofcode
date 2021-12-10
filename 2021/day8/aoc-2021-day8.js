const fs = require('fs')
const _ = require('lodash')

function decodeSegment(signal, output) {
  const counter = {}

  for (const letter of signal.replace(/ /g, '')) {
    if (counter[letter] == null) {
      counter[letter] = 0
    }

    counter[letter] += 1
  }

  let A, B, C, D, E, F, G

  for (const letter in counter) {
    // E is the only letter used for four digits
    if (counter[letter] === 4) {
      E = letter
    }

    // B is the only letter used for six digits
    if (counter[letter] === 6) {
      B = letter
    }

    // F is the only letter used for nine digits
    if (counter[letter] === 9) {
      F = letter
    }
  }

  const signalPatterns = signal.trim().split(' ')

  const one = signalPatterns.find((p) => p.length === 2).split('')
  const four = signalPatterns.find((p) => p.length === 4).split('')
  const seven = signalPatterns.find((p) => p.length === 3).split('')

  // The digit 1 uses C and F. The digit 7 uses A, C, and F. So the different letter must be A.
  A = _.differenceBy(seven, one)[0]

  // The digit 1 uses C and F. Since we know F from the counters, we can tell the other letter is C.
  C = one.find((letter) => letter != F)

  // The digit 4 uses B, C, D, and F. Since we know B, C, and F already, we can figure out D.
  D = four.find((letter) => ![B, C, F].includes(letter))

  // The only missing letter is now G. We can just see which one is missing.
  G = _.difference('abcdefg'.split(''), [A, B, C, D, E, F])[0]

  const digits = [
    [A, B, C, E, F, G].sort().join(''), // 0
    [C, F].sort().join(''), // 1
    [A, C, D, E, G].sort().join(''), // 2
    [A, C, D, F, G].sort().join(''), // 3
    [B, C, D, F].sort().join(''), // 4
    [A, B, D, F, G].sort().join(''), // 5
    [A, B, D, E, F, G].sort().join(''), // 6
    [A, C, F].sort().join(''), // 7
    'abcdefg', // 8
    [A, B, C, D, F, G].sort().join('') // 9
  ]

  return parseInt(
    output
      .trim()
      .split(' ')
      .map((code) => digits.indexOf(code.split('').sort().join('')))
      .join(''),
    10
  )
}

function countUniqueDigits(input) {
  const segments = input.trim().split('\n')

  let sum = 0

  for (const segment of segments) {
    const [signal, output] = segment.split(' | ')

    sum += decodeSegment(signal, output)
  }

  return sum
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`

console.log(countUniqueDigits(example))
console.log(countUniqueDigits(input))
