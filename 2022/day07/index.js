const _ = require('lodash')

const { read } = require('../utils')

function parseFileTree(input) {
  const root = new Folder('/')

  let cwd = root

  for (const line of input.trim().split('\n')) {
    if (line.match(/dir .+/)) {
      const foldername = line.split(' ')[1]

      cwd.mkdir(foldername)
    }

    if (line.match(/\d+ .+/)) {
      const [filesize, filename] = line.split(' ')

      cwd.touch(filename, filesize)
    }


    if (line.match(/^\$ cd .+/)) {
      const path = line.split(' ')[2]

      if (path === '/') {
        cwd = root
      } else if (path === '..') {
        cwd = cwd.parent
      } else {
        cwd = cwd.children[path]
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

    if (node.size <= 100000) {
      sum += node.size
    }

    for (const child of Object.values(node.children)) {
      if (child instanceof Folder) {
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

    const size = node.size

    if (size >= spaceNeeded && size <= smallestFolder) {
      smallestFolder = size
    }

    for (const child of Object.values(node.children)) {
      if (child instanceof Folder) {
        queue.push(child)
      }
    }
  }

  return smallestFolder
}

class File {
  constructor(name, size, parent) {
    this.name = name
    this.parent = parent
    this.size = typeof size === 'string' ? parseInt(size, 10) : size
  }
}

class Folder {
  constructor(name, parent) {
    this.name = name
    this.parent = parent
    this.children = {}
  }

  get size() {
    return Object.values(this.children)
      .map(child => child.size)
      .reduce((sum, curr) => sum + curr, 0)
  }

  mkdir(name) {
    if (this.children[name] == null) {
      this.children[name] = new Folder(name, this)
    }
  }

  touch(name, size) {
    this.children[name] = new File(name, size, this)
  }
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
