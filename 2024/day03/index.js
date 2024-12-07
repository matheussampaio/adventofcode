const { read } = require("../utils");

function main(input) {
	const instruction = [];

	let enabled = true;
	let sum = 0;

	for (let i = 0; i < input.length; i++) {
		const char = input[i];

		if (enabled && char === "m") {
			const match = input
				.slice(i)
				.match(/mul\((?<left>\d{1,3}),(?<right>\d{1,3})\)/);

			if (match?.index === 0) {
				sum += match.groups.left.int() * match.groups.right.int();
			}
		} else if (char === "d" && input.slice(i).match(/do\(\)/)?.index === 0) {
			enabled = true;
		} else if (
			char === "d" &&
			input.slice(i).match(/don\'t\(\)/)?.index === 0
		) {
			enabled = false;
		}
	}

	return sum;
}

const input = read(`${__dirname}/input.txt`);

const example =
	"xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

// console.log(main(example));
console.log(main(input));
