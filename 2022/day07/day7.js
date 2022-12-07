const _ = require('lodash')

const { read } = require('../utils')

function parseFileTree(input) {
  const root = {
    name: '/',
    nodes: {},
    size: function () {
      let sum = 0

      for (const node of Object.values(this.nodes)) {
        sum += node.size()
      }

      return sum
    }
  }

  let cwd = root

  for (const line of input.trim().split('\n')) {
    if (line.match(/dir .+/)) {
      const foldername = line.split(' ')[1]

      cwd.nodes[foldername] = cwd.nodes[foldername] ?? {
        name: foldername,
        type: 'folder',
        parent: cwd,
        nodes: {},
        size: function () {
          let sum = 0

          for (const node of Object.values(this.nodes)) {
            sum += node.size()
          }

          return sum
        }
      }
    }

    if (line.match(/\d+ .+/)) {
      const [filesize, filename] = line.split(' ')

      cwd.nodes[filename] = {
        name: filename,
        type: 'file',
        parent: cwd,
        size: () => parseInt(filesize, 10)
      }
    }

    if (line.match(/^\$ cd .+/)) {
      const path = line.split(' ')[2]

      if (path === '/') {
        cwd = root
      } else if (path === '..') {
        cwd = cwd.parent
      } else {
        cwd = cwd.nodes[path]
      }
    }
  }

  return root
}

function findBigFolders(input) {
  const root = parseFileTree(input)

  let sum = 0
  let queue = [root]

  while (queue.length) {
    const node = queue.shift()

    if (node.size && node.size() <= 100000) {
      sum += node.size()
    }

    for (const child of Object.values(node.nodes)) {
      if (child.type === 'folder') {
        queue.push(child)
      }
    }
  }

  return sum
}

function findBestFolderToDelete(input) {
  const root = parseFileTree(input)

  const DISK_SPACE = 70000000
  const PROGRAM_SIZE = 30000000

  const availableSpace = DISK_SPACE - root.size()
  const spaceNeeded = PROGRAM_SIZE - availableSpace

  let smallestFolder = root.size()
  let queue = [root]

  while (queue.length) {
    const node = queue.shift()

    const size = node.size()

    if (size >= spaceNeeded && size <= smallestFolder) {
      smallestFolder = size
    }

    for (const child of Object.values(node.nodes)) {
      if (child.type === 'folder') {
        queue.push(child)
      }
    }
  }

  return smallestFolder
}

const input = read(`${__dirname}/input.txt`)

const example = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`

console.log(findBigFolders(example))
console.log(findBigFolders(input))

console.log(findBestFolderToDelete(example))
console.log(findBestFolderToDelete(input))
