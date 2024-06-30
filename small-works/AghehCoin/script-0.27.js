$(document).ready(function () {
    const elements = {
        tap: $('#tap'),
        upgrade: $('#upgrade'),
        league: $('#league'),
        math: $('#math'),
        tapScreen: $('#tap-screen'),
        upgradeScreen: $('#upgrade-screen'),
        leagueScreen: $('#league-screen'),
        mathScreen: $('#math-screen'),
        failureScreen: $('#failure-screen'),
        coinButton: $('.coin.tap'),
        coinsText: $('#coins-value'),
        touchUpgradeBtn: $('#touch-upgrade-btn'),
        limitUpgradeBtn: $('#limit-upgrade-btn'),
        rechargeUpgradeBtn: $('#recharge-upgrade-btn'),
        energyValue: $('.energy-value'),
        maxEnergyValue: $('#max-energy-value'),
        energyBar: $('.energy-progress'),
        optionButtons: $("#options button"),
        questionElement: $("#question"),
        nextQuestionButton: $("#next-question"),
        timerElem: $(".timer"),
        startMathButton: $("#start-math"),
        mathOverlay: $("#math-overlay"),
        dingSound: document.getElementById("ding-sound"),
        errorSound: document.getElementById("error-sound"),
    };

    const audioContext = new AudioContext();
    const dingTrack = audioContext.createMediaElementSource(elements.dingSound);
    dingTrack.connect(audioContext.destination);
    const errorTrack = audioContext.createMediaElementSource(elements.errorSound);
    errorTrack.connect(audioContext.destination);

    let keys, coins = 0, tapUpgrade = 1, limitUpgrade = 1, rechargeUpgrade = 1, energy = 10000, maxEnergy = 1000;
    let plantAge = 0, plantWater = 0;
    let tapPrice, limitPrice, rechargePrice;
    let mathAnswer = 0, mathTimer = 0, mathEnergy = 1000, combo = 0;
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
        elements.nextQuestionButton.prop("disabled", true);
        elements.optionButtons.prop("disabled", false);
        startTimer();
    }

    function addQuestion(question) {
        elements.questionElement.text(question[0] + " " + question[2] + " " + question[1] + " = ?");
    }

    function addOptions(options) {
        elements.optionButtons[0].innerHTML = options[0];
        elements.optionButtons[1].innerHTML = options[1];
        elements.optionButtons[2].innerHTML = options[2];
        elements.optionButtons[3].innerHTML = options[3];
        elements.optionButtons[4].innerHTML = options[4];
        elements.optionButtons[5].innerHTML = options[5];
    }

    function startTimer() {
        mathTimer = 8;
        elements.timerElem.text(8);
        mathTimeInterval = setInterval(function () {
            mathTimer--;
            elements.timerElem.text(mathTimer);
            if (mathTimer <= 0) {
                stopTimer();
                elements.errorSound.play().then();
                elements.optionButtons.each(function () {
                    if ($(this).text() === mathAnswer.toString()) {
                        $(this).addClass('wrong');
                    }
                });
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(mathTimeInterval);
        elements.nextQuestionButton.prop("disabled", false);
        elements.timerElem.text(8);
        elements.optionButtons.prop("disabled", true);
    }

    function addPrizeCoins() {
        // 10x * combo of current tapUpgrade
        const prizeShare = 10 * combo * tapUpgrade;
        coins += prizeShare;
        elements.coinsText.text(coins);
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
        elements.energyValue.text(energy);
        elements.energyBar.width((energy / maxEnergy) * 100 + '%');
    }

    function updateMaxEnergy() {
        maxEnergy = limitUpgrade * 1000;
        elements.maxEnergyValue.text(maxEnergy);
    }

    function saveInfo() {
        CloudStorage.setItem("data", `${coins}, ${tapUpgrade}, ${limitUpgrade}, ${rechargeUpgrade}, ${energy}, ${plantAge}, ${plantWater}`);
    }

    function setNewUser() {
        // coins, tapUpgrade, limitUpgrade, rechargeUpgrade, energy, plantAge, plantWater
        return new Promise((resolve) => {
            CloudStorage.setItem("data", "0,1,1,1,1000,0,0");

            coins = 0;
            tapUpgrade = 1;
            limitUpgrade = 1;
            rechargeUpgrade = 1;
            energy = 1000;
            maxEnergy = 1000;
            plantAge = 0;
            plantWater = 0;

            elements.coinsText.text(coins);
            buyUpgradeAfter(0);
            console.log("new user created");
            resolve();
        });
    }

    async function getInfo() {
        let data = await getItem("data");
        data = data.split(',');
        console.log(data);
        data.forEach((element, index) => {
            if (index === 0) coins = parseInt(element);
            if (index === 1) tapUpgrade = parseInt(element);
            if (index === 2) limitUpgrade = parseInt(element);
            if (index === 3) rechargeUpgrade = parseInt(element);
            if (index === 4) energy = parseInt(element);
            if (index === 5) plantAge = parseInt(element);
            if (index === 6) plantWater = parseInt(element);
        });
    }

    // periodically set the current time
    function saveTime() {
        setInterval(function () {
            CloudStorage.setItem("data", `${coins}, ${tapUpgrade}, ${limitUpgrade}, ${rechargeUpgrade}, ${energy}, ${plantAge}, ${plantWater}`);
        }, 5000);
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
            if (!keys.includes("data")) {
                await setNewUser();
            }

            await getInfo();

            elements.tapScreen.toggleClass('hidden', false);

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
        elements.failureScreen.toggleClass("hidden", false);
    }

    function buyUpgradeAfter(price) {
        coins -= price;
        CloudStorage.setItem("coins", coins.toString());
        elements.coinsText.text(coins);
        calculatePrices();
        updateLevels();
        saveInfo();
    }

    elements.tap.on('click', function () {
        elements.tapScreen.toggleClass("hidden", false);
        elements.upgradeScreen.toggleClass("hidden", true);
        elements.leagueScreen.toggleClass("hidden", true);
        elements.mathScreen.toggleClass("hidden", true);
        // resetCounter = 0;
    });
    elements.upgrade.on('click', function () {
        elements.tapScreen.toggleClass("hidden", true);
        elements.upgradeScreen.toggleClass("hidden", false);
        elements.leagueScreen.toggleClass("hidden", true);
        elements.mathScreen.toggleClass("hidden", true);
        // resetCounter = 0;
    });
    elements.league.on('click', function () {
        elements.tapScreen.toggleClass("hidden", true);
        elements.upgradeScreen.toggleClass("hidden", true);
        elements.leagueScreen.toggleClass("hidden", false);
        elements.mathScreen.toggleClass("hidden", true);
        // resetCounter += 1;
        // if (resetCounter >= 25) {
        //     setNewUser().then(function () {
        //         console.log("new user set");
        //         resetCounter = 0;
        //     });
        // }
    });

    elements.math.on('click', function () {
        elements.tapScreen.toggleClass("hidden", true);
        elements.upgradeScreen.toggleClass("hidden", true);
        elements.leagueScreen.toggleClass("hidden", true);
        elements.mathScreen.toggleClass("hidden", false);
    });

    elements.coinButton.on('click', function () {
        if (energy >= tapUpgrade) {
            energy -= tapUpgrade;
            coins += tapUpgrade;
            elements.coinsText.text(coins);
            updateEnergy();
        }
    });

    elements.touchUpgradeBtn.on('click', function () {
        if (coins >= tapPrice) {
            tapUpgrade += 1;
            CloudStorage.setItem("tapUpgrade", tapUpgrade.toString());
            buyUpgradeAfter(tapPrice);
        } else {
            // todo: flying text to show that you don't have enough coins
        }
    });

    elements.limitUpgradeBtn.on('click', function () {
        if (coins >= limitPrice) {
            limitUpgrade += 1;
            CloudStorage.setItem("limitUpgrade", limitUpgrade.toString());
            buyUpgradeAfter(limitPrice);
            updateMaxEnergy();
        } else {
            // todo: flying text to show that you don't have enough coins
        }
    });

    elements.rechargeUpgradeBtn.on('click', function () {
        if (coins >= rechargePrice) {
            rechargeUpgrade += 1;
            CloudStorage.setItem("rechargeUpgrade", rechargeUpgrade.toString());
            buyUpgradeAfter(rechargePrice);
        } else {
            // todo: flying text to show that you don't have enough coins
        }
    });

    elements.optionButtons.on('click', function () {
        stopTimer();
        console.log($(this).text());
        console.log(mathAnswer);
        if ($(this).text() === mathAnswer.toString()) {
            elements.dingSound.play();
            $(this).addClass('correct');
            combo += 1;
            addPrizeCoins();
        } else {
            elements.errorSound.play().then();
            $(this).addClass('wrong');
            combo = 0;
            elements.optionButtons.each(function () {
                if ($(this).text() === mathAnswer.toString()) {
                    $(this).addClass('correct');
                }
            });
        }
    });

    elements.startMathButton.on('click', function () {
        if (energy >= mathEnergy) {
            elements.mathOverlay.fadeOut("fast", function () {
                startQuestion();
            });
        }
    });

    elements.nextQuestionButton.on('click', function () {
        if (energy >= mathEnergy) {
            elements.optionButtons.removeClass('correct').removeClass('wrong');
            startQuestion();
        }
    });

    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        return false;
    });

    startGame().then();
});
