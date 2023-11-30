// animated text at the bottom of the page
const funElem = document.getElementById("fun");
let fullText = "Happy coding, and good luck!       ";
let text = fullText;
if (funElem !== null) {
    funElem.innerHTML = " ";
    let counter = 0;
    setInterval(function () {
        funElem.innerHTML += text.charAt(0);
        text = text.substring(1);
        counter += 1;
        if (text === "") {
            funElem.innerHTML = " ";
            text = fullText;
        }
    }, 600);
}

// placing the navbar from the nav.html
fetch("./nav.html").then(result => result.text()).then(text => {
    let new_elem = document.querySelector("nav.top-bar");
    new_elem.innerHTML = new_elem.innerHTML.replace('{{ navbar }}', text);
})

// toc generator
const headElements = document.querySelectorAll("h2");
if (document.getElementsByClassName("toc")[0] !== undefined) {
    const tocElem = document.getElementsByClassName("toc")[0].children[0].children[1];
    headElements.forEach(function (item) {
        let tocItem = `<li><a href="#${item.id}">${item.innerHTML}</a></li>`;
        tocElem.innerHTML += tocItem;
    });
}

// add scroll progressbar to the top of the page
let scrollElemContainer = document.createElement("div")
scrollElemContainer.classList.add("top-bar")
scrollElemContainer.style.position = "fixed"
scrollElemContainer.style.top = "0"
scrollElemContainer.style.left = "0"
scrollElemContainer.style.width = "100%"
scrollElemContainer.style.height = "8px"
scrollElemContainer.style.zIndex = "100"
scrollElemContainer.style.backgroundColor = '#282828'

let scrollColorValue = 0
let scrollElem = document.createElement("div")
scrollElem.style.position = "relative"
scrollElem.style.width = "0%"
scrollElem.style.height = "100%"
scrollElem.style.backgroundColor = `rgb(${255 - scrollColorValue}, 0, 0, 0.5)`
scrollElemContainer.appendChild(scrollElem)
document.body.appendChild(scrollElemContainer)

window.addEventListener("scroll", () => {
    let scrollPercentage = (document.documentElement.scrollTop) /
        ((document.documentElement.scrollHeight) -
            document.documentElement.clientHeight) * 100;

    scrollElem.style.width = `${scrollPercentage}%`
    scrollColorValue = Math.floor(scrollPercentage * 255 / 100)
    scrollElem.style.backgroundColor = `rgb(${255 - scrollColorValue}, ${Math.floor(scrollColorValue * 0.8)}, 0, 0.5)`
})


// trinket button to show and hide it
let trinketShow = false
let trinketContainer = document.getElementsByClassName("trinket")[0]
let trinketBtn = document.getElementById("trinketBtn")
if (trinketBtn !== null) {
    trinketBtn.addEventListener("click", () => {
        if (trinketShow) {
            console.log("hiding the code editor")
            trinketContainer.innerHTML = ""
            trinketShow = false
            trinketBtn.innerHTML = "Show"
        } else {
            fetch("./trinket.html").then(result => result.text()).then(text => {
                trinketContainer.innerHTML = text
            })
            console.log("showing the code editor")
            trinketShow = true
            trinketBtn.innerHTML = "Hide"
        }
    })
}

// rotate laptop on scroll
window.addEventListener('scroll', () => {
    scrollRotate()
})

function scrollRotate() {
    let laptopContainer = document.querySelector(".laptop-container");
    let value = Math.max((1 - (window.scrollY / Math.min(window.innerHeight, window.innerWidth)) * 2), 0.1)
    laptopContainer.style.transform = "rotate(" + (15 - window.scrollY / 10) + "deg) scale(" +
        value + ")";
    laptopContainer.style.opacity = value.toString();
    laptopContainer.style.top = (3 + (window.scrollY / Math.min(window.innerHeight, window.innerWidth)) * 20) + "vw";
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// matrix rain
const canvas = document.getElementById('Matrix')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const context = canvas.getContext('2d')

const chars = '01'
const rainCount = 80;
// const fontSize = 16
// const font = fontSize + 'px Consolas'

function initRain() {
    rainArr = []
    for (let i = 0; i < rainCount; i++) {
        rainArr[i] = [
            1 - Math.floor(Math.random() * canvas.height / 2),
            Math.random() * canvas.width,
            Math.random() * 1.5 + 0.5
        ];
    }
}

let rainArr = []
initRain()

function draw() {
    context.globalAlpha = 0.25;
    context.fillStyle = '#d5d5d5'
    // let oldArr = context.getImageData(0, 0, canvas.width, canvas.height)
    // for (let d = 3; d < oldArr.data.length; d += 4) {
    //     oldArr.data[d] = Math.floor(oldArr.data[d] * 0.95)
    // }
    // context.putImageData(oldArr, 0, 0)
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.globalAlpha = 1;

    for (let i = 0; i < rainArr.length; i++) {
        context.font = rainArr[i][2] + 'vw Consolas'
        context.fillStyle = 'rgba(0, 0, 0, ' + (1 - (rainArr[i][0] * rainArr[i][2] * canvas.width / 100) / canvas.height * 0.9) + ')';
        context.fillText(randomChoice(chars), rainArr[i][1], rainArr[i][0] * rainArr[i][2] * canvas.width / 100)

        // if (rainArr[i][0] * rainArr[i][2] > canvas.height && Math.random() > 0.9) {
        if (rainArr[i][0] * rainArr[i][2] * canvas.width / 100 > canvas.height) {
            rainArr[i] = [0, Math.random() * canvas.width, Math.random() * 1.5 + 0.5];
        }
        rainArr[i][0]++
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initRain()
})

// rain toggle button
window.addEventListener('load', () => {
    setTimeout(() => {
        let rainInterval = setInterval(draw, 30)
        let rainButton = document.getElementById('rain-btn')
        let navBar = document.querySelector('.top-bar')
        navBar.appendChild(rainButton)
        let raining = true
        rainButton.addEventListener('click', () => {
            if (raining) {
                rainButton.classList.replace('enabled', 'disabled')
                raining = false
                clearInterval(rainInterval)
            } else {
                rainButton.classList.replace('disabled', 'enabled')
                raining = true
                rainInterval = setInterval(draw, 30)
            }
        })
    }, 100)

})