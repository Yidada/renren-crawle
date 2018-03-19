/**
 * @file crawl renren img
 * @author zhangyida<zydvip@yeah.net>
 */
const puppeteer = require('puppeteer');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const CONFIG = require('./config/renren');
const fs = require('fs');

// global variables
const URL = {
    home: 'http://wwww.renren.com',
    search: 'http://browse.renren.com/s/all?from=opensearch'
};
module.exports = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        // devtools: true
    });
    const page = await browser.newPage();
    let resultArr = [];
    await page.setViewport({
        width: 1280,
        height: 2000
    });
    // login
    await page.goto(URL.home);
    await page.waitFor('#email');
    await page.type('#email', CONFIG.username);
    await page.type('#password', CONFIG.password);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    // search userName
    // await page.goto(URL.search);
    // await page.waitFor('#resultSearchQ');
    // await page.type('#resultSearchQ', userName);
    // await page.waitFor(1000);
    // await page.keyboard.press('Enter');

    await page.goto(CONFIG.albumList);
    const ALBUM_ITEM_SELECTOR = '.album-box > a';
    await page.waitFor('.album-box');
    let albumList = await page.evaluate(sel => {
        let albumArr = document.querySelectorAll(sel);
        albumArr = Array.prototype.slice.call(albumArr);
        return albumArr.map(item => item.getAttribute('href'));
    }, ALBUM_ITEM_SELECTOR);

    async function getAlbumImgs(albumUrl) {
        let page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 926
        });
        await page.goto(albumUrl);
        const IMG_SELECTOR = '.p-b-item';
        await page.waitFor(IMG_SELECTOR);
        let itemCount = await page.evaluate(sel => {
            return document.querySelector(sel).innerText;
        }, '#album-count');

        // 滑动到底部
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                try {
                    const maxScroll = Number.MAX_SAFE_INTEGER;
                    const scrollDistant = 500;
                    let lastScroll = 0;
                    const interval = setInterval(() => {
                        window.scrollBy(0, scrollDistant);
                        const scrollTop = document.documentElement.scrollTop;
                        if (scrollTop === maxScroll || scrollTop === lastScroll) {
                            clearInterval(interval);
                            resolve();
                        }
                        else {
                            lastScroll = scrollTop;
                        }
                    }, 100);
                }
                catch (err) {
                    reject(err.toString());
                }
            });
        });

        // images title
        let imgTitle = await page.evaluate(sel => {
            return document.querySelector(sel).getAttribute('title');
        }, '#photo-tab > li:last-child a');

        // 所有请求完了
        let imgList = await page.evaluate((sel, itemCount) => {
            let imgArr = [];
            imgArr = Array.prototype.slice.call(document.querySelectorAll('.p-b-item'));
            return imgArr.map(item => JSON.parse(item.getAttribute('data-viewer')).url);
        }, IMG_SELECTOR, itemCount);

        return {
            title: imgTitle,
            content: imgList
        };
    }
    for (let index = 0; index < albumList.length; index++) {
        const element = await getAlbumImgs(albumList[index]);
        resultArr.push(element);
    }
    // write data to json file
    fs.writeFile(CONFIG.jsonPath, JSON.stringify(resultArr), {
        encoding: 'utf-8'
    }, err => {
        if (err) {
        }
        browser.close();
        return 'ok';
    });
};
