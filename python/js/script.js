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

// placing the navbar from the nav.html
fetch("./nav.html").then(result => result.text()).then(text => {
    let old_elem = document.querySelector("div#nav-bar-script");
    let new_elem = document.createElement("div");
    new_elem.innerHTML = text;
    old_elem.parentNode.replaceChild(new_elem, old_elem);
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


// trinket button to show and hide it
let trinketShow = false
let trinketContainer = document.getElementsByClassName("trinket")[0]
let trinketBtn = document.getElementById("trinketBtn")
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