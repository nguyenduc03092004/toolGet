import express from 'express'
import fs from 'fs'
import puppeteer from 'puppeteer'
let data = fs.readFileSync("./listPhone.doc", "utf-8")
data = data.split(",")
const tool = express()
let account = []
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
        const elementExists = await page.evaluate(() => {
            const element = document.querySelector('h2#swal2-title');
            return !!element; // Trả về true nếu phần tử tồn tại, false nếu không tồn tại
        });

        if (!elementExists) {
            account.push(data[i])
        }
        await browser.close()
        console.log("acc trung la", account)
    }
})

tool.get('/done', (req, res) => {
    console.log("acc trung la", account)
    res.send("done")
})
tool.listen(8000, () => {
    console.log("tool is running on the port 8000")
})

