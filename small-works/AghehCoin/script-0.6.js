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
    const debug = $('#debug');

    let keys, coins = 0, tapUpgrade, limitUpgrade, rechargeUpgrade, energy, maxEnergy;
    let tapPrice, limitPrice, rechargePrice;

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

    function calculatePrices() {
        tapPrice = 200 * Math.floor(Math.pow(1.1, tapUpgrade - 1));
        limitPrice = 200 * Math.floor(Math.pow(1.1, limitUpgrade - 1));
        rechargePrice = 200 * Math.floor(Math.pow(1.1, rechargeUpgrade - 1));
    }

    function updatePrices() {
        calculatePrices();
        $('#tap-price').text(tapPrice);
        $('#limit-price').text(limitPrice);
        $('#recharge-price').text(rechargePrice);
    }

    function updateLevels() {
        $('#tap-upgrade').text(tapUpgrade);
        $('#energy-upgrade').text(limitUpgrade);
        $('#recharge-upgrade').text(rechargeUpgrade);
    }

    function saveInfo() {
        CloudStorage.setItem("coins", coins.toString());
        CloudStorage.setItem("tapUpgrade", tapUpgrade.toString());
        CloudStorage.setItem("limitUpgrade", limitUpgrade.toString());
        CloudStorage.setItem("rechargeUpgrade", rechargeUpgrade.toString());
        CloudStorage.setItem("energy", energy.toString());
    }

    function setNewUser() {
        CloudStorage.setItem("newUser", "true");
        CloudStorage.setItem("coins", "0");
        CloudStorage.setItem("tapUpgrade", "1");
        CloudStorage.setItem("limitUpgrade", "1");
        CloudStorage.setItem("rechargeUpgrade", "1");
        CloudStorage.setItem("energy", "1000");
    }

    function getInfo() {
        CloudStorage.getItem("coins", function (err, res) {
            if (err !== null) console.error(err);
            else {
                if (!isNumeric(res)) {
                    CloudStorage.setItem("coins", "0");
                    getInfo();
                    return;
                }
                console.log(res);
                coins = parseInt(res);
            }
        });
        CloudStorage.getItem("tapUpgrade", function (err, res) {
            if (err !== null) console.error(err);
            else {
                if (!isNumeric(res)) {
                    CloudStorage.setItem("tapUpgrade", "1");
                    getInfo();
                    return;
                }
                console.log(res);
                tapUpgrade = parseInt(res);
            }
        });
        CloudStorage.getItem("limitUpgrade", function (err, res) {
            if (err !== null) console.error(err);
            else {
                if (!isNumeric(res)) {
                    CloudStorage.setItem("limitUpgrade", "1");
                    getInfo();
                    return;
                }
                console.log(res);
                limitUpgrade = parseInt(res);
            }
        });
        CloudStorage.getItem("rechargeUpgrade", function (err, res) {
            if (err !== null) console.error(err);
            else {
                if (!isNumeric(res)) {
                    CloudStorage.setItem("rechargeUpgrade", "1");
                    getInfo();
                    return;
                }
                console.log(res);
                rechargeUpgrade = parseInt(res);
            }
        });
        CloudStorage.getItem("energy", function (err, res) {
            if (err !== null) console.error(err);
            else {
                if (!isNumeric(res)) {
                    CloudStorage.setItem("energy", "1000");
                    getInfo();
                    return;
                }
                console.log(res);
                energy = parseInt(res);
            }
        });
    }

    // periodically set the current time
    function saveTime() {
        // CloudStorage.setItem("time", Date.now().toString());
        setInterval(function () {
            CloudStorage.setItem("energy", energy);
            CloudStorage.setItem("coins", coins);
        }, 5000);
    }

    // increase energy periodically every second by recharge speed amount
    function saveEnergy() {
        setInterval(function () {
            energy = Math.min(energy + rechargeUpgrade, maxEnergy);
        }, 1000);
    }

    async function startGame() {
        try {
            keys = await getKeys();
            console.log(keys);

            WebApp.expand();
            WebApp.enableClosingConfirmation();
            WebApp.BackButton.hide();
            WebApp.MainButton.hide();
            WebApp.SettingsButton.hide();
            if (!keys.includes("newUser")) {
                setNewUser();
            }

            getInfo();

            energy = Math.min(energy + calculateOfflineEnergy(), maxEnergy);
            tapScreen.toggleClass('hidden', false);

            buyUpgradeAfter(0);
            saveTime();
            saveEnergy();
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
        CloudStorage.setItem("coins", coins);
        coinsText.text(coins);
        calculatePrices();
        updateLevels();
        updatePrices();
        saveInfo();
    }

    tap.on('click', function () {
        tapScreen.toggleClass("hidden", false);
        upgradeScreen.toggleClass("hidden", true);
        leagueScreen.toggleClass("hidden", true);
    });
    upgrade.on('click', function () {
        tapScreen.toggleClass("hidden", true);
        upgradeScreen.toggleClass("hidden", false);
        leagueScreen.toggleClass("hidden", true);
    });
    league.on('click', function () {
        tapScreen.toggleClass("hidden", true);
        upgradeScreen.toggleClass("hidden", true);
        leagueScreen.toggleClass("hidden", false);
    });

    coinButton.on('click', function () {
        coins += tapUpgrade;
        CloudStorage.setItem("coins", coins);
        coinsText.text(coins);
        debug.text(coins);
    });

    touchUpgradeBtn.on('click', function () {
        if (coins >= tapPrice) {
            buyUpgradeAfter(tapPrice);
            tapUpgrade += 1;
            CloudStorage.setItem("tapUpgrade", tapUpgrade);
        } else {
            // todo: flying text to show that you don't have enough coins
        }
    });

    limitUpgradeBtn.on('click', function () {
        if (coins >= limitPrice) {
            buyUpgradeAfter(limitPrice);
            limitUpgrade += 1;
            CloudStorage.setItem("limitUpgrade", limitUpgrade);
        } else {
            // todo: flying text to show that you don't have enough coins
        }
    });

    rechargeUpgradeBtn.on('click', function () {
        if (coins >= rechargePrice) {
            buyUpgradeAfter(rechargePrice);
            rechargeUpgrade += 1;
            CloudStorage.setItem("rechargeUpgrade", rechargeUpgrade);
        } else {
            // todo: flying text to show that you don't have enough coins
        }
    });

    startGame().then();
});