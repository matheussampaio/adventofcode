const fs = require('fs')

function findBestLocation(map) {
  const rows = map.split('\n')
  const asteroids = []

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]

    for (let c = 0; c < row.length; c++) {
      if (row[c] === '#') {
        asteroids.push({ x: c, y: r })
      }
    }
  }

  const bestCoord = asteroids
    .map((asteroid) => ({
      asteroid,
      visible: calcAsteroidsVisibleFrom(asteroid, asteroids)
    }))
    .sort((e1, e2) => e2.visible - e1.visible)[0]

  const destructionOrder = getDestructionOrder(bestCoord.asteroid, asteroids)

  const asteroid200th = destructionOrder[199]

  console.log(asteroid200th)

  console.log(`x * 100 + y =`, asteroid200th.x * 100 + asteroid200th.y)
}

function calcAsteroidsVisibleFrom(pos, asteroids) {
  return Object.values(getFoV(pos, asteroids)).length
}

function distanceTo(a1, a2) {
  return Math.abs(a1.x - a2.x) + Math.abs(a1.y - a2.y)
}

function getDestructionOrder(laserPosition, asteroids) {
  const FoV = getFoV(laserPosition, asteroids)

  for (const ang in FoV) {
    FoV[ang].sort((a1, a2) => {
      return distanceTo(laserPosition, a1) - distanceTo(laserPosition, a2)
    })
  }

  const anglesWithAsteroids = Object.keys(FoV)
    .map((n) => parseFloat(n, 10))
    .sort((n1, n2) => n1 - n2)

  const INITIAL_POS = -90

  while (anglesWithAsteroids[0] < INITIAL_POS) {
    anglesWithAsteroids.push(anglesWithAsteroids.shift())
  }

  const asteroidsDestroyed = []

  while (Object.keys(FoV).length) {
    const currentAngle = anglesWithAsteroids.shift()

    if (FoV[currentAngle] && FoV[currentAngle].length) {
      const asteroid = FoV[currentAngle].shift()

      asteroidsDestroyed.push(asteroid)
    } else {
      delete FoV[currentAngle]
    }

    anglesWithAsteroids.push(currentAngle)
  }

  return asteroidsDestroyed
}

function getFoV(pos, asteroids) {
  const FoV = {}

  for (const asteroid of asteroids) {
    if (pos.x === asteroid.x && pos.y === asteroid.y) {
      continue
    }

    const ang = angle(pos.x, pos.y, asteroid.x, asteroid.y)

    if (FoV[ang] == null) {
      FoV[ang] = []
    }

    FoV[ang].push(asteroid)
  }

  return FoV
}

function angle(cx, cy, ex, ey) {
  const dy = ey - cy
  const dx = ex - cx

  let theta = Math.atan2(dy, dx)

  theta *= 180 / Math.PI

  return theta
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

findBestLocation(input)
