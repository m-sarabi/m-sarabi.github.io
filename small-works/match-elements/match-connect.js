// a list of the small image file names
let imgNames = ['apple', 'balloon', 'baseball-cap', 'coffee', 'donut', 'egg', 'fork', 'high-heels',
    'hot-drink', 'key', 'ladle', 'milk-bottle', 'muffin', 'orange', 'sneakers', 'umbrella'];

// audio files
const errorSound = new Audio('/assets/sounds/error-126627.mp3');
const clapSound = new Audio('/assets/sounds/more-claps-104533.mp3');

// number of image groups on each side
let imgCount, imgCountBefore;
imgCountBefore = window.prompt('Enter a number between 2 and 8. Default: 8');
imgCount = imgCountBefore === '' ? 8 : parseInt(imgCountBefore);
while (isNaN(imgCount) || imgCount > 8 || imgCount < 2) {
    imgCountBefore = window.prompt('You entered ' + imgCountBefore + '. Enter a number between 2 and 8. Default: 8');
    imgCount = imgCountBefore === '' ? 8 : parseInt(imgCountBefore);
}
// let imgCount = 6;

// calculating the size of each container
function sizeCalc() {
    let cod = 5 * mainContainer.clientHeight / (6 * imgCount + 1);
    let pad = mainContainer.clientHeight / (6 * imgCount + 1);
    return [cod, pad];
}


// a few useful randomizing tools
const random = {
    randomSample: function randomSample(arr, num) {
        let slice = [];
        let randomIndex;
        num = Math.min(num, arr.length);
        while (slice.length < num) {
            randomIndex = Math.floor(Math.random() * arr.length);
            slice.push(arr[randomIndex]);
            arr.splice(randomIndex, 1);
        }
        return slice;
    },

    shuffleArray: function (arr) {
        return arr.sort(function () {
            return 0.5 - Math.random();
        });
    },

    range: function (start, end) {
        let arr = [];
        for (let i = start; i <= end; i++) {
            arr.push(i);
        }
        arr = this.shuffleArray(arr);
        return arr;
    }
};

// each side container in an array
let sideDivs = [];
sideDivs[0] = document.querySelector('#left-list');
sideDivs[1] = document.querySelector('#right-list');

const mainContainer = document.getElementById('container');

sideDivs.forEach(function (sideDiv) {
    sideDiv.style.width = (mainContainer.clientWidth * 9 / 20).toString() + 'px';
});

function playGame() {
    function imgSize() {
        return Math.max(sideDivs[0].clientWidth * (1 - 7 * imgCount / 100) / imgCount,
            (sizes[0] - 16 * sideDivs[0].clientWidth / 100) / 2) * (Math.random() * 0.25 + 0.75);
    }

    // randomized image names for both sides
    let randomImages = random.shuffleArray(imgNames).slice(0, imgCount * 2);

// an array of random images for each side
    let randomImageSide = [randomImages.slice(0, imgCount), randomImages.slice(imgCount)];

// a random number for each image group
    let randomCount = [random.range(1, imgCount), random.range(1, imgCount)];

    let imageBoxes = [];

    let sizes = sizeCalc();

// populating each side
    sideDivs.forEach(function (sideDiv, sideIndex) {
        // filling each container of the side with images
        randomCount[sideIndex].forEach(function (imgGroup, imgIndex) {
            // outside container of each image group
            const outsideContainer = document.createElement('div');
            outsideContainer.setAttribute('class', 'outside-container');
            outsideContainer.style.transition = 'background-color 0.5s';
            outsideContainer.style.boxSizing = 'border-box';
            outsideContainer.style.overflow = 'hidden';
            outsideContainer.style.width = sideDivs[0].clientWidth + 'px';
            outsideContainer.style.height = sizes[0] + 'px';
            outsideContainer.style.top = imgIndex * (sizes[0] + sizes[1]) + sizes[1] + 'px';
            outsideContainer.style.textAlign = 'center';
            outsideContainer.style.position = 'absolute';
            outsideContainer.style.border = '1px solid';
            outsideContainer.style.margin = '0 auto';

            // tracking the containers
            imageBoxes.push({
                element: outsideContainer,
                side: sideIndex,
                pos: imgIndex,
                insideImages: randomCount[sideIndex][imgIndex],
                done: false,
            });

            // inside container of each image group
            const insideContainer = document.createElement('div');
            insideContainer.style.position = 'absolute';
            insideContainer.style.top = '50%';
            insideContainer.style.width = 'inherit';
            insideContainer.style.transform = 'translate(0, -50%)';
            insideContainer.style.userSelect = 'none';
            // adding images to each group
            for (let i = 0; i < randomCount[sideIndex][imgIndex]; i++) {
                addImages(randomImageSide[sideIndex][imgIndex], insideContainer);
            }
            // putting containers inside each other
            outsideContainer.appendChild(insideContainer);
            sideDiv.appendChild(outsideContainer);
        });
    });

// Finish message texts
    let congrats, scoreSpan, finishDiv;

// recalculating different sizes on a resize window
    window.addEventListener('resize', function () {

        sideDivs.forEach(function (sideDiv) {
            sideDiv.style.width = (mainContainer.clientWidth * 9 / 20).toString() + 'px';
        });

        sizes = sizeCalc();
        imageBoxes.forEach(function (element) {
            element.element.style.width = sideDivs[0].clientWidth + 'px';
            element.element.style.height = sizes[0] + 'px';
            element.element.style.top = element.pos * (sizes[0] + sizes[1]) + sizes[1] + 'px';
        });
        const imageElements = document.querySelectorAll('.images');
        imageElements.forEach(function (element) {
            element.style.width = imgSize() + 'px';
        });
        finishDiv.style.fontSize = (document.getElementById('container').clientWidth / 6) + 'px';
    });

    /**
     * adding an image to a parent container
     * @param image {string}            name of the image file, should have .webp format
     * @param parent {HTMLDivElement}   the parent container that image is added to
     */
    function addImages(image, parent) {
        let imageElement = document.createElement('img');
        imageElement.setAttribute('src', '/assets/random-images/' + image + '.webp');
        imageElement.setAttribute('class', 'images');
        imageElement.style.position = 'relative';
        imageElement.style.transition = '0.5s';
        imageElement.style.backgroundColor = '#fffa';
        imageElement.style.borderRadius = '10%';
        imageElement.style.padding = '2%';
        imageElement.style.margin = '1%';
        imageElement.style.boxShadow = '0 0 10px #0007 inset';
        imageElement.setAttribute('draggable', 'false');
        imageElement.style.width = imgSize() + 'px';
        parent.appendChild(imageElement);
    }

    let elementClicked, clickState = false, doneCount = 0, score, wait = Date.now(), replayButton;

// click events and progress track for every image container
    for (let elementIndex = 0; elementIndex < imageBoxes.length; elementIndex++) {
        imageBoxes[elementIndex].element.addEventListener('click', function () {
            // setting the first score value
            if (!score) {
                score = Date.now();
            }

            // click conditions
            // if the clicked element is completed, do nothing
            if (imageBoxes[elementIndex].done || Date.now() < wait) {
            } else if (!clickState) {  // when it is the first element to click
                imageBoxes[elementIndex].element.style.backgroundColor = '#ff88';
                clickState = true;
                elementClicked = imageBoxes[elementIndex];
            } else if (imageBoxes[elementIndex].side === elementClicked.side) {  // when clicked on another element on the same side
                if (imageBoxes[elementIndex].insideImages === elementClicked.insideImages) {
                    imageBoxes[elementIndex].element.style.backgroundColor = 'transparent';
                    clickState = false;
                } else {
                    elementClicked.element.style.backgroundColor = 'transparent';
                    imageBoxes[elementIndex].element.style.backgroundColor = '#ff88';
                    clickState = true;
                    elementClicked = imageBoxes[elementIndex];
                }
            } else {  // when clicked on an element on the other side
                if (imageBoxes[elementIndex].insideImages === elementClicked.insideImages) {
                    imageBoxes[elementIndex].done = true;
                    elementClicked.done = true;
                    clickState = false;
                    imageBoxes[elementIndex].element.style.backgroundColor = '#8f88';
                    elementClicked.element.style.backgroundColor = '#8f88';
                    doneCount += 1;
                    if (doneCount === imgCount) {  // when the game is finished
                        document.getElementById('container').style.transition = '2s';
                        document.getElementById('container').style.opacity = '0.5';
                        finishDiv = document.createElement('div');
                        finishDiv.style.position = 'fixed';
                        finishDiv.style.left = '50%';
                        finishDiv.style.top = '50%';
                        finishDiv.style.transform = 'translate(-50%, -50%)';
                        finishDiv.style.textAlign = 'center';
                        finishDiv.style.width = '80%';
                        finishDiv.style.fontSize = (document.getElementById('container').clientWidth / 6) + 'px';

                        congrats = document.createElement('div');
                        congrats.innerHTML = 'Congrats';
                        // congrats.style.fontSize = (document.getElementById('container').clientWidth / 6) + 'px';
                        congrats.style.color = '#000';
                        congrats.style.padding = '8% 8%';
                        congrats.innerHTML = 'Congrats';
                        congrats.style.opacity = '0';
                        congrats.style.transition = '2s';
                        congrats.style.borderRadius = '50%';
                        congrats.style.userSelect = 'none';

                        scoreSpan = document.createElement('span');
                        scoreSpan.innerHTML = 'Your time: ' + Math.round((Date.now() - score) / 100) / 10 + 's';
                        scoreSpan.style.fontSize = '50%';
                        congrats.appendChild(document.createElement('br'));
                        congrats.appendChild(scoreSpan);

                        replayButton = document.createElement('button');
                        replayButton.style.fontSize = '30%';
                        replayButton.innerHTML = 'Play Again';
                        replayButton.style.opacity = '0';
                        replayButton.style.border = 'none';
                        replayButton.style.borderRadius = '50%';
                        replayButton.style.padding = '2%';
                        replayButton.style.transition = 'opacity 1s, background-color 200ms';
                        replayButton.style.backgroundColor = '#73d2f8';
                        replayButton.style.boxShadow = '-1px -1px 2px #888, 2px 2px 4px #222';
                        finishDiv.appendChild(congrats);
                        finishDiv.appendChild(replayButton);

                        replayButton.addEventListener('mouseover', function () {
                            replayButton.style.backgroundColor = '#6ac6ea';
                        });
                        replayButton.addEventListener('mouseout', function () {
                            replayButton.style.backgroundColor = '#73d2f8';
                        });
                        replayButton.addEventListener('mousedown', function () {
                            replayButton.style.backgroundColor = '#81dcff';
                        });
                        replayButton.addEventListener('mouseup', function () {
                            replayButton.style.backgroundColor = '#73d2f8';
                        });
                        replayButton.addEventListener('click', function () {
                            // playGame();
                            document.getElementById('container').style.opacity = '1';
                            document.querySelectorAll('.outside-container').forEach(function (element) {
                                element.remove();
                            });
                            finishDiv.remove();
                            playGame();
                        });

                        // play clapping sound
                        clapSound.play().then(function () {
                        });

                        document.body.appendChild(finishDiv);
                        setTimeout(function () {
                            congrats.style.opacity = '1';
                            congrats.style.background = 'radial-gradient(ellipse, #f5ac 0%, #5f50 67%)';
                        }, 500);
                        setTimeout(function () {
                            congrats.style.transform = 'rotate(360deg)';
                        }, 2000);
                        setTimeout(function () {
                            replayButton.style.opacity = '1';
                        }, 4000);
                    }
                } else {  // when made a mistake
                    elementClicked.element.style.backgroundColor = '#f888';
                    imageBoxes[elementIndex].element.style.backgroundColor = '#f888';
                    clickState = false;
                    errorSound.play().then(function () {
                    });
                    navigator.vibrate(500);
                    wait = Date.now() + 505;
                    setTimeout(function () {
                        elementClicked.element.style.backgroundColor = 'transparent';
                        imageBoxes[elementIndex].element.style.backgroundColor = 'transparent';
                        elementClicked = imageBoxes[elementIndex];
                    }, 500);
                }
            }
        });
    }
}

playGame();