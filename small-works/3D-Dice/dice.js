let cube = document.getElementsByClassName('cube')[0];

// degrees for x and y rotations
let xDegree = -30;
let yDegree = 30;
cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;  // initial transform values

// setting transition duration
const transitionDuration = 5000;
cube.style.transition = transitionDuration / 1000 + 's'

let lastClicked = Date.now() - transitionDuration;

cube.addEventListener('click', function () {
    if (Date.now() - lastClicked > transitionDuration) {
        [xDegree, yDegree] = randomRotation();
        cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;
        lastClicked = Date.now();
    }
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