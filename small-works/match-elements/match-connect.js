let imgNames = ['apple', 'balloon', 'baseball-cap', 'coffee', 'donut', 'egg', 'fork', 'high-heels',
    'hot-drink', 'key', 'ladle', 'milk-bottle', 'muffin', 'orange', 'sneakers', 'umbrella'];

function randomSample(arr, num) {
    let slice = [];
    let randomIndex;
    num = Math.min(num, arr.length);
    while (slice.length < num) {
        randomIndex = Math.floor(Math.random() * arr.length);
        slice.push(arr[randomIndex]);
        arr.splice(randomIndex, 1);
    }
    return slice;
}

let randomImages = randomSample(imgNames, 16);
let leftSide = document.querySelector('#left-list');
let rightSide = document.querySelector('#right-list');

function addImages(image, parent) {
    let imageElement = document.createElement('img');
    imageElement.style.backgroundColor = '#fffa';
    imageElement.style.borderRadius = '10%';
    imageElement.style.padding = '2%';
    imageElement.style.boxShadow = '0 0 4px #000 inset';
    imageElement.setAttribute('src', '/assets/random-images/' + image + '.webp');
    parent.appendChild(imageElement);
    parent.appendChild(document.createElement('br'));
}

randomImages.slice(0, randomImages.length / 2).forEach(function (image) {
    addImages(image, leftSide);
});
randomImages.slice(randomImages.length / 2).forEach(function (image) {
    addImages(image, rightSide);
});