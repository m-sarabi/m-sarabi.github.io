const addButton = document.getElementById("add-to-list")
const listValueSpan = document.getElementById("list-values")
const listInput = document.getElementById("list-input")
const forVariableInside = document.getElementById("for-variable-inside")
const forVariable = document.getElementById("for-variable")
const ourListSpan = document.getElementById("our-list")
const startButton = document.getElementById("start")
const resultInit = document.getElementById("result-init")
const resultInitValue = document.getElementById("result-init-value")
const resultBoardValue = document.getElementById("result-board-value")
const forVariableBoard = document.getElementById("for-variable-board")
const forVariableBoardValue = document.getElementById("for-variable-board-value")
forVariableBoard.innerHTML = forVariable.value

forVariableInside.style.display = "inline-block"
forVariableInside.style.textAlign = "center"
forVariableInside.style.width = "60px"

let listValues = []
let time = 0
let sum = 0

const validPython = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

//initialize some values
forVariableInside.innerHTML = forVariable.value
ourListSpan.innerHTML = "our_list"

listInput.addEventListener("input", function () {
    let inputValue = listInput.value
    if (inputValue !== "") {
        inputValue = Number(inputValue)
        if (inputValue <= -10000) {
            listInput.value = -9999
        } else if (inputValue >= 10000) {
            listInput.value = 9999
        }
    }
})
addButton.addEventListener("click", function () {
    let inputValue = listInput.value
    if (inputValue !== "" && listValues.length < 10) {
        startButton.disabled = false
        inputValue = Number(inputValue)
        listValues.push(inputValue)
        let listTextValue = listValueSpan.innerHTML
        if (listValueSpan.innerHTML === "[]") {
            listValueSpan.innerHTML = "[" + inputValue + "]"
        } else {
            listValueSpan.innerHTML = listTextValue.slice(0, -1) + ", " + inputValue + "]"
        }
    }
})
forVariable.addEventListener('input', function () {
    let inputValue = forVariable.value
    forVariableInside.innerHTML = inputValue
    forVariableBoard.innerHTML = inputValue
    if (!validPython.test(inputValue)) {
        forVariable.style.backgroundColor = 'pink';
        startButton.disabled = true
    } else {
        forVariable.style.backgroundColor = 'lightgreen'; // Reset the background color to its default
        startButton.disabled = false
    }
})

let animateList

function animateListMove() {
    ourListSpan.style.opacity = "0"
    ourListSpan.style.transition = "all 500ms"
    animateList = listValueSpan.cloneNode(true)
    animateList.style.position = "absolute"
    animateList.style.left = listValueSpan.getBoundingClientRect().left + "px"
    animateList.style.top = listValueSpan.getBoundingClientRect().top + "px"
    animateList.style.visibility = "hidden"
    animateList.style.transition = "all 1s ease-in-out"
    document.body.appendChild(animateList)

    setTimeout(function () {
        animateList.style.visibility = "visible"
        animateList.style.left = ourListSpan.getBoundingClientRect().left + "px"
        animateList.style.top = ourListSpan.getBoundingClientRect().top + "px"
    }, 1000)
}

function animateFunction(child) {
    setTimeout(function () {
        let tmpNode = ourListSpan.children[child].cloneNode(true)
        tmpNode.style.position = "absolute"
        tmpNode.style.left = ourListSpan.children[child].getBoundingClientRect().left + "px"
        tmpNode.style.top = ourListSpan.children[child].getBoundingClientRect().top + "px"
        ourListSpan.children[child].style.backgroundColor = "lightgreen"
        ourListSpan.children[child].style.boxShadow = "0 0 5px 2px lightgreen"
        document.body.appendChild(tmpNode)
        tmpNode.style.transition = "all 1s ease-in-out"
        setTimeout(function () {
            forVariableBoardValue.innerHTML = listValues[child]
            ourListSpan.children[child].style.backgroundColor = ""
            ourListSpan.children[child].style.boxShadow = ""
            forVariableInside.style.opacity = "0"
            forVariableInside.style.transition = "opacity 500ms"
            tmpNode.style.left = forVariableInside.getBoundingClientRect().left + 30 - tmpNode.clientWidth / 2 + "px"
            tmpNode.style.top = forVariableInside.getBoundingClientRect().top + "px"
            setTimeout(function () {
                forVariableInside.style.transition = ""
                forVariableInside.style.opacity = "1"
                forVariableInside.innerHTML = tmpNode.innerHTML
                tmpNode.remove()
                let ghostValue = document.createElement("span")
                ghostValue.innerHTML = listValues[child]
                ghostValue.style.left = forVariableInside.getBoundingClientRect().left + "px"
                ghostValue.style.top = forVariableInside.getBoundingClientRect().top - 5 + "px"
                ghostValue.style.padding = "10px"
                ghostValue.style.backgroundColor = "lightgreen"
                ghostValue.style.position = "absolute"
                ghostValue.style.borderRadius = "10px"
                ghostValue.style.opacity = "0"
                document.body.appendChild(ghostValue)
                ghostValue.style.transition = "all 1.5s"
                setTimeout(function () {
                    ghostValue.style.opacity = "0.5"
                    ghostValue.style.left = resultBoardValue.getBoundingClientRect().left - 10 + "px"
                    ghostValue.style.top = resultBoardValue.getBoundingClientRect().top - 10 + "px"
                    setTimeout(function () {
                        sum += listValues[child]
                        resultBoardValue.innerHTML = sum
                        ghostValue.remove()
                    }, 1550)
                }, 200)
            }, 1500)
        }, 1000)
    }, time)
}

let listValueSpanEach = []
startButton.addEventListener("click", function () {
    const forVariableSpan = document.createElement("span")
    forVariableSpan.innerHTML = forVariable.value
    forVariable.replaceWith(forVariableSpan)
    startButton.disabled = true
    addButton.disabled = true

    listValues.forEach(function (value) {
        let tmpSpan = document.createElement("span")
        tmpSpan.innerHTML = value
        listValueSpanEach.push(tmpSpan)
    })

    time += 1000
    setTimeout(function () {
        resultInit.style.transition = "background-color 500ms"
        resultInit.style.backgroundColor = "lightgreen"
        setTimeout(function () {
            resultInit.style.backgroundColor = ""
        }, 500)
        let tmpN = resultInitValue.cloneNode(true)
        tmpN.style.transition = "all 1.5s"
        tmpN.style.position = "absolute"
        tmpN.style.visibility = "hidden"
        tmpN.style.left = resultInitValue.getBoundingClientRect().left + "px"
        tmpN.style.top = resultInitValue.getBoundingClientRect().top + "px"
        document.body.appendChild(tmpN)
        setTimeout(function () {
            tmpN.style.visibility = "visible"
            tmpN.style.left = resultBoardValue.getBoundingClientRect().left + "px"
            tmpN.style.top = resultBoardValue.getBoundingClientRect().top + "px"
            setTimeout(function () {
                tmpN.remove()
                resultBoardValue.innerHTML = "0"
            }, 1500)
        }, 1000)
    }, time)

    time += 3500
    setTimeout(function () {
        animateListMove()
    }, time)

    time += 2200
    setTimeout(function () {
        ourListSpan.style.opacity = "1"
        ourListSpan.style.transition = ""
        ourListSpan.innerHTML = "["
        listValueSpanEach.forEach(function (value, index) {
            value.style.transition = "background-color 300ms"
            if (index < listValueSpanEach.length - 1) {
                ourListSpan.appendChild(value)
                ourListSpan.innerHTML += ", "
            } else {
                ourListSpan.appendChild(value)
            }
        })
        ourListSpan.innerHTML += "]"
        setTimeout(function () {
            animateList.remove()
        }, 10)
    }, time)
    time += 1000
    for (let i = 0; i < listValues.length; i++) {
        animateFunction(i)
        time += 6000
    }
})