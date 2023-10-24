const startBtn = document.getElementById('startBtn');
const article = document.querySelector("article");

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

class Quest {
    constructor(answerID, options, code) {
        this.answerID = answerID;
        this.options = options;
        this.code = code;
    }
}

let questions = [];

// print numbers result quiz:
function simpleNumbersPrint() {
    let nums, operator, expression, result;
    while (true) {
        nums = [random.randInt(1, 50), random.randInt(1, 50)];
        operator = Array(5).fill("+").concat(["-"],
            Array(25).fill("*"),
            Array(50).fill("/")
        );
        expression = nums.join(` ${random.choice(operator)} `);
        result = eval(expression);
        console.log(result);
        if (result % 1 === 0 && result <= 80 && result >= -40) {
            break;
        }
    }
    const holderMain = document.createElement("div");
    holderMain.classList.add("code-container");
    const holder = document.createElement("pre");
    const codeBlock = document.createElement("code");
    codeBlock.innerHTML = `print(${expression})`;
    holderMain.appendChild(holder);
    holder.appendChild(codeBlock);
    article.appendChild(holderMain);
    console.log(expression);
    Prism.highlightElement(codeBlock);
}


startBtn.addEventListener("click", () => {
    // console.log("quiz started");
    simpleNumbersPrint();
});