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

function addImages(image, parent) {
    let imageElement = document.createElement('img');
    imageElement.style.backgroundColor = '#fffa';
    imageElement.style.borderRadius = '10%';
    imageElement.style.padding = '2%';
    imageElement.style.boxShadow = '0 0 4px #000 inset';
    imageElement.style.width = '100px';
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