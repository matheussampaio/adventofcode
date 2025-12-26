const { read } = require("../utils");

const re1 = /^(\d+)\1$/
const re2 = /^(\d+)\1+$/

function main(input, partTwo = false) {
  return input
    .trim()
    .split(",")
    .map((line) => line.split("-").int())
    .map(([start, end]) => Array.from({ length: end - start + 1 }, (_, i) => start + i))
    .map(range => range.filter(n => partTwo ? re2.test(n.toString()) : re1.test(n.toString())))
    .map(range => range.sum())
    .sum()
}


const input = read(`${__dirname}/input.txt`);

const example = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

console.log(main(example));
console.log(main(input));

console.log(main(example, true));
console.log(main(input, true));
