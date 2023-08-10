const cellSize = 40;
const speed = 400;
let boardSize = [10, 15];
let openBorder = false;

// all the svg parts and shapes are built with only cubic bézier curves

// snake parts in svg path
const tailPathD = rescaleSVG(['M 40 10 C 35 10 15 10 10 10 C 0 10 0 30 10 30 C 15 30 35 30 40 30']);
// snake tail
const tailSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
tailSVG.setAttribute('class', 'part');
tailSVG.setAttribute('class', 'ends');
tailSVG.style.position = 'absolute';
const tailPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
tailPath.setAttribute('d', tailPathD[0]);
tailPath.setAttribute('fill', 'orange');
tailPath.setAttribute('stroke', 'black');
tailSVG.appendChild(tailPath);

const bodyCurvedD = rescaleSVG({
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
});
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

const bodyStraightD = rescaleSVG({
    right: ['M 0 30 C 0 25 0 15 0 10 C 5 10 35 10 40 10 C 40 15 40 25 40 30 C 35 30 5 30 0 30',
        'M 0 10 C 5 10 35 10 40 10 M 40 30 C 35 30 5 30 0 30'],
    down: ['M 10 0 C 15 0 25 0 30 0 C 30 5 30 35 30 40 C 25 40 15 40 10 40 C 10 35 10 5 10 0',
        'M 30 0 C 30 5 30 35 30 40 M 10 40 C 10 35 10 5 10 0'],
    left: ['M 40 10 C 40 15 40 25 40 30 C 35 30 5 30 0 30 C 0 25 0 15 0 10 C 5 10 35 10 40 10',
        'M 40 30 C 35 30 5 30 0 30 M 0 10 C 5 10 35 10 40 10'],
    up: ['M 30 40 C 25 40 15 40 10 40 C 10 35 10 5 10 0 C 15 0 25 0 30 0 C 30 5 30 35 30 40',
        'M 10 40 C 10 35 10 5 10 0 M 30 0 C 30 5 30 35 30 40'],
});
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

const headPathD = rescaleSVG([
    'M 0 30 C 5 30 5 30 10 30 C 15 35 15 35 20 30 C 25 30 25 30 30 30 C 40 30 40 10 30 10 C 25 10 25 10 20 10 C 15 5 15 5 10 10 C 5 10 5 10 0 10',
    'M 33 15 C 34 16 34 17 33 18 M 33 25 C 34 24 34 23 33 22',
    'M 15 10 C 18 10 18 13 15 13 C 13 13 13 10 15 10 M 15 30 C 18 30 18 27 15 27 C 13 27 13 30 15 30',
    'M 15 10 C 18 10 18 13 15 13 C 18 13 18 10 15 10 M 15 30 C 18 30 18 27 15 27 C 18 27 18 30 15 30']);
// snake head
const headSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
headSVG.setAttribute('class', 'part');
headSVG.setAttribute('class', 'ends');
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

// foods as svg path
const ApplePathD = rescaleSVG(['M 20 11 C 26 10 30 14 30 20 C 30 26 26 30 20 30 C 14 30 10 26 10 20 C 10 14 14 10 20 11',
    'M 20 11 C 21 7 22 6 25 5 C 25 8 23 9 20 11']);
// snake tail
const appleSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
appleSVG.setAttribute('class', 'part');
appleSVG.style.position = 'absolute';
appleSVG.style.transition = 'all ' + (speed * 0.9) + 'ms';
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


// obstacle svg elements
const bladePathD = rescaleSVG(['M 20 5 C 30 10 15 20 35 20 C 30 30 20 15 20 35 C 10 30 25 20 5 20 C 10 10 20 25 20 5',
    'M 18 20 C 18 19 19 18 20 18 C 21 18 22 19 22 20 C 22 21 21 22 20 22 C 19 22 18 21 18 20']);
// blade obstacle
const bladeSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
bladeSVG.style.position = 'absolute';
const bladePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
bladePath.setAttribute('d', bladePathD[0]);
bladePath.setAttribute('fill', 'lightgray');
bladePath.setAttribute('stroke', 'black');
const bladeCenterPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
bladeCenterPath.setAttribute('d', bladePathD[1]);
bladeCenterPath.setAttribute('fill', 'darkgray');
bladeCenterPath.setAttribute('stroke', 'black');
const bladeAnimate = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
bladeAnimate.setAttribute('attributeName', 'transform');
bladeAnimate.setAttribute('attributeType', 'xml');
bladeAnimate.setAttribute('type', 'rotate');
bladeAnimate.setAttribute('from', `0 ${cellSize / 2} ${cellSize / 2}`);
bladeAnimate.setAttribute('to', `360 ${cellSize / 2} ${cellSize / 2}`);
bladeAnimate.setAttribute('dur', '1s');
bladeAnimate.setAttribute('repeatCount', 'indefinite');
bladePath.appendChild(bladeAnimate);
bladeSVG.appendChild(bladePath);
bladeSVG.appendChild(bladeCenterPath);

// playing board to hold all snake elements
let board = document.createElement('div');
board.style.position = 'relative';
board.style.margin = '0 auto';
board.style.width = boardSize[0] * cellSize + 'px';
board.style.height = boardSize[1] * cellSize + 'px';
board.style.backgroundColor = 'lightgreen';
board.style.boxShadow = '0 0 5px black';
document.body.appendChild(board);

//drawing the grid on the board
let grid = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
grid.style.position = 'absolute';
grid.style.top = '0';
grid.style.left = '0';
grid.setAttribute('width', board.clientWidth.toString());
grid.setAttribute('height', board.clientHeight.toString());

function drawLine(x1, y1, x2, y2) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', 'black');
    line.setAttribute('opacity', '0.15');
    line.setAttribute('stroke-dasharray', '10, 2');
    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    grid.appendChild(line);
}

for (let i = cellSize; i < board.clientHeight; i += cellSize) {
    drawLine(0, i, board.clientWidth, i);
}
for (let i = cellSize; i < board.clientWidth; i += cellSize) {
    drawLine(i, 0, i, board.clientHeight);
}
board.appendChild(grid);

function rescaleSVG(svgPaths) {

    if (cellSize === 40) {
        return svgPaths;
    }

    function rescalePath(path) {
        let newPath = path.split(' ');
        newPath.forEach(function (value, index) {
            // noinspection JSCheckFunctionSignatures
            if (isFinite(value)) {
                newPath[index] = value * cellSize / 40;
            }
        });
        return newPath.join(' ').trim();
    }

    if (Array.isArray(svgPaths)) {
        svgPaths.forEach(function (path, index) {
            svgPaths[index] = rescalePath(path);
        });
    } else {
        for (let key in svgPaths) {
            svgPaths[key].forEach(function (path, index) {
                svgPaths[key][index] = rescalePath(path);
            });
        }
    }
    return svgPaths;
}

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
 *
 * @param path1 {string}
 * @param path2 {string}
 * @param t {number}
 * @return {string}
 */
function interpolate(path1, path2, t) {
    const parts1 = path1.split(' ');
    const parts2 = path2.split(' ');
    return parts1.map(function (value1, index) {

        // noinspection JSCheckFunctionSignatures
        if (isFinite(value1)) {
            return parseFloat(value1) + (parseFloat(parts2[index]) - parseFloat(value1)) * t;
        }
        return value1;
    }).join(' ');
}

function morph(path, path1, path2, snakePartI) {
    let start = null;
    let t = 0;
    let progress;

    if (path1 === null) {
        path1 = path.getAttribute('d');
    }

    function animateMorph(timestamp) {
        if (!start) {
            start = timestamp;
        }
        progress = timestamp - start;
        const duration = speed;
        let pt = t;
        t = (progress % duration) / duration;

        if (t >= pt) {
            const interp = interpolate(path1, path2, t);
            if (snakePartI === 1) {
                console.log(path1);
                console.log(path2);
            }
            path.setAttribute('d', interp);

            requestAnimationFrame(animateMorph);
        } else {
            path.setAttribute('d', path2);
        }
    }

    requestAnimationFrame(animateMorph);
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
    if (openBorder) {
        if (part.y < 0) {
            part.element.classList.toggle('part');
            part.y = (boardSize[1] - 1) * cellSize;
            setTimeout(function () {
                part.element.classList.toggle('part');
            }, speed / 10);
        } else if (part.y > (boardSize[1] - 1) * cellSize) {
            part.element.classList.toggle('part');
            part.y = 0;
            setTimeout(function () {
                part.element.classList.toggle('part');
            }, 10);
        } else if (part.x < 0) {
            part.element.classList.toggle('part');
            part.x = (boardSize[0] - 1) * cellSize;
            setTimeout(function () {
                part.element.classList.toggle('part');
            }, speed / 10);
        } else if (part.x > (boardSize[0] - 1) * cellSize) {
            part.element.classList.toggle('part');
            part.x = 0;
            setTimeout(function () {
                part.element.classList.toggle('part');
            }, 10);
        }
    } else {
        if (part.type === 'head' && (part.y < 0 || part.y > (boardSize[1] - 1) * cellSize ||
            part.x < 0 || part.x > (boardSize[0] - 1) * cellSize)) {
            console.log('game over');
            start = false;
        }
    }
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
 * @param x {number}
 * @param y {number}
 * @param scale {number}
 * @return {{x: number, y: number, type, element: Node, direction}}
 */
let newPart = function (type, direction, x = 0, y = 0, scale = 1) {
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
    absoluteMove(element, x, y);
    element.style.scale = scale.toString();
    board.appendChild(element);
    return {
        element: element,
        type,
        direction,
        x,
        y,
    };
};

let newFood = function (type, x, y) {
    let element;
    switch (type) {
        case 'apple':
            element = appleSVG.cloneNode(true);
    }
    absoluteMove(element, x, y);
    board.appendChild(element);
    return {
        element: element,
        type,
        x,
        y,
    };
};

let newObstacle = function (type, x, y) {
    let element;
    switch (type) {
        case 'blade':
            element = bladeSVG.cloneNode(true);
    }
    absoluteMove(element, x, y);
    board.appendChild(element);
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

function spawnBlade(type) {
    let x, y;
    let snakePos = [];
    snake.forEach(function (part) {
        snakePos.push([part.x, part.y].join('_'));
    });
    let foodPos = [];
    foods.forEach(function (part) {
        foodPos.push([part.x, part.y].join('_'));
    });
    let obstaclePos = [];
    obstacles.forEach(function (part) {
        obstaclePos.push([part.x, part.y].join('_'));
    });
    do {
        x = Math.floor(Math.random() * boardSize[0]) * cellSize;
        y = Math.floor(Math.random() * boardSize[1]) * cellSize;
    } while (snakePos.includes([x, y].join('_')) || foodPos.includes([x, y].join('_')) || obstaclePos.includes([x, y].join('_')));
    obstacles.push(newObstacle(type, x, y));
}

function spawnFood() {
    let foodPos, foodPosStr, count = 0, snakePos = [], obstaclePos = [];
    snake.forEach(function (part) {
        snakePos.push([part.x, part.y].join('_'));
    });
    obstacles.forEach(function (part) {
        obstaclePos.push([part.x, part.y].join('_'));
    });
    do {
        count++;
        foodPos = [Math.floor(Math.random() * boardSize[0]) * cellSize, Math.floor(Math.random() * boardSize[1]) * cellSize];
        foodPosStr = foodPos.join('_');
    } while (obstaclePos.includes(foodPosStr) || (snakePos.includes(foodPosStr) && count <= 20));
    foods.push(newFood('apple', foodPos[0], foodPos[1]));
    foods.at(-1).element.style.transform = 'scale(0)';
    setTimeout(function () {
        foods.at(-1).element.style.transform = 'scale(1)';
    }, 10);
}

/**
 * the function to move the whole snake to the direction that the user is pointing it to
 */
function moveSnake() {
    let pastDirections = [];
    let pastHeadPos = [snake.at(0).x, snake.at(0).y];
    for (const part of snake) {
        pastDirections.push(part.direction);
    }
    if (direction !== snake.at(0).direction) {
        rotatePart(snake.at(0), isClockwise(snake.at(0).direction, direction));
    }
    movePart(snake.at(0), direction);
    snake.at(0).direction = direction;

    if (eatFood()) {
        growSnake(pastDirections[0], pastHeadPos[0], pastHeadPos[1]);
    } else {
        for (let i = 1; i < snake.length; i++) {
            if (['body', 'bodyC'].includes(snake.at(i).type) && pastDirections[i - 1] !== snake.at(i - 1).direction) {
                snake.at(i).type = 'bodyC';
                let children = snake.at(i).element.children;
                let curveDirection = [pastDirections[i - 1], snake.at(i - 1).direction].join('_');
                morph(children[0], children[0].getAttribute('d'), bodyCurvedD[curveDirection][0]);
                morph(children[1], children[1].getAttribute('d'), bodyCurvedD[curveDirection][1]);
                // children[0].setAttribute('d', bodyCurvedD[curveDirection][0]);
                // children[1].setAttribute('d', bodyCurvedD[curveDirection][1]);
            } else if (snake.at(i).type === 'bodyC' && pastDirections[i - 1] === snake.at(i - 1).direction) {
                snake.at(i).type = 'body';
                let children = snake.at(i).element.children;
                let straightDirection = snake.at(i - 1).direction;
                morph(children[0], children[0].getAttribute('d'), bodyStraightD[straightDirection][0]);
                morph(children[1], children[1].getAttribute('d'), bodyStraightD[straightDirection][1]);
                // children[0].setAttribute('d', bodyStraightD[straightDirection][0]);
                // children[1].setAttribute('d', bodyStraightD[straightDirection][1]);
            } else {
                if (pastDirections[i - 1] !== snake.at(i - 1).direction) {
                    rotatePart(snake.at(i), isClockwise(pastDirections[i - 1], snake.at(i - 1).direction));
                }
            }
            movePart(snake.at(i), pastDirections[i - 1]);
            snake.at(i).direction = pastDirections[i - 1];
        }
    }
}

function collision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake.at(0).x === snake.at(i).x && snake.at(0).y === snake.at(i).y) {
            console.log('game over');
            start = false;
            return true;
        }
    }
    for (let i = 0; i < obstacles.length; i++) {
        if (snake.at(0).x === obstacles.at(i).x && snake.at(0).y === obstacles.at(i).y) {
            console.log('game over');
            start = false;
            return true;
        }
    }
    return false;
}

function eatFood() {
    let ateFood = false;
    foods.forEach(function (food, i) {
        if (snake.at(0).x === food.x && snake.at(0).y === food.y) {
            food.element.style.transform = 'scale(0)';
            spawnFood();
            setTimeout(function () {
                food.element.remove();
                foods.splice(i, 1);
            }, speed * 0.9);
            ateFood = true;
        }
    });
    return ateFood;
}

function growSnake(pastHeadDir, x, y) {
    let part;
    if (snake.at(0).direction === pastHeadDir) {
        part = newPart('body', pastHeadDir, x, y, 0);
        part.element.children[0].setAttribute('d', bodyStraightD[snake.at(0).direction][0]);
        part.element.children[1].setAttribute('d', bodyStraightD[snake.at(0).direction][1]);
    } else {
        part = newPart('bodyC', pastHeadDir, x, y, 0);
        let newPartDir = [pastHeadDir, snake.at(0).direction].join('_');
        part.element.children[0].setAttribute('d', bodyCurvedD[newPartDir][0]);
        part.element.children[1].setAttribute('d', bodyCurvedD[newPartDir][1]);
    }
    snake.splice(1, 0, part);
    setTimeout(function () {
        snake.at(1).element.style.scale = '1';
    }, 50);
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
setInterval(function () {
    if (start === false) {
        return;
    }
    moveSnake();
    collision();
}, speed);

document.addEventListener('keydown', function (event) {
    // console.log(event.code);
    keyPressed(event.code);
});

let touchPos = [[], []];
board.addEventListener('touchstart', function (event) {
    event.preventDefault();
    touchPos[0] = [event.changedTouches[0].screenX, event.changedTouches[0].screenY];
});

document.addEventListener('touchmove', function (event) {
    touchPos[1] = [event.changedTouches[0].screenX, event.changedTouches[0].screenY];
    touchToKey();
});

document.addEventListener('touchend', function () {
    touchPos = [[], []];
});

function touchToKey() {
    let touchThreshold = cellSize * 0.75;
    if (Math.abs(touchPos[1][0] - touchPos[0][0]) > Math.abs(touchPos[1][1] - touchPos[0][1])) {
        if (touchPos[1][0] - touchPos[0][0] > touchThreshold) {
            keyPressed('ArrowRight');
            touchPos[0] = touchPos[1];
        } else if (touchPos[1][0] - touchPos[0][0] < -touchThreshold) {
            keyPressed('ArrowLeft');
            touchPos[0] = touchPos[1];
        }
    } else if (Math.abs(touchPos[1][0] - touchPos[0][0]) < Math.abs(touchPos[1][1] - touchPos[0][1])) {
        if (touchPos[1][1] - touchPos[0][1] > touchThreshold) {
            keyPressed('ArrowDown');
            touchPos[0] = touchPos[1];
        } else if (touchPos[1][1] - touchPos[0][1] < -touchThreshold) {
            keyPressed('ArrowUp');
            touchPos[0] = touchPos[1];

        }
    }
}

function keyPressed(key) {
    function startTrue() {
        if (!start) {
            start = true;
        }
    }

    switch (key) {
        case 'ArrowUp':
        case 'KeyW':
            if (snake.at(0).direction !== 'down') {
                direction = 'up';
                startTrue();
            }
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (snake.at(0).direction !== 'left') {
                direction = 'right';
                startTrue();
            }
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (snake.at(0).direction !== 'up') {
                direction = 'down';
                startTrue();
            }
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (snake.at(0).direction !== 'right') {
                direction = 'left';
                startTrue();
            }
            break;
        case 'Space':
            start = !start;
            break;
    }
}

let style = document.styleSheets[0];
let rules = style.cssRules;
rules[0]['style']['transition'] = 'top ' + speed + 'ms linear, ' + 'left ' + speed + 'ms linear';
rules[1]['style']['transition'] = 'top ' + speed + 'ms linear, ' + 'left ' + speed + 'ms linear';
rules[1]['style']['width'] = cellSize + 'px';
rules[1]['style']['height'] = cellSize + 'px';
rules[2]['style']['transition'] = 'all ' + speed + 'ms linear';
rules[3]['style']['transition'] = 'all ' + speed + 'ms linear';

let snake = [];
let foods = [];
let obstacles = [];

function newBoard() {
    snake = [];
    foods = [];
    obstacles = [];

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

    spawnFood();

    for (let i = 0; i < 5; i++) {
        spawnBlade('blade');
    }
}

newBoard();

setTimeout(function () {
    foods.at(-1).element.style.transform = 'scale(1)';
}, 1);
