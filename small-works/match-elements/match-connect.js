let imgNames = ['apple', 'balloon', 'baseball-cap', 'coffee', 'donut', 'egg', 'fork', 'high-heels',
    'hot-drink', 'key', 'ladle', 'milk-bottle', 'muffin', 'orange', 'sneakers', 'umbrella'];

let imgCount = 6;

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
        arr = random.shuffleArray(arr);
        return arr;
    }
};

let randomImages = random.randomSample(imgNames, imgCount * 2);
let leftSide = document.querySelector('#left-list');
let rightSide = document.querySelector('#right-list');

let randomCount1 = random.range(1, imgCount);
let randomCount2 = random.range(1, imgCount);

let leftContainers = [];
for (let i = 0; i < imgCount; i++) {
    let div = document.createElement('div');
    let size = Math.floor(leftSide.clientWidth * 0.6);
    div.style.width = size + 'px';
    div.style.height = size + 'px';
    div.style.textAlign = 'center';
    div.style.position = 'relative';
    div.style.border = '1px solid';
    div.style.margin = '10px auto';
    leftContainers.push(div);
}

leftContainers.forEach(function (div, index) {
    let imgIndex = randomCount1[index];

    let insideContainer = document.createElement('div');
    insideContainer.style.position = 'absolute';
    insideContainer.style.top = '50%';
    insideContainer.style.width = 'inherit';
    insideContainer.style.transform = 'translate(0, -50%)';

    for (let i = 0; i < imgIndex; i++) {
        addImages(randomImages[index], insideContainer);
    }
    div.appendChild(insideContainer);
    leftSide.appendChild(div);
});

let rightContainer = [];
for (let i = 0; i < imgCount; i++) {
    let div = document.createElement('div');
    let size = Math.floor(rightSide.clientWidth * 0.6);
    div.style.width = size + 'px';
    div.style.height = size + 'px';
    div.style.textAlign = 'center';
    div.style.position = 'relative';
    div.style.border = '1px solid';
    div.style.margin = '10px auto';
    rightContainer.push(div);
}

rightContainer.forEach(function (div, index) {
    let imgIndex = randomCount2[index];

    let insideContainer = document.createElement('div');
    insideContainer.style.position = 'absolute';
    insideContainer.style.top = '50%';
    insideContainer.style.width = 'inherit';
    insideContainer.style.transform = 'translate(0, -50%)';

    for (let i = 0; i < imgIndex; i++) {
        addImages(randomImages[index + imgCount], insideContainer);
    }
    div.appendChild(insideContainer);
    rightSide.appendChild(div);
});

function addImages(image, parent) {
    let imageElement = document.createElement('img');
    imageElement.style.backgroundColor = '#fffa';
    imageElement.style.borderRadius = '10%';
    imageElement.style.padding = '2%';
    imageElement.style.margin = '1%';
    imageElement.style.boxShadow = '0 0 4px #000 inset';
    imageElement.setAttribute('draggable', 'false');
    imageElement.style.width = Math.floor((Math.random() / 2 + 0.5) * 64) + 'px';
    imageElement.setAttribute('src', '/assets/random-images/' + image + '.webp');
    parent.appendChild(imageElement);
}

// randomImages.slice(randomImages.length / 2).forEach(function (image) {
//     addImages(image, rightSide);
// });