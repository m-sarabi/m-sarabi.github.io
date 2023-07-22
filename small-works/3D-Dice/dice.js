let cube = document.getElementsByClassName('cube')[0];

// degrees for x and y rotations
let xDegree = -30;
let yDegree = 30;
cube.style.transform = `rotateX(${xDegree}deg) rotateY(${yDegree}deg)`;  // initial transform values
console.log(cube.style.transform);