import express from 'express'
import fs from 'fs'
import puppeteer from 'puppeteer'
let data = fs.readFileSync("./listPhone.doc", "utf-8")
data = data.split(",")
const tool = express()
tool.get('/', async (req, res) => {
    for (let i = 0; i < data.length; i++) {
        if (i == data.length - 1) {
            res.redirect('/done')
        }
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 })
        await page.goto('https://code-live.hi88.tv/');
        await page.type('#code-id', data[i]);
        await page.waitForSelector('#submit-btn');
        await page.click('#submit-btn');
        await page.waitForSelector('#captcha');
        const content = await page.$eval('#captcha', div => div.textContent);
        await page.type('#captcha-input', content);
        await browser.close()
    }
})
tool.get('/done', (req, res) => {
    res.send("done")
})
tool.listen(8000, () => {
    console.log("tool is running on the port 8000")
})

