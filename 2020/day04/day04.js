const fs = require('fs')

function parsePassports(input) {
  let passports = []
  let passport = {}

  for (const line of input.trim().split('\n')) {
    if (line === '') {
      passports.push(passport)
      passport = {}

      continue
    }

    const fields = {}

    for (const field of line.split(' ')) {
      const [key, value] = field.split(':')

      passport[key] = value
    }
  }

  passports.push(passport)

  return passports
}

function hasRequiredFields(passport) {
  return (
    passport.byr != null &&
    passport.iyr != null &&
    passport.eyr != null &&
    passport.hgt != null &&
    passport.hcl != null &&
    passport.ecl != null &&
    passport.pid != null
  )
}

function hasValidFields(passport) {
  const byr = parseInt(passport.byr, 10)

  if (byr < 1920 || byr > 2002) {
    return false
  }

  const iyr = parseInt(passport.iyr, 10)

  if (iyr < 2010 || iyr > 2020) {
    return false
  }

  const eyr = parseInt(passport.eyr, 10)

  if (eyr < 2020 || eyr > 2030) {
    return false
  }

  if (!passport.hgt.match(/^[0-9]+(cm|in)$/)) {
    return false
  }

  if (passport.hgt.indexOf('cm') !== -1) {
    const hgt = parseInt(passport.hgt.replace('cm', ''), 10)

    if (hgt < 150 || hgt > 193) {
      return false
    }
  } else {
    const hgt = parseInt(passport.hgt.replace('in', ''), 10)

    if (hgt < 59 || hgt > 76) {
      return false
    }
  }

  if (!passport.hcl.match(/#[0-9a-f]{6}/)) {
    return false
  }

  const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']

  if (!validEyeColors.includes(passport.ecl)) {
    return false
  }

  if (!passport.pid.match(/^[0-9]{9}$/)) {
    return false
  }

  return true
}

function part1(input) {
  const passports = parsePassports(input).filter(hasRequiredFields)

  return passports.length
}

function part2(input) {
  const passports = parsePassports(input).filter(hasRequiredFields).filter(hasValidFields)

  return passports.length
}

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')

console.log(part1(input))
console.log(part2(input))
