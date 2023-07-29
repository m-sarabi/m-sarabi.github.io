let board = document.createElement('div');
board.style.position = 'relative';
board.style.width = '600px';
board.style.height = '800px';
board.style.margin = (window.innerHeight - 800) / 2 + 'px auto';
board.style.backgroundColor = 'lightgreen';
board.style.border = '1px solid';
document.body.appendChild(board);

let head = document.createElement('div');
head.style.position = 'relative';
head.style.width = '50px';
head.style.height = '50px';
head.style.backgroundColor = 'black';
head.style.transition = '500ms linear';
board.appendChild(head);
let headPos = {
    headX: 0,
    headY: 0,
};
setPos(board, headPos.headX, headPos.headY);

let direction;

function setPos(element, x, y) {
    element.style.top = y + 'px';
    element.style.left = x + 'px';
}

function move(obj, direction) {
    if (direction === 'up' && obj.headY - 50 >= 0) {
        obj.headY -= 50;
    } else if (direction === 'down' && obj.headY + 50 <= 750) {
        obj.headY += 50;
    } else if (direction === 'right' && obj.headX + 50 <= 550) {
        obj.headX += 50;
    } else if (direction === 'left' && obj.headX - 50 >= 0) {
        obj.headX -= 50;
    }
    setPos(head, headPos.headX, headPos.headY);
}

const headInt = setInterval(function () {
    move(headPos, direction);
}, 500);

document.addEventListener('keydown', function (event) {
    if (event.repeat) {
        return;
    }
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                direction = 'right';
            }
            break;
    }
});