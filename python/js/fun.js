funElem = document.getElementById("fun")
let fullText = "Happy coding, and good luck!       "
let text = fullText
funElem.innerHTML = " "
let counter = 0
let funInterval = setInterval(function () {
    funElem.innerHTML += text.charAt(0)
    text = text.substring(1)
    counter += 1
    if (text === "") {
        funElem.innerHTML = " "
        text = fullText
        // clearInterval(funInterval)
    }
}, 600)
