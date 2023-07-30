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

let headDiv = document.createElement('div');
headDiv.style.position = 'relative';
headDiv.style.width = '50px';
headDiv.style.zIndex = '2';
headDiv.style.height = '50px';
headDiv.style.borderRadius = '33%';
headDiv.style.backgroundColor = 'black';
headDiv.style.transition = speed + 'ms linear';
board.appendChild(headDiv);

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
    };
};

let head = part(headDiv, 0, 0, 'head', 'none');

let foodObj = function (element, partX, partY, type) {
    return {
        element,
        partX,
        partY,
        type
    };
};

let foods = [];

function createFood(posX, posY) {
    let foodElement = document.createElement('div');
    foodElement.style.position = 'absolute';
    foodElement.style.zIndex = '1';
    foodElement.style.width = '40px';
    foodElement.style.height = '40px';
    foodElement.style.transform = 'translate(5px, 5px) scale(0)';
    foodElement.style.opacity = '0';
    foodElement.style.borderRadius = '50%';
    foodElement.style.backgroundColor = '#800';
    foodElement.style.transition = '500ms linear';
    foods.push(foodObj(foodElement, posX, posY, 'circle'));
    board.appendChild(foods.at(-1).element);
    setPos(foods.at(-1).element, foods.at(-1).partX, foods.at(-1).partY);
    setTimeout(function () {
        foods.at(-1).element.style.transform = 'translate(5px, 5px)';
        foods.at(-1).element.style.opacity = '1';
    }, 50);

}

createFood(randomInt(0, 600, 50), randomInt(0, 800, 50));

setPos(board, head.partX, head.partY);

let direction;

function setPos(element, x, y) {
    element.style.top = y + 'px';
    element.style.left = x + 'px';
    // console.log([head.element.offsetTop, circle.element.offsetTop]);
    // console.log([head.element.offsetLeft, circle.element.offsetLeft]);
}

checkFood = setInterval(eatFood, 50);

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
    setPos(head.element, head.partX, head.partY);
}

const headInt = setInterval(function () {
    move(head, direction);
    head.lastDir = direction;
}, speed);

document.addEventListener('keydown', function (event) {
    if (event.repeat) {
        return;
    }
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down' && head.lastDir !== 'down') {
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up' && head.lastDir !== 'up') {
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right' && head.lastDir !== 'right') {
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left' && head.lastDir !== 'left') {
                direction = 'right';
            }
            break;
    }
});

function eatFood() {
    let toRemove;
    foods.forEach(function (food, index) {
        if (Math.abs(head.element.offsetTop - food.element.offsetTop) < 50 &&
            Math.abs(head.element.offsetLeft - food.element.offsetLeft) < 50) {
            food.element.style.transform = 'translate(5px, 5px) scale(0)';
            food.element.style.opacity = '0';
            toRemove = index;
        }
    });
    if (toRemove !== undefined) {
        foods.splice(toRemove, 1);
        createFood(randomInt(0, 600, 50), randomInt(0, 800, 50));
    }
}