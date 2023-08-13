const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 900;
canvas.style.backgroundColor = '#90ee90';
let cellSize = 60;

canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    return false;
}, false);

function drawGrid() {
    ctx.beginPath();
    ctx.setLineDash([10, 2]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#0005';
    for (let i = cellSize; i < canvas.height; i += cellSize) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    for (let i = cellSize; i < canvas.width; i += cellSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
}


let x = 0, y = 0;
let speed = 1;
let dx = 0, dy = 0;
let pastX = x, pastY = y;
let direction = null, changeDirection = false, pastDirection = direction;
let debug = false;

function drawBall(dt) {
    ctx.beginPath();
    ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    ctx.fillStyle = 'darkred';
    ctx.fill();
    ctx.closePath();
    if (pastDirection !== direction) {
        changeDirection = true;
    }

    if (changeDirection) {
        updateDirection();
    }

    pastX = x;
    pastY = y;
    if (x >= 0 && x <= canvas.width - cellSize) {
        x += dx * dt;
        x = Math.min(canvas.width - cellSize, Math.max(0, x));
    }
    if (y >= 0 && y <= canvas.height - cellSize) {
        y += dy * dt;
        y = Math.min(canvas.height - cellSize, Math.max(0, y));
    }
}

let lastTimestamp = 0;

function draw(timestamp) {
    const deltaTime = (timestamp - lastTimestamp) / 10;
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawBall(deltaTime);

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

function updateDirection() {
    let change = false;
    if (['left', 'right'].includes(direction)) {
        if (pastY === y) {
            change = true;
        } else if (pastY < y && (Math.floor((pastY + cellSize) / cellSize) * cellSize === Math.floor(y / cellSize) * cellSize)) {
            y = Math.floor(y / cellSize) * cellSize;
            change = true;
        } else if (pastY > y && (Math.floor(pastY / cellSize) * cellSize === Math.floor((y + cellSize) / cellSize) * cellSize)) {
            y = Math.floor(pastY / cellSize) * cellSize;
            change = true;
        }
        if (change) {
            dx = (direction === 'right') ? speed : -speed;
            dy = 0;
        }
    } else {
        if (pastX === x) {
            change = true;
        } else if (pastX < x && (Math.floor((pastX + cellSize) / cellSize) * cellSize === Math.floor(x / cellSize) * cellSize)) {
            x = Math.floor(x / cellSize) * cellSize;
            change = true;
        } else if (pastY > x && (Math.floor(pastX / cellSize) * cellSize === Math.floor((x + cellSize) / cellSize) * cellSize)) {
            x = Math.floor(pastX / cellSize) * cellSize;
            change = true;
        }
        if (change) {
            dx = 0;
            dy = (direction === 'down') ? speed : -speed;
        }
    }
    changeDirection = !change;
}

function pressedKey(key) {
    switch (key) {
        case 'ArrowRight':
        case 'KeyD':
            direction = 'right';
            break;
        case 'ArrowDown':
        case 'KeyS':
            direction = 'down';
            break;
        case 'ArrowLeft':
        case 'KeyA':
            direction = 'left';
            break;
        case 'ArrowUp':
        case 'KeyW':
            direction = 'up';
            break;
        case 'Space':
            debug = !debug;
    }
}

window.addEventListener('keydown', function (event) {
    let key = event.code;
    pressedKey(key);
});

let touchPos = [[], []];
canvas.addEventListener('touchstart', function (event) {
    event.preventDefault();
    touchPos[0] = [event.changedTouches[0].screenX, event.changedTouches[0].screenY];
});

window.addEventListener('touchmove', function (event) {
    touchPos[1] = [event.changedTouches[0].screenX, event.changedTouches[0].screenY];
    touchToKey();
});

window.addEventListener('touchend', function () {
    touchPos = [[], []];
});

function touchToKey() {
    let touchThreshold = cellSize * 0.75;
    if (Math.abs(touchPos[1][0] - touchPos[0][0]) > Math.abs(touchPos[1][1] - touchPos[0][1])) {
        if (touchPos[1][0] - touchPos[0][0] > touchThreshold) {
            pressedKey('ArrowRight');
            touchPos[0] = touchPos[1];
        } else if (touchPos[1][0] - touchPos[0][0] < -touchThreshold) {
            pressedKey('ArrowLeft');
            touchPos[0] = touchPos[1];
        }
    } else if (Math.abs(touchPos[1][0] - touchPos[0][0]) < Math.abs(touchPos[1][1] - touchPos[0][1])) {
        if (touchPos[1][1] - touchPos[0][1] > touchThreshold) {
            pressedKey('ArrowDown');
            touchPos[0] = touchPos[1];
        } else if (touchPos[1][1] - touchPos[0][1] < -touchThreshold) {
            pressedKey('ArrowUp');
            touchPos[0] = touchPos[1];

        }
    }
}
