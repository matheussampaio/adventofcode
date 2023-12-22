const fs = require('fs')

Object.defineProperty(String.prototype, 'int', {
  value: function(base = 10) {
    return parseInt(this, base)
  }
})

Object.defineProperty(Array.prototype, 'int', {
  value: function() {
    return this.map((n) => parseInt(n, 10))
  }
})

Object.defineProperty(Array.prototype, 'sum', {
  value: function() {
    return this.reduce((cur, sum) => cur + sum, 0)
  }
})

Object.defineProperty(Array.prototype, 'mult', {
  value: function() {
    return this.reduce((cur, sum) => cur * sum, 1)
  }
})

Object.defineProperty(Array.prototype, 'asc', {
  value: function() {
    return this.sort((a, b) => a - b)
  }
})

Object.defineProperty(Array.prototype, 'desc', {
  value: function() {
    return this.sort((a, b) => b - a)
  }
})

Object.defineProperty(Array.prototype, 'max', {
  value: function() {
    return Math.max(...this)
  }
})

Object.defineProperty(Array.prototype, 'min', {
  value: function() {
    return Math.min(...this)
  }
})

function read(filename) {
  return fs.readFileSync(filename, 'utf-8')
}

module.exports = {
  read
}
