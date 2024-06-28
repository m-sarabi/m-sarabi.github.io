$(document).ready(function () {
    const tap = $('#tap');
    const upgrade = $('#upgrade');
    const league = $('#league');
    const tapScreen = $('#tap-screen');
    const upgradeScreen = $('#upgrade-screen');
    const leagueScreen = $('#league-screen');
    const failureScreen = $('#failure-screen');
    const coinButton = $('.coin.tap');
    const coinsText = $('#coins-value');
    const touchUpgradeBtn = $('#touch-upgrade-btn');
    const limitUpgradeBtn = $('#limit-upgrade-btn');
    const rechargeUpgradeBtn = $('#recharge-upgrade-btn');
    const energyValue = $('#energy-value');
    const maxEnergyValue = $('#max-energy-value');
    const energyBar = $('.energy-progress');
    const debug = $('#debug');

    let keys, coins = 0, tapUpgrade = 1, limitUpgrade = 1, rechargeUpgrade = 1, energy = 1000, maxEnergy = 1000;
    let tapPrice, limitPrice, rechargePrice;
    // let resetCounter = 0;

    const WebApp = window.Telegram.WebApp;
    const CloudStorage = window.Telegram.WebApp.CloudStorage;

    function isNumeric(str) {
        if (typeof str != "string") return false;
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    function getKeys() {
        return new Promise((resolve, reject) => {
            CloudStorage.getKeys(function (err, res) {
                if (err !== null) {
                    console.error(err);
                    debug.text(err);
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
                    debug.text(err);
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
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
            resolve();
        });
    }

    async function getInfo() {
        coins = await getItem("coins");
        if (!isNumeric(coins)) await setNewUser();
        coins = parseInt(coins);
        console.log(coins);

        tapUpgrade = await getItem("tapUpgrade");
        if (!isNumeric(tapUpgrade)) await setNewUser();
        tapUpgrade = parseInt(tapUpgrade);
        console.log(tapUpgrade);

        limitUpgrade = await getItem("limitUpgrade");
        if (!isNumeric(limitUpgrade)) await setNewUser();
        limitUpgrade = parseInt(limitUpgrade);
        console.log(limitUpgrade);

        rechargeUpgrade = await getItem("rechargeUpgrade");
        if (!isNumeric(rechargeUpgrade)) await setNewUser();
        rechargeUpgrade = parseInt(rechargeUpgrade);
        console.log(rechargeUpgrade);

        energy = await getItem("energy");
        if (!isNumeric(energy)) await setNewUser();
        energy = parseInt(energy);
        console.log(energy);
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

            energy = Math.min(energy + calculateOfflineEnergy(), maxEnergy);

            init();
            WebApp.ready();

        } catch (err) {
            console.error(err);
            showFailScreen();
            WebApp.ready();
        }
    }

    // calculate seconds since last online time
    function calculateOfflineTime() {
        let time = 0;
        CloudStorage.getItems(["time"], function (err, res) {
            if (err !== null) console.error(err);
            else time = res["time"];
        });
        return Math.floor((Date.now() - time) / 1000);
    }

    function calculateOfflineEnergy() {
        return rechargeUpgrade * calculateOfflineTime();
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
        // resetCounter = 0;
    });
    upgrade.on('click', function () {
        tapScreen.toggleClass("hidden", true);
        upgradeScreen.toggleClass("hidden", false);
        leagueScreen.toggleClass("hidden", true);
        // resetCounter = 0;
    });
    league.on('click', function () {
        tapScreen.toggleClass("hidden", true);
        upgradeScreen.toggleClass("hidden", true);
        leagueScreen.toggleClass("hidden", false);
        // resetCounter += 1;
        // if (resetCounter >= 25) {
        //     setNewUser().then(function () {
        //         console.log("new user set");
        //         resetCounter = 0;
        //     });
        // }
    });

    coinButton.on('click', function () {
        if (energy >= tapUpgrade) {
            energy -= tapUpgrade;
            coins += tapUpgrade;
            coinsText.text(coins);
            updateEnergy();
            debug.text(coins);
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

    $(document).bind("contextmenu", function (e) {
        e.preventDefault();
        return false;
    });

    startGame().then();
});
