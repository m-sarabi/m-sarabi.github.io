let cube = document.getElementsByClassName('cube')[0];
let container = document.getElementsByClassName('cube-container')[0];

// degrees for x and y rotations
let xDegree = -30;
let yDegree = 30;
cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;  // initial transform values

// setting transition duration
const transitionDuration = 5000;
const transitionDurationOnKey = 500;
cube.style.transition = transitionDuration / 1000 + 's ease-in-out';

let touchStart = 0;
let touchEnd = 0;
let swiping = false;

let lastClicked = Date.now() - transitionDuration;

// click event
cube.addEventListener('click', function () {
    cube.style.transition = transitionDuration / 1000 + 's ease-in-out';
    if (Date.now() - lastClicked > transitionDuration) {
        [xDegree, yDegree] = randomRotation();
        cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;
        lastClicked = Date.now();
    }
});

// handling arrow keys
function keyPressed(key) {
    cube.style.transition = transitionDurationOnKey / 1000 + 's ease-in-out';
    switch (key) {
        case 'ArrowRight':
            yDegree += 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;
            break;
        case 'ArrowLeft':
            yDegree -= 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;
            break;
        case 'ArrowUp':
            xDegree += 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;
            break;
        case 'ArrowDown':
            xDegree -= 15;
            cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;
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
    let xRot, yRot;
    do {
        xRot = (Math.floor(Math.random() * 48) + 12) * 90;
    } while (Math.abs(xRot - xDegree) <= 180);
    do {
        yRot = (Math.floor(Math.random() * 48) + 12) * 90;
    } while (Math.abs(yRot - yDegree) <= 180);
    return [xRot, yRot];
}