const fs = require("fs");
const _ = require("lodash");

Object.defineProperty(String.prototype, "int", {
	value: function (base = 10) {
		return parseInt(this, base);
	},
});

Object.defineProperty(String.prototype, "lines", {
	value: function () {
		return this.split("\n");
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

function read(filename) {
	return fs.readFileSync(filename, "utf-8");
}

module.exports = {
	read,
};
