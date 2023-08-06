const cellSize = 40;
const speed = 250;

const tailPathD = 'M 40 10 C 35 10 15 10 10 10 C 0 10 0 30 10 30 C 15 30 35 30 40 30';
// snake tail
const tailSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
tailSVG.setAttribute('class', 'part');
tailSVG.style.position = 'absolute';
const tailPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
tailPath.setAttribute('d', tailPathD);
tailPath.setAttribute('fill', 'orange');
tailPath.setAttribute('stroke', 'black');
tailSVG.appendChild(tailPath);

const bodyCurvedD = {
    right_down: ['M 0 30 C 0 25 0 15 0 10 C 15 10 30 25 30 40 C 25 40 15 40 10 40 C 10 35 5 30 0 30',
        'M 0 10 C 15 10 30 25 30 40 M 10 40 C 10 35 5 30 0 30'],
    down_left: ['M 10 0 C 15 0 25 0 30 0 C 30 15 15 30 0 30 C 0 25 0 15 0 10 C 5 10 10 5 10 0',
        'M 30 0 C 30 15 15 30 0 30 M 0 10 C 5 10 10 5 10 0'],
    left_up: ['M 40 10 C 40 15 40 25 40 30 C 25 30 10 15 10 0 C 15 0 25 0 30 0 C 30 5 35 10 40 10',
        'M 40 30 C 25 30 10 15 10 0 M 30 0 C 30 5 35 10 40 10'],
    up_right: ['M 30 40 C 25 40 15 40 10 40 C 10 25 25 10 40 10 C 40 15 40 25 40 30 C 35 30 30 35 30 40',
        'M 10 40 C 10 25 25 10 40 10 M 40 30 C 35 30 30 35 30 40'],

    up_left: ['M 30 40 C 25 40 15 40 10 40 C 10 35 5 30 0 30 C 0 25 0 15 0 10 C 15 10 30 25 30 40',
        'M 10 40 C 10 35 5 30 0 30 M 0 10 C 15 10 30 25 30 40'],
    right_up: ['M 0 30 C 0 25 0 15 0 10 C 5 10 10 5 10 0 C 15 0 25 0 30 0 C 30 15 15 30 0 30',
        'M 0 10 C 5 10 10 5 10 0 M 30 0 C 30 15 15 30 0 30'],
    down_right: ['M 10 0 C 15 0 25 -0 30 -0 C 30 5 35 10 40 10 C 40 15 40 25 40 30 C 25 30 10 15 10 0',
        'M 30 0 C 30 5 35 10 40 10 M 40 30 C 25 30 10 15 10 0'],
    left_down: ['M 40 10 C 40 15 40 25 40 30 C 35 30 30 35 30 40 C 25 40 15 40 10 40 C 10 25 25 10 40 10',
        'M 40 30 C 35 30 30 35 30 40 M 10 40 C 10 25 25 10 40 10'],
};
// snake body curved
const bodyCurveSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
bodyCurveSVG.setAttribute('class', 'part');
bodyCurveSVG.style.position = 'absolute';
const bodyCurvePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
bodyCurvePath.setAttribute('d', bodyCurvedD.right_down[0]);
bodyCurvePath.setAttribute('fill', 'orange');
const bodyCurvePathStroke = document.createElementNS('http://www.w3.org/2000/svg', 'path');
bodyCurvePathStroke.setAttribute('d', bodyCurvedD.right_down[1]);
bodyCurvePathStroke.setAttribute('fill', 'transparent');
bodyCurvePathStroke.setAttribute('stroke', 'black');
bodyCurveSVG.appendChild(bodyCurvePath);
bodyCurveSVG.appendChild(bodyCurvePathStroke);

const bodyStraightD = {
    right: ['M 0 30 C 0 25 0 15 0 10 C 5 10 35 10 40 10 C 40 15 40 25 40 30 C 35 30 5 30 0 30',
        'M 0 10 C 5 10 35 10 40 10 M 40 30 C 35 30 5 30 0 30'],
    down: ['M 10 0 C 15 0 25 0 30 0 C 30 5 30 35 30 40 C 25 40 15 40 10 40 C 10 35 10 5 10 0',
        'M 30 0 C 30 5 30 35 30 40 M 10 40 C 10 35 10 5 10 0'],
    left: ['M 40 10 C 40 15 40 25 40 30 C 35 30 5 30 0 30 C 0 25 0 15 0 10 C 5 10 35 10 40 10',
        'M 40 30 C 35 30 5 30 0 30 M 0 10 C 5 10 35 10 40 10'],
    up: ['M 30 40 C 25 40 15 40 10 40 C 10 35 10 5 10 0 C 15 0 25 0 30 0 C 30 5 30 35 30 40',
        'M 10 40 C 10 35 10 5 10 0 M 30 0 C 30 5 30 35 30 40'],
};
// snake body straight
const bodyStraightSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
bodyStraightSVG.setAttribute('class', 'part');
bodyStraightSVG.style.position = 'absolute';
const bodyStraightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
bodyStraightPath.setAttribute('d', bodyStraightD.right[0]);
bodyStraightPath.setAttribute('fill', 'orange');
const bodyStraightPathStroke = document.createElementNS('http://www.w3.org/2000/svg', 'path');
bodyStraightPathStroke.setAttribute('d', bodyStraightD.right[1]);
bodyStraightPathStroke.setAttribute('fill', 'transparent');
bodyStraightPathStroke.setAttribute('stroke', 'black');
bodyStraightSVG.appendChild(bodyStraightPath);
bodyStraightSVG.appendChild(bodyStraightPathStroke);

const headPathD = [
    'M 0 30 C 5 30 5 30 10 30 C 15 35 15 35 20 30 C 25 30 25 30 30 30 C 40 30 40 10 30 10 C 25 10 25 10 20 10 C 15 5 15 5 10 10 C 5 10 5 10 0 10',
    'M 33 15 C 34 16 34 17 33 18 M 33 25 C 34 24 34 23 33 22',
    'M 15 10 C 18 10 18 13 15 13 C 13 13 13 10 15 10 M 15 30 C 18 30 18 27 15 27 C 13 27 13 30 15 30',
    'M 15 10 C 18 10 18 13 15 13 C 18 13 18 10 15 10 M 15 30 C 18 30 18 27 15 27 C 18 27 18 30 15 30'];
// snake head
const headSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
headSVG.setAttribute('class', 'part');
headSVG.style.position = 'absolute';
const headGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
const headMain = document.createElementNS('http://www.w3.org/2000/svg', 'path');
headMain.setAttribute('d', headPathD[0]);
headMain.setAttribute('fill', 'orange');
headMain.setAttribute('stroke', 'black');
const headNose = document.createElementNS('http://www.w3.org/2000/svg', 'path');
headNose.setAttribute('d', headPathD[1]);
headNose.setAttribute('fill', 'transparent');
headNose.setAttribute('stroke', 'black');
headNose.setAttribute('stroke-linecap', 'round');
const headEyes = document.createElementNS('http://www.w3.org/2000/svg', 'path');
headEyes.setAttribute('d', headPathD[2]);
headEyes.setAttribute('fill', 'white');
headEyes.setAttribute('stroke', 'black');
const eyesAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
eyesAnimate.setAttribute('attributeName', 'd');
eyesAnimate.setAttribute('values', headPathD[2] + ';' + headPathD[2] + ';' + headPathD[3] + ';' + headPathD[2]);
eyesAnimate.setAttribute('keyTimes', '0;0.7;0.85;1');
eyesAnimate.setAttribute('dur', '5s');
eyesAnimate.setAttribute('repeatCount', 'indefinite');
headEyes.appendChild(eyesAnimate);
headGroup.appendChild(headMain);
headGroup.appendChild(headNose);
headGroup.appendChild(headEyes);
headSVG.appendChild(headGroup);

const ApplePathD = ['M 20 11 C 26 10 30 14 30 20 C 30 26 26 30 20 30 C 14 30 10 26 10 20 C 10 14 14 10 20 11',
    'M 20 11 C 21 7 22 6 25 5 C 25 8 23 9 20 11'];
// snake tail
const appleSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
appleSVG.setAttribute('class', 'part');
appleSVG.style.position = 'absolute';
appleSVG.style.transition = 'all ' + (speed * 0.9) + 'ms';
appleSVG.style.transform = 'scale(0)';
const applePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
applePath.setAttribute('d', ApplePathD[0]);
applePath.setAttribute('fill', 'red');
applePath.setAttribute('stroke', 'black');
const leafPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
leafPath.setAttribute('d', ApplePathD[1]);
leafPath.setAttribute('fill', 'green');
leafPath.setAttribute('stroke', 'black');
appleSVG.appendChild(applePath);
appleSVG.appendChild(leafPath);

/**
 * rotate a svg path by 90 degrees clockwise or counter-clockwise
 * @param svgPath {string} the svg path that (for now) only consists of 'M' and 'C'
 * @param clockwise {boolean} whether to rotate it clockwise or counter-clockwise
 * @return {string} the rotated path
 */
function rotatePath(svgPath, clockwise) {
    const parts = svgPath.trim().replace(/  +/, ' ').split(/(?=[MC])/);
    let rotatedPath = '';
    for (const part of parts) {
        const type = part[0];
        const coords = part.slice(1).trim().split(/\s+/);
        if (clockwise) {
            switch (type) {
                case 'M':
                    rotatedPath += `${type} ${-parseFloat(coords[1]) + cellSize} ${parseFloat(coords[0])} `;
                    break;
                case 'C':
                    rotatedPath += `${type} ${-parseFloat(coords[1]) + cellSize} ${parseFloat(coords[0])} ${-parseFloat(coords[3]) + cellSize} ${parseFloat(coords[2])} ${-parseFloat(coords[5]) + cellSize} ${parseFloat(coords[4])} `;
            }
        } else {
            switch (type) {
                case 'M':
                    rotatedPath += `${type} ${parseFloat(coords[1])} ${-parseFloat(coords[0]) + cellSize} `;
                    break;
                case 'C':
                    rotatedPath += `${type} ${parseFloat(coords[1])} ${-parseFloat(coords[0]) + cellSize} ${parseFloat(coords[3])} ${-parseFloat(coords[2]) + cellSize} ${parseFloat(coords[5])} ${-parseFloat(coords[4]) + cellSize} `;
            }
        }
    }
    return rotatedPath.trim().replace(/  +/, ' ');
}

/**
 * moves the snake part by one cell in the direction specified
 * @param part
 * @param direction {string} up/down/left/right
 */
function movePart(part, direction) {
    let x, y;
    switch (direction) {
        case 'up':
            [x, y] = [0, -cellSize];
            break;
        case 'right':
            [x, y] = [cellSize, 0];
            break;
        case 'down':
            [x, y] = [0, cellSize];
            break;
        case 'left':
            [x, y] = [-cellSize, 0];
            break;
    }
    part.x += x;
    part.y += y;
    part.element.style.left = part.x + 'px';
    part.element.style.top = part.y + 'px';
}

/**
 * rotates the snake part clockwise or counter-clockwise
 * @param part the snake part object to be rotated
 * @param clockwise {boolean} whether to rotate it clockwise or counter-clockwise
 */
function rotatePart(part, clockwise) {
    let children;
    if (part.type === 'head') {
        children = part.element.children[0].children;
        let childAnim = children[2].children[0];
        let animPaths = childAnim.getAttribute('values').split(';');
        for (let i = 0; i < animPaths.length; i++) {
            animPaths[i] = rotatePath(animPaths[i], clockwise);
        }
        childAnim = animPaths.join(';');
        children[2].children[0].setAttribute('values', childAnim);
    } else {
        children = part.element.children;
    }
    for (const child of children) {
        let path = rotatePath(child.getAttribute('d'), clockwise);
        child.setAttribute('d', path);
    }
}

/**
 * the object factory for creating new snake parts
 * @param type {string} head/body/tail
 * @param direction {string} the direction that new part should be facing up/down/left/right
 * @return {{x: number, y: number, type, element: Node, direction}}
 */
let newPart = function (type, direction) {
    let element;
    switch (type) {
        case 'head':
            element = headSVG.cloneNode(true);
            break;
        case 'body':
            element = bodyStraightSVG.cloneNode(true);
            break;
        case 'bodyC':
            element = bodyCurveSVG.cloneNode(true);
            break;
        case 'tail':
            element = tailSVG.cloneNode(true);
    }
    return {
        element: element,
        type,
        direction,
        x: 0,
        y: 0,
    };
};

let newFood = function (type, x, y) {
    let element;
    switch (type) {
        case 'apple':
            element = appleSVG.cloneNode(true);
    }
    absoluteMove(element, x, y);
    return {
        element: element,
        type,
        x,
        y,
    };
};

function absoluteMove(obj, x, y) {
    obj.style.left = x + 'px';
    obj.style.top = y + 'px';
}

/**
 * the function to move the whole snake to the direction that the user is pointing it to
 */
function moveSnake() {
    let pastDirections = [];
    for (const part of snake) {
        pastDirections.push(part.direction);
    }
    if (direction !== snake.at(0).direction) {
        rotatePart(snake.at(0), isClockwise(snake.at(0).direction, direction));
    }
    movePart(snake.at(0), direction);
    snake.at(0).direction = direction;
    console.log([snake.at(0).x, snake.at(0).y]);
    console.log([foods.at(-1).x, foods.at(-1).y]);
    eatFood();

    for (let i = 1; i < snake.length; i++) {
        if (['body', 'bodyC'].includes(snake.at(i).type) && pastDirections[i - 1] !== snake.at(i - 1).direction) {
            snake.at(i).type = 'bodyC';
            let children = snake.at(i).element.children;
            let curveDirection = [pastDirections[i - 1], snake.at(i - 1).direction].join('_');
            children[0].setAttribute('d', bodyCurvedD[curveDirection][0]);
            children[1].setAttribute('d', bodyCurvedD[curveDirection][1]);
        } else if (snake.at(i).type === 'bodyC' && pastDirections[i - 1] === snake.at(i - 1).direction) {
            snake.at(i).type = 'body';
            let children = snake.at(i).element.children;
            let straightDirection = snake.at(i - 1).direction;
            children[0].setAttribute('d', bodyStraightD[straightDirection][0]);
            children[1].setAttribute('d', bodyStraightD[straightDirection][1]);
        } else {
            if (pastDirections[i - 1] !== snake.at(i - 1).direction) {
                rotatePart(snake.at(i), isClockwise(pastDirections[i - 1], snake.at(i - 1).direction));
            }
        }
        movePart(snake.at(i), pastDirections[i - 1]);
        snake.at(i).direction = pastDirections[i - 1];
    }
}

function selfCollide() {
    for (let i = 1; i < snake.length; i++) {
        if (snake.at(0).x === snake.at(i).x && snake.at(0).y === snake.at(i).y) {
            console.log('game over');
            start = false;
        }
    }
}

function eatFood() {
    foods.forEach(function (food, i) {
        if (snake.at(0).x === food.x && snake.at(0).y === food.y) {
            food.element.style.transform = 'scale(0)';
            foods.push(newFood('apple', Math.floor(Math.random() * 10) * cellSize, Math.floor(Math.random() * 10) * cellSize));
            document.body.appendChild(foods.at(-1).element);
            setTimeout(function () {
                foods.at(-1).element.style.transform = 'scale(1)';
            }, 1);
            setTimeout(function () {
                food.element.remove();
                foods.splice(i, 1);
            }, speed * 0.9);
        }
    });
}

/**
 * checks if rotation should be clockwise or counter-clockwise based on the current and previous directions
 * @param previous {string} previous direction of the said part
 * @param current {string} current direction of the said part
 * @return {boolean}
 */
function isClockwise(previous, current) {
    if (previous === 'up' && current === 'right' ||
        previous === 'right' && current === 'down' ||
        previous === 'down' && current === 'left' ||
        previous === 'left' && current === 'up') {
        return true;
    } else if (previous === 'up' && current === 'left' ||
        previous === 'right' && current === 'up' ||
        previous === 'down' && current === 'right' ||
        previous === 'left' && current === 'down') {
        return false;
    } else {
        console.error('error: check rotate called on not rotating part');
    }
}

let direction = 'right';

let start = false;

let startMoving;

document.addEventListener('click', function () {
    moveSnake();
});

document.addEventListener('keydown', function (event) {
    // console.log(event.code);
    keyPressed(event.code);
});

function keyPressed(key) {
    switch (key) {
        case 'ArrowUp':
        case 'KeyW':
            if (snake.at(0).direction !== 'down') {
                direction = 'up';
            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (snake.at(0).direction !== 'left') {
                direction = 'right';
            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (snake.at(0).direction !== 'up') {
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (snake.at(0).direction !== 'right') {
                direction = 'left';
            }
            break;
        case 'Space':
            if (!start) {
                startMoving = setInterval(function () {
                    moveSnake();
                    selfCollide();
                    if (start === false) {
                        clearInterval(startMoving);
                    }
                }, speed);
            } else {
                clearInterval(startMoving);
            }
            start = !start;
            break;
    }
}

let style = document.styleSheets[0];
let rules = style.cssRules;
rules[0].style.transition = speed + 'ms linear';
rules[1].style.transition = speed + 'ms linear';

let snake = [];
let foods = [];

snake.push(newPart('head', 'right'));
movePart(snake.at(-1), 'right');
movePart(snake.at(-1), 'right');
movePart(snake.at(-1), 'right');
movePart(snake.at(-1), 'right');
snake.at(0).element.style.zIndex = '10';
snake.push(newPart('body', 'right'));
movePart(snake.at(-1), 'right');
movePart(snake.at(-1), 'right');
movePart(snake.at(-1), 'right');
snake.push(newPart('body', 'right'));
movePart(snake.at(-1), 'right');
movePart(snake.at(-1), 'right');
snake.push(newPart('body', 'right'));
movePart(snake.at(-1), 'right');
snake.push(newPart('tail', 'right'));
movePart(snake.at(-1), 'right');
movePart(snake.at(-1), 'left');

foods.push(newFood('apple', 120, 80));
setTimeout(function () {
    foods.at(-1).element.style.transform = 'scale(1)';
}, 1);


snake.forEach(function (part) {
    document.body.appendChild(part.element);
});

foods.forEach(function (food) {
    document.body.appendChild(food.element);
});

