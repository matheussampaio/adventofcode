const fs = require('fs')

function xyz(input) {
  const lines = input.trim().split('\n')

  const dots = []
  const folds = []

  let X = 0
  let Y = 0

  for (const line of lines) {
    if (line.length === 0) {
      continue
    } else if (line.startsWith('fold')) {
      const [coord, n] = line.split(' ')[2].split('=')

      folds.push({ [coord]: parseInt(n, 10) })
    } else {
      const [x, y] = line.split(',').map((str) => parseInt(str, 10))

      X = Math.max(x + 1, X)
      Y = Math.max(y + 1, Y)

      dots.push({ x, y })
    }
  }

  const paper = []

  for (let y = 0; y < Y; y++) {
    paper.push(Array(X).fill(' '))
  }

  for (const dot of dots) {
    paper[dot.y][dot.x] = '█'
  }

  for (let i = 0; i < folds.length; i++) {
    const fold = folds[i]

    if (i === 1) {
      console.log(
        'Part 1:',
        paper
          .flat()
          .map((e) => (e === '█' ? 1 : 0))
          .reduce((sum, n) => sum + n, 0)
      )
    }

    if (fold.y != null) {
      for (let y = 1; fold.y + y < Y; y++) {
        for (let x = 0; x < X; x++) {
          if (paper[fold.y + y][x] === '█') {
            paper[fold.y - y][x] = '█'
            paper[fold.y + y][x] = ' '
          }
        }
      }
    }

    if (fold.x != null) {
      for (let y = 0; y < Y; y++) {
        for (let x = 1; fold.x + x < X; x++) {
          if (paper[y][fold.x + x] === '█') {
            paper[y][fold.x - x] = '█'
            paper[y][fold.x + x] = ' '
          }
        }
      }
    }
  }

  console.log('Part 2:')
  console.log(
    paper
      .map((row) => row.join(''))
      .filter((row) => row.indexOf('█') !== -1)
      .map((row) => row.replace(/ *$/g, ''))
      .join('\n')
  )
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

const example = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`

//xyz(example)
xyz(input)
