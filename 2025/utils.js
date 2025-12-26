const fs = require("fs");
const _ = require("lodash");

Object.defineProperty(String.prototype, "int", {
  value: function (base = 10) {
    return parseInt(this, base);
  },
});

Object.defineProperty(String.prototype, "lines", {
  value: function () {
    return this.trim().split("\n");
  },
});



Object.defineProperty(Array.prototype, "int", {
  value: function () {
    return this.map((n) => parseInt(n, 10));
  },
});

Object.defineProperty(Array.prototype, "sum", {
  value: function () {
    return this.reduce((cur, sum) => cur + sum, 0);
  },
});

Object.defineProperty(Array.prototype, "mult", {
  value: function () {
    return this.reduce((cur, sum) => cur * sum, 1);
  },
});

Object.defineProperty(Array.prototype, "asc", {
  value: function () {
    return this.sort((a, b) => a - b);
  },
});

Object.defineProperty(Array.prototype, "desc", {
  value: function () {
    return this.sort((a, b) => b - a);
  },
});

Object.defineProperty(Array.prototype, "max", {
  value: function () {
    return Math.max(...this);
  },
});

Object.defineProperty(Array.prototype, "min", {
  value: function () {
    return Math.min(...this);
  },
});

Object.defineProperty(Array.prototype, "chunk", {
  value: function (size) {
    return _.chunk(this, size);
  },
});

Object.defineProperty(Array.prototype, "fill", {
  value: function (value) {
    return _.chunk(this, size);
  },
});

Object.defineProperty(Array.prototype, "copy", {
  value: function () {
    return _.cloneDeep(this);
  },
});

Object.defineProperty(Array.prototype, "empty", {
  value: function () {
    return this.length === 0;
  },
});

Array.create = function create({ rows, columns, fill = null }) {
  const arr = [];

  for (let y = 0; y < columns; y++) {
    const row = [];

    for (let x = 0; x < rows; x++) {
      row.push(fill);
    }

    arr.push(row);
  }

  return arr;
};

Object.defineProperty(String.prototype, "toGrid", {
  value: function () {
    return new Grid(this);
  },
});

class Cell {
  constructor(x, y, value, grid) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.grid = grid;
  }

  get neighbors() {
    return Array.from(this);
  }

  *[Symbol.iterator]() {
    for (const dx of [-1, 0, 1]) {
      for (const dy of [-1, 0, 1]) {
        if (dx === 0 && dy === 0) continue;
        if (this.x + dx < 0 || this.x + dx >= this.grid.rows[this.y].length || this.y + dy < 0 || this.y + dy >= this.grid.rows.length) continue;
        yield this.grid.rows[this.y + dy][this.x + dx];
      }
    }
  }

  toString() {
    return this.value;
  }
}

export class Grid {
  constructor(width, height, fill = '.') {
    this.rows = []

    for (let y = 0; y <= height; y++) {
      const row = []

      for (let x = 0; x <= width; x++) {
        row.push(new Cell(x, y, fill, this))
      }

      this.rows.push(row)
    }

    this.cells = {}

    for (const cell of this) {
      this.cells[`${cell.x},${cell.y}`] = cell;
    }
  }

  *[Symbol.iterator]() {
    for (const row of this.rows) {
      for (const col of row) {
        yield col;
      }
    }
  }

  get(x, y) {
    return this.cells[`${x},${y}`];
  }

  map(callback) {
    return Array.from(this).map(callback);
  }

  find(callback) {
    return Array.from(this).find(callback);
  }

  filter(callback) {
    return Array.from(this).filter(callback);
  }

  toString() {
    return this.rows.map(row => row.map(cell => cell.value).join('')).join('\n');
  }
}

export class Node {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z

    this.neighbors = new Set()

    this.visited = false
  }

  distanceTo(other) {
    const dx = Math.abs(this.x - other.x)
    const dy = Math.abs(this.y - other.y)
    const dz = Math.abs(this.z - other.z)

    const px = Math.pow(dx, 2)
    const py = Math.pow(dy, 2)
    const pz = Math.pow(dz, 2)

    return Math.sqrt(px + py + pz)
  }

  connect(other) {
    this.neighbors.add(other)
    other.neighbors.add(this)
  }

  toString() {
    return `${this.x},${this.y},${this.z}`
  }
}

export function read(filename) {
  return fs.readFileSync(filename, "utf-8");
}
