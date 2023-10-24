const startBtn = document.getElementById('startBtn');
const article = document.querySelector("article");

class Quest {
    constructor(answerID) {
        this.answerID = answerID;
    }

    // simple two numbers and an operator:
    simple_operator(num1, num2, operator) {
        let expression = `${num1} ${operator} ${num2}`;
        let answer = eval(expression);
        return [`${expression}`, answer];
    }
}


const random = {
    randInt: function (start, end) {
        return Math.floor(Math.random() * (end - start) + start);
    },
    choice: function (arr) {
        return arr.sort(function () {
            return 0.5 - Math.random();
        })[0];
    }
};

let quest = new Quest(1);

const holderMain = document.createElement("div");
holderMain.classList.add("code-container");
const holder = document.createElement("pre");
const codeBlock = document.createElement("code");
holderMain.appendChild(holder);
holder.appendChild(codeBlock);
article.appendChild(holderMain);
holderMain.style.visibility = "hidden";

// print numbers result quiz:
function codeBlockUpdate() {
    let [code, answer] = quest.simple_operator(random.randInt(1, 40), random.randInt(1, 40), "+");
    holderMain.style.visibility = "visible";
    codeBlock.innerHTML = `print(${code})`;
    console.log(answer);
    Prism.highlightElement(codeBlock);
}


startBtn.addEventListener("click", () => {
    // console.log("quiz started");
    codeBlockUpdate();
    console.log();
});