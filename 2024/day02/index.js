const { read } = require("../utils");

function main(input) {
	return input
		.trim()
		.split("\n")
		.map((line) => line.split(" ").int())
		.filter((level) => {
			for (let i = 0; i < level.length; i++) {
				const levels = [...level.slice(0, i), ...level.slice(i + 1)];

				if (isSafe(levels)) {
					return true;
				}
			}

			return false;
		}).length;
}

function isSafe(levels) {
	const inc = levels[0] < levels[1];

	for (let i = 0; i < levels.length - 1; i++) {
		if (inc && levels[i] > levels[i + 1]) {
			return false;
		}

		if (!inc && levels[i] < levels[i + 1]) {
			return false;
		}

		if (Math.abs(levels[i] - levels[i + 1]) > 3) {
			return false;
		}

		if (levels[i] === levels[i + 1]) {
			return false;
		}
	}

	return true;
}

const input = read(`${__dirname}/input.txt`);

const example = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

console.log(main(example));
console.log(main(input));
