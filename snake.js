// 担当: 盧 氷琦
// ゲームの中核ロジック: ヘビの移動・成長、エサの出現、衝突判定

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const messageEl = document.getElementById('message');
const startBtn = document.getElementById('start');

const GRID = 18;                    // 盤面のマス数(18 x 18)
const CELL = canvas.width / GRID;   // 1マスの大きさ(px)

let snake = [];
let direction = { x: 1, y: 0 };
let queue = [];                     // 押された向きを順番にためておく
let food = { x: 0, y: 0 };
let timer = null;
let running = false;

function startGame() {
  snake = [
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ];
  direction = { x: 1, y: 0 };
  queue = [];
  resetScore();
  placeFood();
  running = true;
  messageEl.textContent = 'がんばれ!';
  startBtn.textContent = 'リスタート';
  restartTimer();
  draw();
}

function restartTimer() {
  clearInterval(timer);
  timer = setInterval(step, getInterval());
}

// input.js から呼ばれる: 向きを変える
function setDirection(dx, dy) {
  if (!running) return;
  if (queue.length < 2) {
    queue.push({ x: dx, y: dy });
  }
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some(part => part.x === food.x && part.y === food.y));
}

// 一定時間ごとに1マス進む
function step() {
  if (queue.length > 0) {
    const next = queue.shift();
    const isReverse = next.x === -direction.x && next.y === -direction.y;
    if (!isReverse) {
      direction = next;
    }
  }

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall = head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID;
  const hitSelf = snake.some(part => part.x === head.x && part.y === head.y);
  if (hitWall || hitSelf) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    addScore();
    placeFood();
    restartTimer();
  } else {
    snake.pop();
  }

  draw();
}

function gameOver() {
  clearInterval(timer);
  running = false;
  messageEl.textContent = 'ゲームオーバー! スコア ' + currentScore;
  startBtn.textContent = 'もう一度';
}

// 馮 潔瑶: 色や形を変えたいときはここを編集する
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#e24b4a';
  ctx.beginPath();
  ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
  ctx.fill();

  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? '#0f6e56' : '#1d9e75';
    ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2);
  });
}
