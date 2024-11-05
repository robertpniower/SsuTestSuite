require('dotenv').config();
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

exports.config = {
    runner: 'local',
    maxInstances: 5,
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: process.env.HEADLESS === 'false' ? [] : ['headless', 'window-size=1920,1080', 'disable-gpu', 'no-sandbox'],
            prefs: {
                'download.default_directory': path.resolve(__dirname, 'Downloads'),
                'safebrowsing.enabled': false,
            },
        },
    }],
    logLevel: 'error',
    baseUrl: 'https://test.salesforce.com/',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: [['allure', { outputDir: 'allure-results', disableWebdriverScreenshotsReporting: false }]],
    mochaOpts: {
        ui: 'bdd',
        timeout: 300000,
    },

    onPrepare: () => {
        const allureDir = path.resolve(__dirname, 'allure-results');
        if (fs.existsSync(allureDir)) {
            fs.rmSync(allureDir, { recursive: true, force: true });
            console.log('Allure reports directory deleted.');
        } else {
            console.log('No Allure reports directory found.');
        }
    },

    beforeSuite: async () => {
        await browser.url('/');
        await browser.maximizeWindow();
        const usernameField = await $('#username');
        const passwordField = await $('#password');
        const loginButton = await $('#Login');

        await usernameField.setValue(process.env.USERNAME);
        await passwordField.setValue(process.env.PASSWORD);
        await loginButton.click();
    },

    afterTest: async (test, context, { passed }) => {
        if (!passed) {
            await browser.takeScreenshot();
        }
    },

    onComplete: (exitCode) => {
        try {
            const envProps = `
                BROWSER=chrome
                BASE_URL=${process.env.BASE_URL || 'https://test.salesforce.com'}
                HEADLESS=${process.env.HEADLESS}
            `;
            const envFilePath = path.resolve(__dirname, 'allure-results', 'environment.properties');
            fs.writeFileSync(envFilePath, envProps);
            console.log('Environment properties written to Allure.');

            console.log('Generating Allure report...');
            childProcess.execSync('allure generate allure-results --clean && allure open', { stdio: 'inherit' });
        } catch (e) {
            console.error('Error in onComplete:', e.message);
        }
    },

    beforeTest: () => {
        const chai = require('chai');
        chai.use(require('chai-webdriverio').default);

        browser.setTimeout({
            'pageLoad': 10000,
            'implicit': 8000
        }
        );
    },
};
