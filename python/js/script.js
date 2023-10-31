// animated text at the bottom of the page
funElem = document.getElementById("fun");
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
scrollElemContainer.style.backgroundColor = 'rgb(255, 255, 255, 0.5)'

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

// Rest in peace Armita
// let armita = document.createElement("div")
// armita.style.position = "absolute"
// armita.style.width = "400px"
// armita.style.backgroundColor = "#111"
// armita.style.left = "0"
// armita.style.top = "50px"
// armita.style.transformOrigin = "bottom left"
// armita.style.transform = "rotate(-19deg)"
// armita.style.color = "#fff"
// armita.style.padding = "20px"
// armita.style.textAlign = "center"
// armita.style.fontSize = "130%"
// armita.style.boxShadow = "0 0 20px 5px black"
// armita.innerHTML = "برای آرمیتا&emsp;زنده باد آزادی&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"
// document.body.appendChild(armita)


// trinket button to show and hide it
let trinketShow = false
let trinketContainer = document.getElementsByClassName("trinket")[0]
let trinketBtn = document.getElementById("trinketBtn")
trinketBtn.addEventListener("click", () => {
    if (trinketShow) {
        trinketContainer.innerHTML = ""
        trinketShow = false
        trinketBtn.innerHTML = "Show"
    } else {
        fetch("./trinket.html").then(result => result.text()).then(text => {
            trinketContainer.innerHTML = text
        })
        trinketShow = true
        trinketBtn.innerHTML = "Hide"
    }
})