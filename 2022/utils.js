// Object.defineProperty(Array.prototype, 'asc', {
//   value: function(compare) {
//     return this.sort((a, b) => a - b)
//   }
// });

Object.defineProperty(Array.prototype, 'toInt', {
  value: function() {
    return this.map((n) => parseInt(n, 10))
  }
})

Object.defineProperty(Array.prototype, 'sum', {
  value: function() {
    return this.reduce((cur, sum) => cur + sum, 0)
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


