const puppeteer = require('puppeteer');
const eleme = require('./config/eleme');
const readline = require('readline');
const devices = require('puppeteer/DeviceDescriptors');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        appMode: true,
        devtools: true
    });
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const page = await browser.newPage();
    const iPhone = devices['iPhone 6'];
    await page.emulate(iPhone);
    await page.goto(eleme.crawlerUrl);
    try {
        // 配置我的地址
        page.click(eleme.$doms.$location);
        await page.type(eleme.$doms.$locationInput, '百度科技园5号楼');
        await page.keyboard.press('Enter');
        await page.waitFor(eleme.$doms.$locationFirstElem);
        await page.click(eleme.$doms.$locationFirstElem);
        // 跳到目录页面
        await page.waitFor('.mint-swipe-item');
        await page.click(eleme.$doms.$footentry);
        await page.waitFor('.categories-2ylKB_0');
        // 列出所有的分类让你选择
        await page.tap('.categories-2ylKB_0');
        // await page.waitFor('.filter-category.open');
        
        // let menuItems = await page.$$(eleme.$doms.$menuItemMain);
        // console.log(menuItems);
    }
    catch (e) {
        console.warn(e);
    }
})();