const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
const tileSize = 40;
const size = 12;
let maze, player, goal;

function generateMaze() {
  maze = Array(size).fill().map(() => Array(size).fill(1));

  function carve(x, y) {
    const dirs = [[0, -2], [0, 2], [-2, 0], [2, 0]].sort(() => Math.random() - 0.5);
    for (let [dx, dy] of dirs) {
      let nx = x + dx, ny = y + dy;
      if (nx > 0 && ny > 0 && nx < size - 1 && ny < size - 1 && maze[ny][nx] === 1) {
        maze[ny][nx] = 0;
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  const startX = 1, startY = 1;
  maze[startY][startX] = 0;
  carve(startX, startY);
  player = { x: startX, y: startY };

  let visited = Array(size).fill().map(() => Array(size).fill(false));
  let queue = [{ x: startX, y: startY, dist: 0 }];
  visited[startY][startX] = true;
  let farthest = { x: startX, y: startY, dist: 0 };

  while (queue.length > 0) {
    let { x, y, dist } = queue.shift();
    if (dist > farthest.dist) farthest = { x, y, dist };
    for (let [dx, dy] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      let nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && !visited[ny][nx] && maze[ny][nx] === 0) {
        visited[ny][nx] = true;
        queue.push({ x: nx, y: ny, dist: dist + 1 });
      }
    }
  }

  goal = { x: farthest.x, y: farthest.y };
  maze[player.y][player.x] = 2;
  maze[goal.y][goal.x] = 3;

  drawMaze();
}

function drawMaze() {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let val = maze[y][x];
      ctx.fillStyle =
        val === 1 ? "black" :
        val === 2 ? "green" :
        val === 3 ? "blue" :
        "white";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  ctx.beginPath();
  ctx.arc(player.x * tileSize + tileSize / 2, player.y * tileSize + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}

function move(dx, dy) {
  let nx = player.x + dx;
  let ny = player.y + dy;
  if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] !== 1) {
    player.x = nx;
    player.y = ny;
    if (nx === goal.x && ny === goal.y) {
      setTimeout(() => alert("🎉 ผ่านแล้ว!"), 100);
    }
    drawMaze();
  }
}

generateMaze();