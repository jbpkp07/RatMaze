# RatMaze

This is a Node.js application that solves a rat maze using a depth-first search algorithm. It will output a traversal of the rat through the maze to the console, followed by console logging the coordinates of the path the rat took.

### Run it locally:

You can clone this repository via command line (if you have Git installed) by typing:  

`git clone https://github.com/jbpkp07/RatMaze`

If you already have Node.js installed, open your terminal, and browse to where you have cloned this Git repository and type:  

`node index.js <map>`

Maps available:  `map1`, `map2`, `map3`

If you choose `map3` specifically, you can also provide custom map dimensions using this syntax:
`node index.js map3 <width> <height>`   Example:   `node index.js map3 12 18`

If there are Node module dependencies that you are missing, please type `npm install` and it will reference the package.json file in this repository to automatically resolve those missing dependencies.

The main entry point for the server application is `index.js`, and the other auxillary files are used to provide Node modules that the application depends on.

**Technologies used:**  Node.js, Typescript, Javascript, NPM, npm terminal-kit, npm cli-table

I am the sole developer of this application.

### Screenshots:

#### The rat traversing throught the maze
S=start
E=end
▲=rat
■=wall

![1](https://github.com/jbpkp07/RatMaze/blob/master/images/inAction.png)

#### Completed maze and coordinates console logged

![2](https://github.com/jbpkp07/RatMaze/blob/master/images/completed.png)
