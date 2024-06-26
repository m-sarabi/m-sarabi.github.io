$(document).ready(function () {
    // const CATEGORIES = [
    //     "Name",
    //     "Family",
    //     "Fruit",
    //     "Color",
    //     "City",
    //     "Country",
    //     "Car",
    //     "Animal",
    //     "Object",
    //     "Food",
    //     "Job",
    // ];
    const CATEGORIES = ["Name", "Fruit", "Country"];
    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let letter, counter, timer;
    let running = true;

    // read each category data from info.json and store them in an array
    let categoryData = {};
    fetch("info.json")
        .then(response => response.json())
        .then(json => {
            CATEGORIES.forEach(function (category) {
                categoryData[category] = json[category];
            });
        });

    function randomLetter() {
        return LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    function renderRandomLetter() {
        letter = randomLetter();
        $("#letter").text(`Letter: ${letter}`);
    }

    function renderCategories() {
        CATEGORIES.forEach(function (category) {
            const row = $("<div class='row'></div>");
            row.append(`<label for="${category}">${category}</label>`);
            row.append(`<input type="text" id="${category}" name="${category}">`);
            $("#categories").append(row);
        });
    }

    function startGame() {
        renderCategories();
        startRound();
    }

    function startRound() {
        renderRandomLetter();
        startTimer();
    }

    function stopTimer() {
        clearInterval(timer);
        hideTimer();
    }

    function updateTimer() {
        $("#timer span").text(counter);
    }

    function startTimer() {
        counter = 30;
        updateTimer();
        timer = setInterval(function () {
            counter--;
            updateTimer();
            if (counter <= 0) {
                stopTimer();
                checkAnswers();
            }
        }, 1000);
        showTimer();
    }

    function showTimer() {
        $("#timer").css("visibility", "visible");
    }

    function hideTimer() {
        $("#timer").css("visibility", "hidden");
    }

    function disableInputs() {
        $("input").prop("disabled", true);
    }

    function enableInputs() {
        $("input").prop("disabled", false);
    }

    function checkAnswers() {
        disableInputs();
        running = false;
        stopTimer();
        let answers = {};
        let result = {};
        CATEGORIES.forEach(function (category) {
            answers[category] = $(`#${category}`).val();
        });
        // for each one, see if answer is in the data
        CATEGORIES.forEach(function (category) {
            result[category] = answers[category] &&
                categoryData[category].includes(answers[category].toLowerCase()) &&
                answers[category].toLowerCase().startsWith(letter.toLowerCase());
        });

        // show results
        Object.keys(result).forEach(function (category) {
            $(`#${category}`).css("background", result[category] ? "#2efc2e88" : "#fc2e2e88");
        });
    }

    $("#check-answer").click(checkAnswers);
    $("#reset").click(function () {
        enableInputs();
        if (running) {
            stopTimer();
        }
        running = true;
        startRound();
        $("input").val("").css("background", "#25313c");
    });

    startGame();
});
