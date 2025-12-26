const { read } = require("../utils");


function carry(queue, n, i = 0) {
  if (i >= queue.length || n < queue[i]) {
    return
  }

  const x = queue[i]

  queue[i] = n

  carry(queue, x, i + 1)
}

function main(input, partTwo = false) {
  return input
    .trim()
    .split("\n").map(line => line.split("").int())
    .map((nums) => {
      let queue = nums.splice(nums.length - (partTwo ? 12 : 2))

      for (const n of nums.reverse()) {
        carry(queue, n)
      }

      return queue.join("").int()
    })
    .sum()
}


const input = read(`${__dirname}/input.txt`);

const example = `987654321111111
811111111111119
234234234234278
818181911112111`;

console.log(main(example));
console.log(main(input));

console.log(main(example, true));
console.log(main(input, true));
