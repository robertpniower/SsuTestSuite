const baseConf = require('../../wdio.base.conf');
const deepmerge = require('deepmerge');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

exports.config = deepmerge(baseConf.config, {
    specs: [
        `${process.env.PWD}/Tests/SSU_V3_React/MENA/**/*.js` // Adjust path as needed
    ],
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        browserVersion: '130.0.6723.69',
        'goog:chromeOptions': {
            args: process.env.HEADLESS === 'false'
                ? []
                : ['headless=new', 'window-size=1920,1080', 'disable-gpu', 'disable-dev-shm-usage', 'no-sandbox'],
            prefs: {
                'download.default_directory': path.resolve(__dirname, 'Downloads'),
                'safebrowsing.enabled': false,
            },
        },
    }],
    logLevel: 'info',
    mochaOpts: {
        ui: 'bdd',
        timeout: process.env.DEBUG === 'true' ? 7999999 : 2999999,
        retries: 1,
    },
    beforeSuite: async () => {
        console.log('SSU V3 React Suite: Initializing...');

    },
    before: (capabilities, specs) => {
        process.env.SSU_VERSION = 'V3React';
        global.datadogApiKey = process.env.datadog_api_key;
    },
    onComplete: (exitCode, config, capabilities, results) => {
        console.log('********** Completing Test Execution **********');

        try {
            const envProps = capabilities.map(cap => {
                return `browserName=${cap.browserName}
                        browserVersion=${cap.browserVersion || 'unknown'}
                        platformName=${cap.platformName || 'unknown'}`;
            }).join('\n');
            const allureDir = './allure-results';

            if (!fs.existsSync(allureDir)) {
                fs.mkdirSync(allureDir, { recursive: true });
            }

            const envFilePath = path.resolve(allureDir, 'environment.properties');

            fs.writeFileSync(envFilePath, envProps);
            console.log('Environment properties written to Allure.');

            console.log('Generating Allure report...');
            childProcess.execSync('allure generate allure-results --clean && allure open', { stdio: 'inherit' });
        } catch (e) {
            console.error('**** Error Occurred in onComplete function ******');
            console.error(e.message);
        }
    }
});