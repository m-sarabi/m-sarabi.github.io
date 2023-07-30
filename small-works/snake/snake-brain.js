let speed = 500;

function randomInt(start, end, step = 1) {
    return Math.floor(Math.random() * Math.floor(end / step)) * step;
}

let board = document.createElement('div');
board.style.position = 'relative';
board.style.width = '600px';
board.style.height = '800px';
board.style.margin = (window.innerHeight - 800) / 2 + 'px auto';
board.style.backgroundColor = 'lightgreen';
board.style.border = '1px solid';
document.body.appendChild(board);

//drawing the grid on the board
let grid = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
grid.style.position = 'absolute';
grid.style.top = '0';
grid.style.left = '0';
grid.setAttribute('width', '600');
grid.setAttribute('height', '800');

function drawLine(x1, y1, x2, y2) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', 'black');
    line.setAttribute('opacity', '0.25');
    line.setAttribute('stroke-dasharray', '10, 2');
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    grid.appendChild(line);
}

for (let i = 50; i < 800; i += 50) {
    drawLine(0, i, 600, i);
}
for (let i = 50; i < 600; i += 50) {
    drawLine(i, 0, i, 800);
}
board.appendChild(grid);

let part = function (element, partX, partY, type, lastDir) {
    return {
        element,
        partX,
        partY,
        type,
        lastDir,
        direction: 'none',
        new: true,
    };
};

let snake = [];

let head = createBody(0, 0, 'head');
head.new = false;
snake.push(head);
board.appendChild(snake[0].element);

let foodObj = function (element, partX, partY, type) {
    return {
        element,
        partX,
        partY,
        type,
    };
};

function createBody(posX, posY, type) {
    let partElement = document.createElement('div');
    partElement.style.position = 'absolute';
    partElement.style.width = '50px';
    partElement.style.transformOrigin = 'center';
    partElement.style.scale = type === 'head' ? '1' : '0';
    partElement.style.opacity = type === 'head' ? '1' : '0';
    partElement.style.zIndex = '2';
    partElement.style.height = '50px';
    partElement.style.borderRadius = type === 'head' ? '33%' : '50%';
    partElement.style.backgroundColor = 'black';
    partElement.style.transition = speed + 'ms linear';
    return part(partElement, posX, posY, type, 'none');
}

let foods = [];

function createFood(posX, posY) {
    let foodElement = document.createElement('div');
    foodElement.style.position = 'absolute';
    foodElement.style.zIndex = '1';
    foodElement.style.width = '50px';
    foodElement.style.height = '50px';
    foodElement.style.transform = 'scale(0)';
    foodElement.style.transformOrigin = 'center';
    foodElement.style.opacity = '0';
    foodElement.style.borderRadius = '50%';
    foodElement.style.backgroundColor = '#800';
    foodElement.style.transition = '500ms linear';
    foods.push(foodObj(foodElement, posX, posY, 'circle'));
    board.appendChild(foods.at(-1).element);
    setPos(foods.at(-1).element, foods.at(-1).partX, foods.at(-1).partY);
    setTimeout(function () {
        foods.at(-1).element.style.transform = 'scale(0.6)';
        foods.at(-1).element.style.opacity = '1';
    }, 50);
}

createFood(randomInt(0, 600, 50), randomInt(0, 800, 50));

setPos(board, snake[0].partX, snake[0].partY);

function setPos(element, x, y) {
    element.style.top = y + 'px';
    element.style.left = x + 'px';
}

let checkFood = setInterval(eatFood, 50);

function move(obj, direction) {
    if (direction === 'up' && obj.partY - 50 >= 0) {
        obj.partY -= 50;
    } else if (direction === 'down' && obj.partY + 50 <= 750) {
        obj.partY += 50;
    } else if (direction === 'right' && obj.partX + 50 <= 550) {
        obj.partX += 50;
    } else if (direction === 'left' && obj.partX - 50 >= 0) {
        obj.partX -= 50;
    }
    setPos(obj.element, obj.partX, obj.partY);
}

const headInt = setInterval(function () {
    for (let i = snake.length - 1; i > 0; i--) {
        if (snake[i].new === true) {
            snake[i].new = false;
            snake[i].element.style.scale = '1';
            snake[i].element.style.opacity = '1';
        } else {
            snake[i].direction = snake[i - 1].lastDir;
        }
    }
    if ((snake[0].direction === 'up' && snake[0].partY - 50 < 0) ||
        (snake[0].direction === 'down' && snake[0].partY + 50 > 750) ||
        (snake[0].direction === 'right' && snake[0].partX + 50 > 550) ||
        (snake[0].direction === 'left' && snake[0].partX - 50 < 0)) {
        console.log('game over');
        clearInterval(checkFood);
        clearInterval(headInt);
    } else {
        snake.forEach(function (obj) {
            move(obj, obj.direction);
            obj.lastDir = obj.direction;
        });
    }
}, speed);

document.addEventListener('keydown', function (event) {
    if (event.repeat) {
        return;
    }
    switch (event.key) {
        case 'ArrowUp':
            if (snake[0].direction !== 'down' && snake[0].lastDir !== 'down') {
                snake[0].direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (snake[0].direction !== 'up' && snake[0].lastDir !== 'up') {
                snake[0].direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (snake[0].direction !== 'right' && snake[0].lastDir !== 'right') {
                snake[0].direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (snake[0].direction !== 'left' && snake[0].lastDir !== 'left') {
                snake[0].direction = 'right';
            }
            break;
    }
});

function eatFood() {
    let toRemove;
    foods.forEach(function (food, index) {
        if (Math.abs(snake[0].element.offsetTop - food.element.offsetTop) < 50 &&
            Math.abs(snake[0].element.offsetLeft - food.element.offsetLeft) < 50) {
            food.element.style.transform = 'scale(0)';
            food.element.style.opacity = '0';
            toRemove = index;
        }
    });
    if (toRemove !== undefined) {
        foods.splice(toRemove, 1);
        createFood(randomInt(0, 600, 50), randomInt(0, 800, 50));
        snake.push(createBody(snake.at(-1).partX, snake.at(-1).partY, 'body'));
        board.appendChild(snake.at(-1).element);
        setPos(snake.at(-1).element, snake.at(-1).partX, snake.at(-1).partY);
    }
}
