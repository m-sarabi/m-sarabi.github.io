const cellSize = 40;
const speed = 500;
let boardSize = [10, 15];
let openBorder = true;

// all the svg parts and shapes are built with only cubic bézier curves

// snake parts in svg path
const tailPathD = rescaleSVG({
    right: ['M 40 10 C 35 10 15 10 10 10 C 0 10 0 30 10 30 C 15 30 35 30 40 30'],
    down: ['M 30 40 C 30 35 30 15 30 10 C 30 0 10 0 10 10 C 10 15 10 35 10 40'],
    left: ['M 0 30 C 5 30 25 30 30 30 C 40 30 40 10 30 10 C 25 10 5 10 0 10'],
    up: ['M 10 0 C 10 5 10 25 10 30 C 10 40 30 40 30 30 C 30 25 30 5 30 0']
});
// snake tail
const tailSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
tailSVG.setAttribute('class', 'part');
tailSVG.style.position = 'absolute';
const tailPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
tailPath.setAttribute('d', tailPathD['right'][0]);
tailPath.setAttribute('fill', 'orange');
tailPath.setAttribute('stroke', 'black');
tailSVG.appendChild(tailPath);

const bodyCurvedD = rescaleSVG({
    right_down: ['M 0 30 C 0 26.6667 0 23.3333 0 20 C 0 16.6667 0 13.3333 0 10 C 7 10 15 14 20.5 19.5 C 26 25 30 33 30 40 C 26.6667 40 23.3333 40 20 40 C 16.6667 40 13.3333 40 10 40 C 10 37 9 35 7 33 C 5 31 3 30 0 30',
        'M 0 10 C 7 10 15 14 20.5 19.5 C 26 25 30 33 30 40 M 10 40 C 10 38 9 35 7 33 C 5 31 2 30 0 30'],
    down_left: ['M 10 0 C 13.3333 0 16.6667 0 20 0 C 23.3333 0 26.6667 0 30 0 C 30 7 26 15 20.565 20.542 C 15 26 7 30 0 30 C 0 26.6667 0 23.3333 0 20 C 0 16.6667 0 13.3333 0 10 C 3 10 5 9 7 7 C 9 5 10 3 10 0',
        'M 30 0 C 30 7 26 15 20.5 20.5 C 15 26 7 30 0 30 M 0 10 C 3 10 5 9 7 7 C 9 5 10 3 10 0'],
    left_up: ['M 40 10 C 40 13.3333 40 16.6667 40 20 C 40 23.3333 40 26.6667 40 30 C 33 30 25 26 19.5 20.5 C 14 15 10 7 10 0 C 13.3333 0 16.6667 0 20 0 C 23.3333 0 26.6667 0 30 0 C 30 3 31 5 33 7 C 35 9 37 10 40 10',
        'M 40 30 C 33 30 25 26 19.5 20.5 C 14 15 10 7 10 0 M 30 0 C 30 3 31 5 33 7 C 35 9 37 10 40 10'],
    up_right: ['M 30 40 C 26.6667 40 23.3333 40 20 40 C 16.6667 40 13.3333 40 10 40 C 10 33 14 25 19.5 19.5 C 25 14 33 10 40 10 C 40 13.3333 40 16.6667 40 20 C 40 23.3333 40 26.6667 40 30 C 37 30 35 31 33 33 C 31 35 30 37 30 40',
        'M 10 40 C 10 33 14 25 19.569 19.557 C 25 14 33 10 40 10 M 40 30 C 37 30 35 31 33 33 C 31 35 30 37 30 40'],

    up_left: ['M 30 40 C 26.6667 40 23.3333 40 20 40 C 16.6667 40 13.3333 40 10 40 C 10 37 9 35 7 33 C 5 31 3 30 0 30 C 0 26.6667 0 23.3333 0 20 C 0 16.6667 0 13.3333 0 10 C 7 10 15 14 20.5 19.5 C 26 25 30 33 30 40',
        'M 10 40 C 10 37 9 35 7 33 C 5 31 3 30 0 30 M 0 10 C 7 10 15 14 20.5 19.5 C 26 25 30 33 30 40'],
    right_up: ['M 0 30 C 0 26.6667 0 23.3333 0 20 C 0 16.6667 0 13.3333 0 10 C 3 10 5 9 7 7 C 9 5 10 3 10 0 C 13.3333 0 16.6667 0 20 0 C 23.3333 0 26.6667 0 30 0 C 30 7 26 15 20.5 20.5 C 15 26 7 30 0 30',
        'M 0 10 C 3 10 5 9 7 7 C 9 5 10 3 10 0 M 30 0 C 30 7 26 15 20.544 20.608 C 15 26 7 30 0 30'],
    down_right: ['M 10 0 C 13.3333 0 16.6667 0 20 0 C 23.3333 0 26.6667 0 30 0 C 30 3 31 5 33 7 C 35 9 37 10 40 10 C 40 13.3333 40 16.6667 40 20 C 40 23.3333 40 26.6667 40 30 C 33 30 25 26 19.5 20.5 C 14 15 10 7 10 0',
        'M 30 0 C 30 3 31 5 33 7 C 35 9 37 10 40 10 M 40 30 C 33 30 25 26 19.5 20.5 C 14 15 10 7 10 0'],
    left_down: ['M 40 10 C 40 13.3333 40 16.6667 40 20 C 40 23.3333 40 26.6667 40 30 C 37 30 35 31 33 33 C 31 35 30 37 30 40 C 26.6667 40 23.3333 40 20 40 C 16.6667 40 13.3333 40 10 40 C 10 33 14 25 19.5 19.5 C 25 14 33 10 40 10',
        'M 40 30 C 37 30 35 31 33 33 C 31 35 30 37 30 40 M 10 40 C 10 33 14 25 19.5 19.5 C 25 14 33 10 40 10'],
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
    right: ['M 0 30 C 0 26.6667 0 23.3333 0 20 C 0 16.6667 0 13.3333 0 10 C 6.6667 10 13.3333 10 20 10 C 26.6667 10 33.3333 10 40 10 C 40 13.3333 40 16.6667 40 20 C 40 23.3333 40 26.6667 40 30 C 33.3333 30 26.6667 30 20 30 C 13.3333 30 6.6667 30 0 30',
        'M 0 10 C 6.6667 10 13.3333 10 20 10 C 26.6667 10 33.3333 10 40 10 M 40 30 C 33.3333 30 26.6667 30 20 30 C 13.3333 30 6.6667 30 0 30'],
    down: ['M 10 0 C 13.3333 0 16.6667 0 20 0 C 23.3333 -0 26.6667 -0 30 -0 C 30 6.6667 30 13.3333 30 20 C 30 26.6667 30 33.3333 30 40 C 26.6667 40 23.3333 40 20 40 C 16.6667 40 13.3333 40 10 40 C 10 33.3333 10 26.6667 10 20 C 10 13.3333 10 6.6667 10 0',
        'M 30 -0 C 30 6.6667 30 13.3333 30 20 C 30 26.6667 30 33.3333 30 40 M 10 40 C 10 33.3333 10 26.6667 10 20 C 10 13.3333 10 6.6667 10 0'],
    left: ['M 40 10 C 40 13.3333 40 16.6667 40 20 C 40 23.3333 40 26.6667 40 30 C 33.3333 30 26.6667 30 20 30 C 13.3333 30 6.6667 30 0 30 C 0 26.6667 0 23.3333 0 20 C 0 16.6667 0 13.3333 0 10 C 6.6667 10 13.3333 10 20 10 C 26.6667 10 33.3333 10 40 10',
        'M 40 30 C 33.3333 30 26.6667 30 20 30 C 13.3333 30 6.6667 30 0 30 M 0 10 C 6.6667 10 13.3333 10 20 10 C 26.6667 10 33.3333 10 40 10'],
    up: ['M 30 40 C 26.6667 40 23.3333 40 20 40 C 16.6667 40 13.3333 40 10 40 C 10 33.3333 10 26.6667 10 20 C 10 13.3333 10 6.6667 10 0 C 13.3333 0 16.6667 0 20 0 C 23.3333 -0 26.6667 -0 30 -0 C 30 6.6667 30 13.3333 30 20 C 30 26.6667 30 33.3333 30 40',
        'M 10 40 C 10 33.3333 10 26.6667 10 20 C 10 13.3333 10 6.6667 10 0 M 30 -0 C 30 6.6667 30 13.3333 30 20 C 30 26.6667 30 33.3333 30 40'],
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

const headPathD = rescaleSVG({
    right: ['M 0 30 C 5 30 5 30 10 30 C 15 35 15 35 20 30 C 25 30 25 30 30 30 C 40 30 40 10 30 10 C 25 10 25 10 20 10 C 15 5 15 5 10 10 C 5 10 5 10 0 10',
        'M 33 15 C 34 16 34 17 33 18 M 33 25 C 34 24 34 23 33 22',
        'M 15 10 C 18 10 18 13 15 13 C 13 13 13 10 15 10 M 15 30 C 18 30 18 27 15 27 C 13 27 13 30 15 30',
        'M 15 11 C 15.67 11 15.67 12 15 12 C 14.33 12 14.33 11 15 11 M 15 29 C 15.67 29 15.67 28 15 28 C 14.33 28 14.33 29 15 29'],
    down: ['M 10 0 C 10 5 10 5 10 10 C 5 15 5 15 10 20 C 10 25 10 25 10 30 C 10 40 30 40 30 30 C 30 25 30 25 30 20 C 35 15 35 15 30 10 C 30 5 30 5 30 -0',
        'M 25 33 C 24 34 23 34 22 33 M 15 33 C 16 34 17 34 18 33',
        'M 30 15 C 30 18 27 18 27 15 C 27 13 30 13 30 15 M 10 15 C 10 18 13 18 13 15 C 13 13 10 13 10 15',
        'M 29 15 C 29 15.67 28 15.67 28 15 C 28 14.33 29 14.33 29 15 M 11 15 C 11 15.67 12 15.67 12 15 C 12 14.33 11 14.33 11 15'],
    left: ['M 40 10 C 35 10 35 10 30 10 C 25 5 25 5 20 10 C 15 10 15 10 10 10 C 0 10 0 30 10 30 C 15 30 15 30 20 30 C 25 35 25 35 30 30 C 35 30 35 30 40 30',
        'M 7 25 C 6 24 6 23 7 22 M 7 15 C 6 16 6 17 7 18',
        'M 25 30 C 22 30 22 27 25 27 C 27 27 27 30 25 30 M 25 10 C 22 10 22 13 25 13 C 27 13 27 10 25 10',
        'M 25 29 C 24.33 29 24.33 28 25 28 C 25.67 28 25.67 29 25 29 M 25 11 C 24.33 11 24.33 12 25 12 C 25.67 12 25.67 11 25 11'],
    up: ['M 30 40 C 30 35 30 35 30 30 C 35 25 35 25 30 20 C 30 15 30 15 30 10 C 30 -0 10 0 10 10 C 10 15 10 15 10 20 C 5 25 5 25 10 30 C 10 35 10 35 10 40',
        'M 15 7 C 16 6 17 6 18 7 M 25 7 C 24 6 23 6 22 7',
        'M 10 25 C 10 22 13 22 13 25 C 13 27 10 27 10 25 M 30 25 C 30 22 27 22 27 25 C 27 27 30 27 30 25',
        'M 11 25 C 11 24.33 12 24.33 12 25 C 12 25.67 11 25.67 11 25 M 29 25 C 29 24.33 28 24.33 28 25 C 28 25.67 29 25.67 29 25'],

});
// snake head
const headSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
headSVG.setAttribute('class', 'part');
headSVG.setAttribute('class', 'ends');
headSVG.style.position = 'absolute';
const headMain = document.createElementNS('http://www.w3.org/2000/svg', 'path');
headMain.setAttribute('d', headPathD.right[0]);
headMain.setAttribute('fill', 'orange');
headMain.setAttribute('stroke', 'black');
const headNose = document.createElementNS('http://www.w3.org/2000/svg', 'path');
headNose.setAttribute('d', headPathD.right[1]);
headNose.setAttribute('fill', 'transparent');
headNose.setAttribute('stroke', 'black');
headNose.setAttribute('stroke-linecap', 'round');
const headEyes = document.createElementNS('http://www.w3.org/2000/svg', 'path');
headEyes.setAttribute('d', headPathD.right[2]);
headEyes.setAttribute('fill', 'white');
headEyes.setAttribute('stroke', 'black');
const headPupil = document.createElementNS('http://www.w3.org/2000/svg', 'path');
headPupil.setAttribute('d', headPathD.right[3]);
headPupil.setAttribute('fill', 'black');
headPupil.setAttribute('stroke', 'black');
headPupil.setAttribute('stroke-width', '0.5');
headSVG.appendChild(headMain);
headSVG.appendChild(headNose);
headSVG.appendChild(headEyes);
headSVG.appendChild(headPupil);
// headSVG.appendChild(headGroup);

// foods as svg path
const ApplePathD = rescaleSVG(['M 20 11 C 26 10 30 14 30 20 C 30 26 26 30 20 30 C 14 30 10 26 10 20 C 10 14 14 10 20 11',
    'M 20 11 C 21 7 22 6 25 5 C 25 8 23 9 20 11']);
// apple food
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


// portal on the border teleporting
const portalPathD = rescaleSVG({
    right: ['M 25 3 C 30 1 37 8 37 20 C 37 32 30 39 25 37 C 16 33 16 7 25 3'],
    down: ['M 37 25 C 39 30 32 37 20 37 C 8 37 1 30 3 25 C 7 16 33 16 37 25'],
    left: ['M 15 37 C 10 39 3 32 3 20 C 3 8 10 1 15 3 C 24 7 24 33 15 37'],
    up: ['M 3 15 C 1 10 8 3 20 3 C 32 3 39 10 37 15 C 33 24 7 24 3 15']
});
const portalSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
portalSVG.style.position = 'absolute';
portalSVG.style.transform = 'scale(0)';
const portalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
portalSVG.setAttribute('class', 'portal');
portalPath.setAttribute('d', portalPathD['left'][0]);
portalPath.setAttribute('fill', 'black');
portalPath.setAttribute('stroke', 'black');
portalSVG.appendChild(portalPath);

// playing board to hold all snake elements
let board = document.createElement('div');
board.style.position = 'relative';
board.style.overflow = 'hidden';
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

function rescaleSVG(svgPaths, scale = cellSize, center = false) {

    if (scale === 40) {
        return svgPaths;
    }

    function rescalePath(path) {
        let newPath = path.split(' ');
        newPath.forEach(function (value, index) {
            // noinspection JSCheckFunctionSignatures
            if (isFinite(value)) {
                newPath[index] = value * scale / 40;
                if (center) {
                    newPath[index] += (cellSize - scale) / 2;
                }
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
            return parseFloat(value1) + (parseFloat(parts2[index]) - parseFloat(value1)) * Math.min(t, 1);
        }
        return value1;
    }).join(' ');
}

function moveMorph(part, t, end = false, first = false) {
    let x, y;
    switch (part[1]) {
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
    if (first) {
        part[0].x += x;
        part[0].y += y;
        let crossed = [null];
        if (openBorder) {
            if (part[0].y < 0) {
                crossed = ['up', part[2][0], part[2][1]];
                part[0].y = (boardSize[1] - 1) * cellSize;
                part[2][1] = boardSize[1] * cellSize;
            } else if (part[0].y > (boardSize[1] - 1) * cellSize) {
                crossed = ['down', part[2][0], part[2][1]];
                part[0].y = 0;
                part[2][1] = -cellSize;
            } else if (part[0].x < 0) {
                crossed = ['left', part[2][0], part[2][1]];
                part[0].x = (boardSize[0] - 1) * cellSize;
                part[2][0] = boardSize[0] * cellSize;
            } else if (part[0].x > (boardSize[0] - 1) * cellSize) {
                crossed = ['right', part[2][0], part[2][1]];
                part[0].x = 0;
                part[2][0] = -cellSize;
            }
            if (crossed[0] !== null && part[0].type === 'head') {
                let portalID = 'I' + Math.floor(Math.random() * 1000);
                portals[portalID] = (portalSVG.cloneNode(true));
                portals[portalID].children[0].setAttribute('d', portalPathD[crossed[0]][0]);
                portals[portalID].style.left = crossed[1];
                portals[portalID].style.top = crossed[2];
                board.appendChild(portals[portalID]);
                setTimeout(function () {
                    portals[portalID].style.transform = 'scale(1)';
                }, speed * 0.1);
                setTimeout(function () {
                    portals[portalID].style.transform = 'scale(0)';
                }, (snake.length * 1.1) * speed);
                setTimeout(function () {
                    portals[portalID].remove();
                    delete portals[portalID];
                }, (snake.length * 1.2) * speed);
            }
        } else {
            if (part[0].type === 'head' && (part[0].y < 0 || part[0].y > (boardSize[1] - 1) * cellSize ||
                part[0].x < 0 || part[0].x > (boardSize[0] - 1) * cellSize)) {
                console.log('game over');
                start = false;
            }
        }
    }

    if (end) {
        part[0].element.style.left = part[2][0] + x + 'px';
        part[0].element.style.top = part[2][1] + y + 'px';
    } else {
        part[0].element.style.left = part[2][0] + x * t + 'px';
        part[0].element.style.top = part[2][1] + y * t + 'px';
    }
}

function morph(morphInfo, movingParts) {
    let start = null;
    let t = 0;
    let progress;

    for (let movingPart of movingParts) {
        moveMorph(movingPart, t, false, true);
    }

    function animateMorph(timestamp) {
        if (!start) {
            start = timestamp;
        }
        progress = timestamp - start;
        const duration = speed;
        let pt = t;
        t = (progress % duration) / (duration);

        if (t >= pt) {
            for (let part of morphInfo) {
                for (let childIndex = 1; childIndex < part.length; childIndex++) {
                    part[0][childIndex - 1].setAttribute('d', interpolate(part[childIndex][0], part[childIndex][1], t));
                }
            }
            for (let movingPart of movingParts) {
                moveMorph(movingPart, t);
            }

            requestAnimationFrame(animateMorph);
        } else {
            for (let part of morphInfo) {
                for (let childIndex = 1; childIndex < part.length; childIndex++) {
                    part[0][childIndex - 1].setAttribute('d', part[childIndex][1]);
                }
            }
            for (let movingPart of movingParts) {
                moveMorph(movingPart, t, true);
            }
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
    let children = part.element.children;
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
    let newDirections = [];
    newDirections[0] = direction;
    for (let i = 1; i < snake.length; i++) {
        newDirections.push(pastDirections[i - 1]);
    }
    let morphInfo = [], movingParts = [];

    if (eatFood()) {
        growSnake(pastDirections[0], pastHeadPos[0], pastHeadPos[1]);
        let paths, pathsSmall;
        let newPartDir = [pastDirections[0], direction].join('_');
        if (direction === pastDirections[0]) {
            paths = [bodyStraightD[snake.at(0).direction][0], bodyStraightD[snake.at(0).direction][1]];
            pathsSmall = rescaleSVG([bodyStraightD[snake.at(0).direction][0], bodyStraightD[snake.at(0).direction][1]], 1, true);
        } else {
            paths = [bodyCurvedD[newPartDir][0], bodyCurvedD[newPartDir][1]];
            pathsSmall = rescaleSVG([bodyCurvedD[newPartDir][0], bodyCurvedD[newPartDir][1]], 1, true);
        }
        morphInfo.push([snake.at(1).element.children,
            [pathsSmall[0], paths[0]],
            [pathsSmall[1], paths[1]]]);
    } else {
        for (let i = snake.length - 1; i > 0; i--) {
            if (['body', 'bodyC'].includes(snake.at(i).type) && pastDirections[i - 1] !== newDirections[i - 1]) {
                snake.at(i).type = 'bodyC';
                let children = snake.at(i).element.children;
                let curveDirection = [pastDirections[i - 1], newDirections[i - 1]].join('_');
                morphInfo.push([children,
                    [children[0].getAttribute('d'), bodyCurvedD[curveDirection][0]],
                    [children[1].getAttribute('d'), bodyCurvedD[curveDirection][1]]]);
            } else if (snake.at(i).type === 'bodyC' && pastDirections[i - 1] === newDirections[i - 1]) {
                snake.at(i).type = 'body';
                let children = snake.at(i).element.children;
                let straightDirection = newDirections[i - 1];
                morphInfo.push([children,
                    [children[0].getAttribute('d'), bodyStraightD[straightDirection][0]],
                    [children[1].getAttribute('d'), bodyStraightD[straightDirection][1]]]);
            } else {
                if (pastDirections[i - 1] !== newDirections[i - 1]) {
                    if (snake.at(i).type === 'tail') {
                        morphInfo.push([snake.at(i).element.children,
                            [tailPathD[pastDirections[i - 1]][0], tailPathD[newDirections[i - 1]][0]]]);
                    }
                    // else {
                    //     rotatePart(snake.at(i),
                    //     isClockwise(pastDirections[i - 1], newDirections[i - 1]));
                    // }
                }
            }
            movingParts.push([snake.at(i), pastDirections[i - 1], [snake.at(i).x, snake.at(i).y]]);
            // movePart(snake.at(i), pastDirections[i - 1]);
            snake.at(i).direction = pastDirections[i - 1];
        }
    }
    movingParts.push([snake.at(0), direction, [snake.at(0).x, snake.at(0).y]]);
    morph(morphInfo, movingParts);
    if (direction !== snake.at(0).direction) {
        morphInfo.push([snake.at(0).element.children,
            [headPathD[snake.at(0).direction][0], headPathD[direction][0]],
            [headPathD[snake.at(0).direction][1], headPathD[direction][1]],
            [headPathD[snake.at(0).direction][2], headPathD[direction][2]],
            [headPathD[snake.at(0).direction][3], headPathD[direction][3]]]);
        // rotatePart(snake.at(0), isClockwise(snake.at(0).direction, direction));
    }
    // movePart(snake.at(0), direction);
    snake.at(0).direction = direction;
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
    let part, pathsSmall;
    if (direction === pastHeadDir) {
        part = newPart('body', pastHeadDir, x, y);
        pathsSmall = rescaleSVG([bodyStraightD[snake.at(0).direction][0], bodyStraightD[snake.at(0).direction][1]], 1, true);
    } else {
        part = newPart('bodyC', pastHeadDir, x, y);
        let newPartDir = [pastHeadDir, direction].join('_');
        pathsSmall = rescaleSVG([bodyCurvedD[newPartDir][0], bodyCurvedD[newPartDir][1]], 1, true);
    }
    part.element.children[0].setAttribute('d', pathsSmall[0]);
    part.element.children[1].setAttribute('d', pathsSmall[1]);
    snake.splice(1, 0, part);
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
rules[0]['style']['width'] = cellSize + 'px';
rules[0]['style']['height'] = cellSize + 'px';
rules[1]['style']['transition'] = speed / 2 + 'ms';

let snake = [];
let foods = [];
let obstacles = [];
let portals = {};

function newBoard() {
    snake = [];
    foods = [];
    obstacles = [];

    snake.push(newPart('head', 'right', cellSize * 4));
    snake.at(0).element.style.zIndex = '10';
    snake.push(newPart('body', 'right', cellSize * 3));
    snake.push(newPart('body', 'right', cellSize * 2));
    snake.push(newPart('body', 'right', cellSize));
    snake.push(newPart('tail', 'right'));

    spawnFood();

    for (let i = 0; i < 5; i++) {
        spawnBlade('blade');
    }
}

newBoard();

setTimeout(function () {
    foods.at(-1).element.style.transform = 'scale(1)';
}, 1);
