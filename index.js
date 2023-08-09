const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

let page;
let browser;
const isHeadless = !process.argv.includes('--no-headless');

const userDataDirPath = path.join(__dirname, 'user_data');
let isInitializationInProgress = false;

const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
];

const ask = async (page, txt) => {
    await page.waitForSelector('textarea#prompt-textarea');
    await page.type('textarea#prompt-textarea', txt);
    const go = await page.waitForSelector('textarea#prompt-textarea + button');
    await go.click();
}

async function ensurePage() {
    if (!browser || !page || page.isClosed()) {
        await initBrowser();
    }
}

async function checkVerificationChallenge(page) {
    const frameNode = await page.evaluate(() => document.querySelector('iframe.show'));
    return !!frameNode
}

async function initBrowser() {
    if (isInitializationInProgress) {
        return;
    }

    isInitializationInProgress = true;

    browser = await puppeteer.launch({
        headless: isHeadless,
        args: minimal_args,
        userDataDir: userDataDirPath
    });
    page = await browser.newPage();

    try {
        await page.goto('https://chat.openai.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const loginButtonXPath = "//button[div[contains(text(), 'Log in')]]";
        const loginButtonExists = await page.waitForXPath(loginButtonXPath, { timeout: 15000 }).then(() => true).catch(() => false);

        if (!loginButtonExists) return

        const [loginButton] = await page.$x(loginButtonXPath);
        await loginButton.click();

        const username = process.env.USERNAME;
        const password = process.env.PASSWORD;
        
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await page.waitForSelector('input#username');
        await page.type('input#username', username);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.waitForSelector('input#password');
        await page.type('input#password', password);
        await page.waitForTimeout(1000);
        await page.waitForSelector('button._button-login-password');
        await page.click('button._button-login-password');
        await page.waitForSelector('div[role="dialog"]');
        const dialogDiv = await page.$('div[role="dialog"]');
        const dialogButton = await dialogDiv.$('div[role="dialog"] button');
        await dialogButton.click();
        await page.waitForTimeout(1000);
        const dialogButton2 = await dialogDiv.$('div[role="dialog"] button:nth-child(2)');
        await dialogButton2.click();
        await page.waitForTimeout(1000);
        const dialogButton3 = await dialogDiv.$('div[role="dialog"] button:nth-child(2)');
        await dialogButton3.click();
        await page.waitForTimeout(1000);

    } catch (err) {
        console.error('Error:', err);
        await browser.close();
    } finally {
        isInitializationInProgress = false;
    }
}

app.use(express.json());

app.get('/', async (req, res) => {
    if (isInitializationInProgress) {
        res.json({ message: 'Connection initialization in progress' });
        return;
    }
    if (await checkVerificationChallenge(page)) {
        res.json({ message: 'Verification Challange popup' });
        return;
    }
    try {
        await ensurePage();
        const elements = await page.$$eval('.text-token-text-primary.bg-gray-50 p', (nodes) => nodes.map((node) => node.textContent));
        res.json(elements);
    } catch (error) {
        console.error('Error during GET request:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post('/', async (req, res) => {
    const { text } = req.body;

    if (isInitializationInProgress) {
        res.json({ message: 'Connection initialization in progress' });
        return;
    }
    if (await checkVerificationChallenge(page)) {
        res.json({ message: 'Verification Challange popup' });
        return;
    }
    try {
        await ensurePage();
        await ask(page, text);
        await page.waitForTimeout(5000);
        const elements = await page.$$eval('.text-token-text-primary.bg-gray-50 p', (nodes) => nodes.map((node) => node.textContent));
        res.json(elements);
    } catch (error) {
        console.error('Error during POST request:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

const portArgIndex = process.argv.indexOf('--port');
const PORT = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : 4000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    try {
        await initBrowser();
        console.log('Puppeteer browser initialized');
    } catch (error) {
        console.error('Error initializing Puppeteer:', error);
    }
});
