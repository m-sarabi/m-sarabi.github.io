let cube = document.getElementsByClassName('cube')[0];

// degrees for x and y rotations
let xDegree = -30;
let yDegree = 30;
cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;  // initial transform values

// setting transition duration
const transitionDuration = 5000;
const transitionDurationOnKey = 500;
cube.style.transition = transitionDuration / 1000 + 's ease-in-out';

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