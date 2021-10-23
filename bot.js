const puppeteer = require('puppeteer')
require('dotenv').config();


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


async function init() {
    console.log("init...")
    global.browser = await puppeteer.launch({
        headless: false,
        executablePath: process.env.CHROME_PATH
    })
    global.page = await browser.newPage();
    await global.page.goto('https://open.spotify.com/', {
        waitUntil: 'networkidle2',
    });
    console.log("init complete!")
}

async function login() {
    console.log("login...")
    await global.page.goto('https://accounts.spotify.com/en/login', {
        waitUntil: 'networkidle2',
    });
    await global.page.type('#login-username', process.env.SPOTIFY_USERNAME )
    await global.page.type('#login-password', process.env.SPOTIFY_PASSWORD)
    await global.page.waitForSelector('#login-button')
    await global.page.click('#login-button')
    await global.page.waitForSelector('body > div > div.container-fluid.status.ng-scope > div > div > div:nth-child(4) > div > a')
    await global.page.click('body > div > div.container-fluid.status.ng-scope > div > div > div:nth-child(4) > div > a')
    await global.page.waitForSelector('#onetrust-accept-btn-handler')
    await global.page.waitForTimeout(1000)
    await global.page.click('#onetrust-accept-btn-handler')
    console.log("login complete!")

}

async function loadPlaylistAndSetup() {
    console.log("loadPlaylistAndSetup...")
    await global.page.goto(process.env.SPOTIFY_PLAYLIST);
    await global.page.waitForTimeout(1000)
    //activate auto loop
    await global.page.waitForSelector('#main > div > div.Root__top-container > div.Root__now-playing-bar > footer > div > div.mF7iSITxB6KQzvdXe4qJ > div > div.player-controls__buttons > div.player-controls__right > button.__1BGhJvHnvqYTPyG074')
    await global.page.click('#main > div > div.Root__top-container > div.Root__now-playing-bar > footer > div > div.mF7iSITxB6KQzvdXe4qJ > div > div.player-controls__buttons > div.player-controls__right > button.__1BGhJvHnvqYTPyG074')
    await global.page.waitForTimeout(500)
    //mute spotify
    await global.page.click('#main > div > div.Root__top-container > div.Root__now-playing-bar > footer > div > div._Q_UIUCFJkd1IkvfdA_c > div > div.volume-bar > button')
    await global.page.waitForTimeout(500)
    //play playlist
    await global.page.click('#main > div > div.Root__top-container > div.Root__main-view > main > div.os-host.os-host-foreign.os-theme-spotify.os-host-resize-disabled.os-host-scrollbar-horizontal-hidden.main-view-container__scroll-node.os-host-transition.os-host-overflow.os-host-overflow-y > div.os-padding > div > div > div.main-view-container__scroll-node-child > section > div.I1cppg1eJlgG6FCdhjO3 > div._53WyqaJU3v_38h1w_M9.contentSpacing > div > button.jn05jgnCWyQjLZKqyKFa._LL_A9TkcmSEuHntj_bw')
    console.log("init loadPlaylistAndSetup!")
}

async function playInLoop() {
    console.log("starting loop...")
    while (true) {
        //step to next track after some time
        await global.page.waitForTimeout((30 + getRandomInt(0, 20)) * 1000)
        await global.page.click('#main > div > div.Root__top-container > div.Root__now-playing-bar > footer > div.otEU_EZbRRfQ3N8GjRXp > div.mF7iSITxB6KQzvdXe4qJ > div > div.player-controls__buttons > div.player-controls__right > button.vwGw2RO2v__qDU_9c5PE')
    }
}



async function main() {
    await init()
    await login()
    await loadPlaylistAndSetup()
    await playInLoop()
}


main()