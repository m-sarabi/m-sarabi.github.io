// a list of the small image file names
let imgNames = ['apple', 'balloon', 'baseball-cap', 'coffee', 'donut', 'egg', 'fork', 'high-heels',
    'hot-drink', 'key', 'ladle', 'milk-bottle', 'muffin', 'orange', 'sneakers', 'umbrella'];

// number of image groups on each side
let imgCount = 8;

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

// randomized image names for both sides
let randomImages = random.randomSample(imgNames, imgCount * 2);

// an array of random images for each side
let randomImageSide = [randomImages.slice(0, imgCount), randomImages.slice(imgCount)];

// each side container in an array
let sideDivs = [];
sideDivs[0] = document.querySelector('#left-list');
sideDivs[1] = document.querySelector('#right-list');

// a random number for each image group
let randomCount = [random.range(1, imgCount), random.range(1, imgCount)];
let sizeW = Math.floor(sideDivs[0].clientWidth * 0.75), sizeH;
if (window.innerWidth > window.innerHeight) {
    sizeH = sizeW / 2;
} else {
    sizeH = sizeW * 2 / 3;
}
let imgSize = sizeH / 4;

// populating each side
sideDivs.forEach(function (sideDiv, sideIndex) {
    // filling each container of the side with images
    randomCount[sideIndex].forEach(function (imgGroup, imgIndex) {
        // outside container of each image group
        const outsideContainer = document.createElement('div');
        outsideContainer.setAttribute('class', 'outside-container');
        outsideContainer.style.transition = '0.5s';
        outsideContainer.style.width = sizeW + 'px';
        outsideContainer.style.height = sizeH + 'px';
        outsideContainer.style.textAlign = 'center';
        outsideContainer.style.position = 'relative';
        outsideContainer.style.border = '1px solid';
        outsideContainer.style.margin = '10px auto';

        // inside container of each image group
        const insideContainer = document.createElement('div');
        insideContainer.style.position = 'absolute';
        insideContainer.style.top = '50%';
        insideContainer.style.width = 'inherit';
        insideContainer.style.transform = 'translate(0, -50%)';
        // adding images to each group
        for (let i = 0; i < randomCount[sideIndex][imgIndex]; i++) {
            addImages(randomImageSide[sideIndex][imgIndex], insideContainer);
        }
        // putting containers inside each other
        outsideContainer.appendChild(insideContainer);
        sideDiv.appendChild(outsideContainer);
    });
});

let windowWidth = window.innerWidth;
window.addEventListener('resize', function () {
    if (windowWidth !== window.innerWidth) {
        windowWidth = window.innerWidth;
        sizeW = Math.floor(sideDivs[0].clientWidth * 0.75);
        if (window.innerWidth > window.innerHeight) {
            sizeH = sizeW / 2;
        } else {
            sizeH = sizeW * 2 / 3;
        }
        imgSize = sizeW / 6;
        const outsideElements = document.querySelectorAll('.outside-container');
        outsideElements.forEach(function (element) {
            element.style.width = sizeW + 'px';
            element.style.height = sizeH + 'px';
        });
        const imageElements = document.querySelectorAll('.images');
        imageElements.forEach(function (element) {
            element.style.width = Math.floor((Math.random() / 4 + 0.75) * imgSize) + 'px';
        });
    }
});

/**
 * adding an image to a parent container
 * @param image {string}     name of the image file, should have .webp format
 * @param parent {HTMLDivElement}    the parent container that image is added to
 */
function addImages(image, parent) {
    let imageElement = document.createElement('img');
    imageElement.setAttribute('class', 'images');
    imageElement.style.transition = '0.5s';
    imageElement.style.backgroundColor = '#fffa';
    imageElement.style.borderRadius = '10%';
    imageElement.style.padding = '2%';
    imageElement.style.margin = '1%';
    imageElement.style.boxShadow = '0 0 10px #0007 inset';
    imageElement.setAttribute('draggable', 'false');
    imageElement.style.width = Math.floor((Math.random() / 4 + 0.75) * imgSize) + 'px';
    imageElement.setAttribute('src', '/assets/random-images/' + image + '.webp');
    parent.appendChild(imageElement);
}
