let cube = document.getElementsByClassName('cube')[0];
let container = document.getElementsByClassName('cube-container')[0];

// degrees for x and y rotations
let xDegree = -30;
let yDegree = 30;
let zDegree = 0;
let firstDraw = true;
cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg) rotateZ(${zDegree}deg)`;  // initial transform values

// setting transition duration
const transitionDuration = 5000;
const transitionDurationOnKey = 500;
cube.style.transition = transitionDuration + 'ms ease-in-out';

let touchStart = 0;
let touchEnd = 0;
let swiping = false;

let lastClicked = Date.now() - transitionDuration;

// click event
cube.addEventListener('click', function () {
    cube.style.transition = transitionDuration + 'ms ease-in-out';
    if (Date.now() - lastClicked > transitionDuration) {
        let result;
        [xDegree, yDegree, zDegree, result] = randomRotation();
        cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg) rotateZ(${zDegree}deg)`;
        lastClicked = Date.now();
        let resultElement = document.getElementsByClassName('result')[0];
        resultElement.style.transform = 'scale(0)';
        resultElement.style.transition = (transitionDuration * 4 / 5) + 'ms';
        resultElement.style.opacity = '0';

        function showResult() {
            if (firstDraw) {
                let resultContainer = document.getElementsByClassName('result-container')[0];
                resultContainer.style.transition = (transitionDuration / 5) + 'ms';
                resultContainer.style.transform = 'scale(1)';
                firstDraw = false;
            }
            resultElement.innerHTML = result.toString();
            resultElement.style.transform = 'scale(1)';
            resultElement.style.transition = (transitionDuration / 5) + 'ms';
            resultElement.style.opacity = '1';
        }

        setTimeout(showResult, transitionDuration * 0.8);
    }
});

// handling arrow keys
function keyPressed(key) {
    cube.style.transition = transitionDurationOnKey + 'ms ease-in-out';
    switch (key) {
        case 'ArrowRight':
            yDegree += 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg) rotateZ(${zDegree}deg)`;
            break;
        case 'ArrowLeft':
            yDegree -= 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg) rotateZ(${zDegree}deg)`;
            break;
        case 'ArrowUp':
            xDegree += 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg) rotateZ(${zDegree}deg)`;
            break;
        case 'ArrowDown':
            xDegree -= 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg) rotateZ(${zDegree}deg)`;
            break;
        case '6':
            zDegree += 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg) rotateZ(${zDegree}deg)`;
            break;
        case '4':
            zDegree -= 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg) rotateZ(${zDegree}deg)`;
            break;
    }
}

// keypress events
document.addEventListener('keydown', function (event) {
    if (event.repeat || Date.now() - lastClicked <= transitionDuration) {
        return;
    }
    keyPressed(event.key);
});

// swipe events
container.addEventListener('touchstart', function (event) {
    event.preventDefault();
    swiping = true;
    touchStart = [event.changedTouches[0].screenX, event.changedTouches[0].screenY];
});
document.addEventListener('touchend', function (event) {
    touchEnd = [event.changedTouches[0].screenX, event.changedTouches[0].screenY];
    if (swiping === true) {
        swipeRotate();
    }
    swiping = false;
});

function swipeRotate() {
    if (Math.abs(touchEnd[0] - touchStart[0]) > 2 * Math.abs(touchEnd[1] - touchStart[1])) {
        if (touchEnd[0] - touchStart[0] > 20) {
            keyPressed('ArrowRight');
        } else if (touchEnd[0] - touchStart[0] < -20) {
            keyPressed('ArrowLeft');
        }
    } else if (2 * Math.abs(touchEnd[0] - touchStart[0]) < Math.abs(touchEnd[1] - touchStart[1])) {
        if (touchEnd[1] - touchStart[1] > 20) {
            keyPressed('ArrowDown');
        } else if (touchEnd[1] - touchStart[1] < -20) {
            keyPressed('ArrowUp');
        }
    } else if (Math.abs(touchEnd[0] - touchStart[0]) <= 20 && Math.abs(touchEnd[1] - touchStart[1]) <= 20) {
        cube.dispatchEvent(new MouseEvent('click'));
    }
}

function randomRotation() {
    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    let randomDice = Math.floor(Math.random() * 6) + 1;
    let xDeg, yDeg, zDeg;
    switch (randomDice) {
        case 1:
            xDeg = yDeg = randomChoice([0, 180]);
            zDeg = randomChoice([0, 90, 180, 270]);
            break;
        case 2:
            xDeg = randomChoice([0, 90, 180, 270]);
            switch (xDeg) {
                case 0:
                    yDeg = randomChoice([90, 270]);
                    switch (yDeg) {
                        case 90:
                            zDeg = 180;
                            break;
                        case 270:
                            zDeg = 0;
                            break;
                    }
                    break;
                case 90:
                    yDeg = randomChoice([0, 90, 180, 270]);
                    zDeg = 90;
                    break;
                case 180:
                    yDeg = randomChoice([90, 270]);
                    switch (yDeg) {
                        case 90:
                            zDeg = 0;
                            break;
                        case 270:
                            zDeg = 180;
                            break;
                    }
                    break;
                case 270:
                    yDeg = randomChoice([0, 90, 180, 270]);
                    zDeg = 270;
                    break;
            }
            break;
        case 3:
            xDeg = randomChoice([0, 90, 180, 270]);
            switch (xDeg) {
                case 0:
                    yDeg = randomChoice([90, 270]);
                    switch (yDeg) {
                        case 90:
                            zDeg = 90;
                            break;
                        case 270:
                            zDeg = 270;
                            break;
                    }
                    break;
                case 90:
                    yDeg = randomChoice([0, 90, 180, 270]);
                    zDeg = 0;
                    break;
                case 180:
                    yDeg = randomChoice([90, 270]);
                    switch (yDeg) {
                        case 90:
                            zDeg = 270;
                            break;
                        case 270:
                            zDeg = 90;
                            break;
                    }
                    break;
                case 270:
                    yDeg = randomChoice([0, 90, 180, 270]);
                    zDeg = 180;
                    break;
            }
            break;
        case 4:
            xDeg = randomChoice([0, 90, 180, 270]);
            switch (xDeg) {
                case 0:
                    yDeg = randomChoice([90, 270]);
                    switch (yDeg) {
                        case 90:
                            zDeg = 270;
                            break;
                        case 270:
                            zDeg = 90;
                            break;
                    }
                    break;
                case 90:
                    yDeg = randomChoice([0, 90, 180, 270]);
                    zDeg = 180;
                    break;
                case 180:
                    yDeg = randomChoice([90, 270]);
                    switch (yDeg) {
                        case 90:
                            zDeg = 90;
                            break;
                        case 270:
                            zDeg = 270;
                            break;
                    }
                    break;
                case 270:
                    yDeg = randomChoice([0, 90, 180, 270]);
                    zDeg = 0;
                    break;
            }
            break;
        case 5:
            xDeg = randomChoice([0, 90, 180, 270]);
            switch (xDeg) {
                case 0:
                    yDeg = randomChoice([90, 270]);
                    switch (yDeg) {
                        case 90:
                            zDeg = 0;
                            break;
                        case 270:
                            zDeg = 180;
                            break;
                    }
                    break;
                case 90:
                    yDeg = randomChoice([0, 90, 180, 270]);
                    zDeg = 270;
                    break;
                case 180:
                    yDeg = randomChoice([90, 270]);
                    switch (yDeg) {
                        case 90:
                            zDeg = 180;
                            break;
                        case 270:
                            zDeg = 0;
                            break;
                    }
                    break;
                case 270:
                    yDeg = randomChoice([0, 90, 180, 270]);
                    zDeg = 90;
                    break;
            }
            break;
        case 6:
            xDeg = randomChoice([0, 180]);
            yDeg = Math.abs(xDeg - 180);
            zDeg = randomChoice([0, 90, 180, 270]);
            break;

    }
    do {
        xDeg += Math.floor(Math.random() * 6) * 360;
    } while (xDeg - xDegree < 360);
    do {
        yDeg += Math.floor(Math.random() * 6) * 360;
    } while (xDeg - xDegree < 360);
    do {
        zDeg += Math.floor(Math.random() * 6) * 360;
    } while (xDeg - xDegree < 360);
    return [xDeg, yDeg, zDeg, randomDice];
}
