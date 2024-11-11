// wdio.base.conf.js
require('dotenv').config();
const utilities = require("./Utilities/utility");
const rimraf = require("rimraf");
const fs = require('fs');
const path = require('path');
const { after } = require('mocha');

//https://v7.webdriver.io/docs/gettingstarted

exports.config = {

    //A runner in WebdriverIO orchestrates how and where tests are being run when using the testrunner.
    // WebdriverIO currently supports two different types of runner: local and browser runner.
    runner: 'local',

    // The property handles how many capabilities from the same test should run tests.
    maxInstances: 10,

    // A capability is a definition for a remote interface. It helps WebdriverIO to understand in
    // which browser or mobile environment you like to run your tests on.
    capabilities: [{

        // maxInstances can get overwritten per capability.
        maxInstances: 5,
        //
        browserName: 'chrome',
        browserVersion: '125.0.6422.19',

        'goog:chromeOptions': {
            args: (process.env.HEADLESS === 'false') ? [] : [
                'headless',
                'window-size=1920,1080',
                'disable-gpu',
                'disable-dev-shm-usage',
                'no-sandbox'
            ],
            prefs: {
                'profile.managed_default_content_settings.popups': 2,
                'profile.managed_default_content_settings.notifications': 2,

                'download.prompt_for_download': false,
                'download.default_directory': '\Downloads',
                'download.directory_upgrade': true,
                'browser.set_download_behavior': { behavior: 'allow' },
                'safebrowsing_for_trusted_sources_enabled': false,
                'safebrowsing.enabled': false,
                'safebrowsing.disable_download_protection': true,
            }
        },
    }],

    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'error',

    // Set specific log levels per logger
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevels: {
        webdriverio: 'debug',
        '@wdio/local-runner': 'debug',
        '@wdio/sync': 'debug',
        '@wdio/cli': 'debug',
        '@wdio/mocha-framework': 'debug',
    },

    // Run tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,

    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,

    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,

    // Default request retries count
    connectionRetryCount: 3,

    // Framework you want to run your specs with.
    framework: 'mocha',
    // Test reporter for stdout.
    reporters: [
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            disableMochaHooks: true,

        }],
        ['junit', {
            outputDir: 'junit',
            outputFileFormat: function (options) { // optional
                return `results-${options.cid}.xml`
            }
        }]],

    // Options to be passed to Mocha.
    mochaOpts: {
        ui: 'bdd',
        timeout: process.env.DEBUG === 'true' ? 7999999 : 2999999,
    },

    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: function () {
        rimraf('./allure-*', function () { console.log("deleted allure files "); });
        //rimraf('./junit', function () { console.log("Junit reports deleted "); });
    },

    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    beforeSuite: async function (suite) {
        await browser.maximizeWindow()

        if (process.env.ENV === 'UAT') {
            //     await (await $('#username')).setValue(this.username_uat)
            //     await (await $('#password')).setValue(this.password_uat)
            //     await (await $('#Login')).click()
            // }else{
            //     await (await $('#username')).setValue(this.username)
            //     await (await $('#password')).setValue(this.password)
            //     await (await $('#Login')).click()
        }
    },

    /**
     * Function to be executed after a test (in Mocha/Jasmine).
     */
    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            await browser.takeScreenshot();

        }
    },

    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */

    onComplete: function (exitCode, config, capabilities, results) {
        console.log("***************** INSIDE ONCOMPLETE FUNCTION ***************");

        try {
            // Initialize envProps as an object
            let envProps = {};

            capabilities.forEach((capability, index) => {
                const { browserName, browserVersion } = capability;

                envProps[`BROWSER${index + 1}`] = browserName;
                envProps[`BROWSER_VERSION${index + 1}`] = browserVersion;
            });

            let folderName = './allure-results';
            let fileName = 'environment.properties';

            folderName = folderName.replace(/^(\.\.(\/|\\|$))+/, '');
            fileName = fileName.replace(/^(\.\.(\/|\\|$))+/, '');

            // Check if the folder exists
            if (fs.existsSync(folderName)) {
                const filePath = path.join(folderName, fileName);
                const properties = Object.entries(envProps)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('\n');

                // Write the properties to the file
                fs.writeFileSync(filePath, properties);

                console.log(`Environment properties file '${fileName}' created successfully.`);
            } else {
                console.log(`Folder '${folderName}' does not exist.`);
            }

            if (!process.env.CI) {
                console.log("Not in CI Environment, Generating Allure report ");
                var exec = require('child_process').exec;
                let child = exec('allure generate allure-results --clean && allure open', function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);

                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
            }
        } catch (e) {
            console.log("**** Error Occurred in OnComplete function ******");
            console.log(e.message);
        }
    },

    /**
     * Function to be executed before a test (in Mocha/Jasmine only)
     * @param {object} test    test object
     * @param {object} context scope object the test was executed with
     */
    beforeTest: function (test, context) {
        const chai = require('chai');
        const chaiWebdriver = require('chai-webdriverio').default;

        chai.use(chaiWebdriver(browser));
        global.assert = chai.assert;
        global.should = chai.should;
        global.expect = chai.expect;
        browser.setTimeout({
            'pageLoad': 10000,
            'implicit': 8000
        })
    }
}
