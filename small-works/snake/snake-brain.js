let speed = 500;
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

let food = function (element, partX, partY, type) {
    return {
        element,
        partX,
        partY,
        type
    };
};

let circleFood = document.createElement('div');
circleFood.style.position = 'absolute';
circleFood.style.zIndex = '1';
circleFood.style.width = '40px';
circleFood.style.height = '40px';
circleFood.style.transform = 'translate(5px, 5px)';
circleFood.style.borderRadius = '50%';
circleFood.style.backgroundColor = '#800';
circleFood.style.transition = '500ms linear';

circle = food(circleFood, 200, 200, 'circle');
board.appendChild(circle.element);

setPos(circle.element, circle.partX, circle.partY);


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
    if (Math.abs(head.element.offsetTop - circle.element.offsetTop) < 50 &&
        Math.abs(head.element.offsetLeft - circle.element.offsetLeft) < 50) {
        circle.element.style.transform = 'translate(5px, 5px) scale(0)';
        circle.element.style.opacity = '0';
    }
}