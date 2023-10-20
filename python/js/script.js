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

// scroll to the top of the page upon loading the page
window.addEventListener('load', () => {
    window.scrollTo(0, 0)
})