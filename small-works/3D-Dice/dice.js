let cube = document.getElementsByClassName('cube')[0];

// degrees for x and y rotations
let xDegree = -30;
let yDegree = 30;
cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;  // initial transform values

cube.addEventListener('click', function () {
    [xDegree, yDegree] = randomRotation();
    cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;
});

function randomRotation() {
    let xRot, yRot;
    do {
        xRot = (Math.floor(Math.random() * 48) + 12) * 90;
        console.log(xRot - xDegree)
    } while (Math.abs(xRot - xDegree) <= 180);
    do {
        yRot = (Math.floor(Math.random() * 48) + 12) * 90;
        console.log(yRot - yDegree)
    } while (Math.abs(yRot - yDegree) <= 180);
    return [xRot, yRot];
}