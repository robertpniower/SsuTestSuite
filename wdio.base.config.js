require('dotenv').config();
const utilities = require("./Utilities/utilities");
const path = require('path');

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
        utilities.deleteAllureJunitReports();
    },

    beforeSuite: async () => {
        await browser.url('/');
        await browser.maximizeWindow();
        await (await $('#username')).setValue(process.env.USERNAME);
        await (await $('#password')).setValue(process.env.PASSWORD);
        await (await $('#Login')).click();
    },

    afterTest: async (test, context, { passed }) => {
        if (!passed) {
            await browser.takeScreenshot();
        }
    },

    onComplete: (exitCode) => {
        try {
            const envProps = utilities.retrunEnvironmentInfosInForAllure();
            utilities.writeEnvironmentProperties('./allure-results', 'environment.properties', envProps);
            console.log('Generating Allure report...');
            utilities.generateAllureReport();
        } catch (e) {
            console.error('Error in onComplete:', e.message);
        }
    },

    beforeTest: () => {
        utilities.configureChaiAndWebDriver();
        utilities.setWdioBrowserTimeout();
    },
};
