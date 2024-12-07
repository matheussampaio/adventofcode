const { read } = require("../utils");

function main(input, partTwo = false) {
	const left = [];
	const right = {};

	input
		.trim()
		.split("\n")
		.forEach((line) => {
			const [l, r] = line.split("   ");

			left.push(parseInt(l));
			right[r] = (right[r] ?? 0) + 1;
		});

	let diff = 0;

	for (const n of left) {
		diff += Math.abs(n * (right[n] ?? 0));
	}

	return diff;
}

const input = read(`${__dirname}/input.txt`);

const example = `3   4
4   3
2   5
1   3
3   9
3   3`;

console.log(main(example));
console.log(main(input));

// const example2 = `two1nine
// eightwothree
// abcone2threexyz
// xtwone3four
// 4nineeightseven2
// zoneight234
// 7pqrstsixteen`;

// console.log(main(example2, true));
// console.log(main(input, true));
