$(document).ready(function () {
    const tap = $('#tap');
    const upgrade = $('#upgrade');
    const league = $('#league');
    const math = $('#math');
    const tapScreen = $('#tap-screen');
    const upgradeScreen = $('#upgrade-screen');
    const leagueScreen = $('#league-screen');
    const mathScreen = $('#math-screen');
    const failureScreen = $('#failure-screen');
    const coinButton = $('.coin.tap');
    const coinsText = $('#coins-value');
    const touchUpgradeBtn = $('#touch-upgrade-btn');
    const limitUpgradeBtn = $('#limit-upgrade-btn');
    const rechargeUpgradeBtn = $('#recharge-upgrade-btn');
    const energyValue = $('.energy-value');
    const maxEnergyValue = $('#max-energy-value');
    const energyBar = $('.energy-progress');
    const optionButtons = $("#options button");
    const questionElement = $("#question");
    const nextQuestionButton = $("#next-question");
    const timerElem = $(".timer");
    const startMathButton = $("#start-math");
    const mathOverlay = $("#math-overlay");
    const dingSound = document.getElementById("ding-sound");
    const errorSound = document.getElementById("error-sound");

    const audioContext = new AudioContext();
    const dingTrack = audioContext.createMediaElementSource(dingSound);
    dingTrack.connect(audioContext.destination);
    const errorTrack = audioContext.createMediaElementSource(errorSound);
    errorTrack.connect(audioContext.destination);

    let keys, coins = 0, tapUpgrade = 1, limitUpgrade = 1, rechargeUpgrade = 1, energy = 1000, maxEnergy = 1000;
    let tapPrice, limitPrice, rechargePrice;
    let mathAnswer = 0, mathTimer = 0, mathEnergy = 1000;
    let mathTimeInterval;
    // let resetCounter = 0;

    const WebApp = window.Telegram.WebApp;
    const CloudStorage = window.Telegram.WebApp.CloudStorage;

    function isNumeric(str) {
        if (typeof str != "string") return false;
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    function shuffle(array) {
        let currentIndex = array.length;

        while (currentIndex !== 0) {

            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    }

    function getKeys() {
        return new Promise((resolve, reject) => {
            CloudStorage.getKeys(function (err, res) {
                if (err !== null) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    function getItem(key) {
        return new Promise((resolve, reject) => {
            CloudStorage.getItem(key, function (err, res) {
                if (err !== null) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    function randomMathGenerator(operator) {
        let num1, num2, answer, options;

        function generateOptions(answer) {
            let options = [answer];
            if (Math.random() > 0.7) options.push(answer + 10);
            if (answer >= 10 && Math.random() > 0.7) options.push(answer - 10);
            while (options.length < 6) {
                if (Math.random() > 0.5) {
                    let tmp = answer + Math.floor(Math.random() * 8);
                    if (options.includes(tmp)) continue;
                    options.push(tmp);
                } else {
                    let tmp = answer - Math.floor(Math.random() * 8);
                    if (tmp < 0 || options.includes(tmp)) continue;
                    options.push(tmp);
                }
            }
            return options;
        }

        if (operator === "+") {
            num1 = Math.floor(Math.random() * 50);
            num2 = Math.floor(Math.random() * 50);
            answer = num1 + num2;
            options = generateOptions(answer);
        } else if (operator === "-") {
            do {
                num1 = Math.floor(Math.random() * 75);
                num2 = Math.floor(Math.random() * 50);
            } while (num1 < num2);
            answer = num1 - num2;
            options = generateOptions(answer);
        } else if (operator === "*") {
            num1 = Math.floor(Math.random() * 30);
            num2 = Math.floor(Math.random() * 20);
            answer = num1 * num2;
            options = generateOptions(answer);
        } else if (operator === "/") {
            do {
                num1 = Math.floor(Math.random() * 500);
                num2 = Math.floor(Math.random() * 50);
            } while (num1 < num2 || num1 % num2 !== 0);
            answer = num1 / num2;
            options = generateOptions(answer);
        }
        shuffle(options);
        return [num1, num2, operator, answer, options];
    }

    function startQuestion() {
        energy -= mathEnergy;
        updateEnergy();
        let operators = ["+", "-", "*", "/"];
        let operator = operators[Math.floor(Math.random() * operators.length)];
        let question = randomMathGenerator(operator);
        mathAnswer = question[3];
        addQuestion(question);
        addOptions(question[4]);
        nextQuestionButton.prop("disabled", true);
        optionButtons.prop("disabled", false);
        startTimer();
    }

    function addQuestion(question) {
        questionElement.text(question[0] + " " + question[2] + " " + question[1] + " = ?");
    }

    function addOptions(options) {
        optionButtons[0].innerHTML = options[0];
        optionButtons[1].innerHTML = options[1];
        optionButtons[2].innerHTML = options[2];
        optionButtons[3].innerHTML = options[3];
        optionButtons[4].innerHTML = options[4];
        optionButtons[5].innerHTML = options[5];
    }

    function startTimer() {
        mathTimer = 8;
        timerElem.text(8);
        mathTimeInterval = setInterval(function () {
            mathTimer--;
            timerElem.text(mathTimer);
            if (mathTimer <= 0) {
                stopTimer();
                errorSound.play();
                optionButtons.each(function () {
                    if ($(this).text() === mathAnswer.toString()) {
                        $(this).addClass('wrong');
                    }
                });
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(mathTimeInterval);
        nextQuestionButton.prop("disabled", false);
        timerElem.text(8);
        optionButtons.prop("disabled", true);
    }

    function addPrizeCoins() {
        // between 0.01 and 0.05
        const prizeShare = Math.random() * 0.04 + 0.01;
        const prizeCoins = Math.floor(prizeShare * coins);
        coins += prizeCoins;
        coinsText.text(coins);
    }

    function calculatePrices() {
        console.log(tapPrice, limitPrice, rechargePrice);
        tapPrice = Math.floor(200 * Math.pow(1.1, tapUpgrade - 1));
        limitPrice = Math.floor(200 * Math.pow(1.1, limitUpgrade - 1));
        rechargePrice = Math.floor(200 * Math.pow(1.1, rechargeUpgrade - 1));
        console.log(tapPrice, limitPrice, rechargePrice);
        updatePrices();
    }

    function updatePrices() {
        $('#tap-price').text(tapPrice);
        $('#energy-price').text(limitPrice);
        $('#recharge-price').text(rechargePrice);
    }

    function updateLevels() {
        $('#tap-upgrade').text(tapUpgrade);
        $('#energy-upgrade').text(limitUpgrade);
        $('#recharge-upgrade').text(rechargeUpgrade);
    }

    function updateEnergy() {
        energyValue.text(energy);
        energyBar.width((energy / maxEnergy) * 100 + '%');
    }

    function updateMaxEnergy() {
        maxEnergy = limitUpgrade * 1000;
        maxEnergyValue.text(maxEnergy);
    }

    function saveInfo() {
        CloudStorage.setItem("coins", coins.toString());
        CloudStorage.setItem("tapUpgrade", tapUpgrade.toString());
        CloudStorage.setItem("limitUpgrade", limitUpgrade.toString());
        CloudStorage.setItem("rechargeUpgrade", rechargeUpgrade.toString());
        CloudStorage.setItem("energy", energy.toString());
    }

    function setNewUser() {
        return new Promise((resolve) => {
            CloudStorage.setItem("newUser", "true");
            CloudStorage.setItem("coins", "0");
            CloudStorage.setItem("tapUpgrade", "1");
            CloudStorage.setItem("limitUpgrade", "1");
            CloudStorage.setItem("rechargeUpgrade", "1");
            CloudStorage.setItem("energy", "1000");

            coins = 0;
            tapUpgrade = 1;
            limitUpgrade = 1;
            rechargeUpgrade = 1;
            energy = 1000;
            maxEnergy = 1000;

            coinsText.text(coins);
            buyUpgradeAfter(0);
            console.log("new user created");
            resolve();
        });
    }

    async function getInfo() {
        coins = await getItem("coins");
        if (!isNumeric(coins)) await setNewUser();
        coins = parseInt(coins);
        console.log("coins: " + coins);

        tapUpgrade = await getItem("tapUpgrade");
        if (!isNumeric(tapUpgrade)) await setNewUser();
        tapUpgrade = parseInt(tapUpgrade);
        console.log("tapUpgrade: " + tapUpgrade);

        limitUpgrade = await getItem("limitUpgrade");
        if (!isNumeric(limitUpgrade)) await setNewUser();
        limitUpgrade = parseInt(limitUpgrade);
        console.log("limitUpgrade: " + limitUpgrade);

        rechargeUpgrade = await getItem("rechargeUpgrade");
        if (!isNumeric(rechargeUpgrade)) await setNewUser();
        rechargeUpgrade = parseInt(rechargeUpgrade);
        console.log(rechargeUpgrade);

        energy = await getItem("energy");
        if (!isNumeric(energy)) await setNewUser();
        energy = parseInt(energy);
        console.log("energy: " + energy);
    }

    // periodically set the current time
    function saveTime() {
        setInterval(function () {
            CloudStorage.setItem("energy", energy);
            CloudStorage.setItem("coins", coins);
            CloudStorage.setItem("time", Date.now().toString());
        }, 8000);
    }

    // increase energy periodically every second by recharge speed amount
    function saveEnergy() {
        setInterval(function () {
            energy = Math.min(energy + rechargeUpgrade, maxEnergy);
            updateEnergy();
        }, 1000);
    }

    function init() {
        buyUpgradeAfter(0);
        saveTime();
        saveEnergy();
        updateEnergy();
        updateMaxEnergy();
    }

    async function startGame() {
        // saveEnergy();
        try {
            keys = await getKeys();
            console.log(keys);

            WebApp.expand();
            WebApp.enableClosingConfirmation();
            WebApp.BackButton.hide();
            WebApp.MainButton.hide();
            WebApp.SettingsButton.hide();
            if (!keys.includes("newUser")) {
                await setNewUser();
            }

            await getInfo();

            tapScreen.toggleClass('hidden', false);

            init();
            WebApp.ready();
            energy = Math.min(energy + await calculateOfflineEnergy(), maxEnergy);

        } catch (err) {
            console.error(err);
            showFailScreen();
            WebApp.ready();
        }
    }

    // calculate seconds since last online time
    function calculateOfflineTime() {
        return new Promise((resolve, reject) => {
            CloudStorage.getItem("time", function (err, res) {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(Math.floor((Date.now() - res) / 1000));
                }
            });
        });
    }

    async function calculateOfflineEnergy() {
        try {
            return rechargeUpgrade * await calculateOfflineTime();
        } catch (err) {
            console.error(err);
            return 0;
        }
    }

    function showFailScreen() {
        failureScreen.toggleClass("hidden", false);
    }

    function buyUpgradeAfter(price) {
        coins -= price;
        CloudStorage.setItem("coins", coins.toString());
        coinsText.text(coins);
        calculatePrices();
        updateLevels();
        saveInfo();
    }

    tap.on('click', function () {
        tapScreen.toggleClass("hidden", false);
        upgradeScreen.toggleClass("hidden", true);
        leagueScreen.toggleClass("hidden", true);
        mathScreen.toggleClass("hidden", true);
        // resetCounter = 0;
    });
    upgrade.on('click', function () {
        tapScreen.toggleClass("hidden", true);
        upgradeScreen.toggleClass("hidden", false);
        leagueScreen.toggleClass("hidden", true);
        mathScreen.toggleClass("hidden", true);
        // resetCounter = 0;
    });
    league.on('click', function () {
        tapScreen.toggleClass("hidden", true);
        upgradeScreen.toggleClass("hidden", true);
        leagueScreen.toggleClass("hidden", false);
        mathScreen.toggleClass("hidden", true);
        // resetCounter += 1;
        // if (resetCounter >= 25) {
        //     setNewUser().then(function () {
        //         console.log("new user set");
        //         resetCounter = 0;
        //     });
        // }
    });

    math.on('click', function () {
        tapScreen.toggleClass("hidden", true);
        upgradeScreen.toggleClass("hidden", true);
        leagueScreen.toggleClass("hidden", true);
        mathScreen.toggleClass("hidden", false);
    });

    coinButton.on('click', function () {
        if (energy >= tapUpgrade) {
            energy -= tapUpgrade;
            coins += tapUpgrade;
            coinsText.text(coins);
            updateEnergy();
        }
    });

    touchUpgradeBtn.on('click', function () {
        if (coins >= tapPrice) {
            tapUpgrade += 1;
            CloudStorage.setItem("tapUpgrade", tapUpgrade.toString());
            buyUpgradeAfter(tapPrice);
        } else {
            // todo: flying text to show that you don't have enough coins
        }
    });

    limitUpgradeBtn.on('click', function () {
        if (coins >= limitPrice) {
            limitUpgrade += 1;
            CloudStorage.setItem("limitUpgrade", limitUpgrade.toString());
            buyUpgradeAfter(limitPrice);
            updateMaxEnergy();
        } else {
            // todo: flying text to show that you don't have enough coins
        }
    });

    rechargeUpgradeBtn.on('click', function () {
        if (coins >= rechargePrice) {
            rechargeUpgrade += 1;
            CloudStorage.setItem("rechargeUpgrade", rechargeUpgrade.toString());
            buyUpgradeAfter(rechargePrice);
        } else {
            // todo: flying text to show that you don't have enough coins
        }
    });

    optionButtons.on('click', function () {
        stopTimer();
        console.log($(this).text());
        console.log(mathAnswer);
        if ($(this).text() === mathAnswer.toString()) {
            dingSound.play();
            $(this).addClass('correct');
            addPrizeCoins();
        } else {
            errorSound.play();
            $(this).addClass('wrong');
            optionButtons.each(function () {
                if ($(this).text() === mathAnswer.toString()) {
                    $(this).addClass('correct');
                }
            });
        }
    });

    startMathButton.on('click', function () {
        if (energy >= mathEnergy) {
            mathOverlay.fadeOut("fast", function () {
                startQuestion();
            });
        }
    });

    nextQuestionButton.on('click', function () {
        if (energy >= mathEnergy) {
            optionButtons.removeClass('correct').removeClass('wrong');
            startQuestion();
        }
    });

    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        return false;
    });

    startGame().then();
});
