const fs = require('fs');
const path = require('path');
const baseConf = require('../wdio.base.conf');
const CWD = process.env.CI ? process.env.WORKSPACE : process.env.PWD;

// Ensure exports.config is initialized with baseConf or an empty object
exports.config = Object.assign({}, baseConf.config || {}, {
    specs: [`${CWD}/Tests/**/**/*.js`],
    maxInstances: 1,
    capabilities: [
        {
            browserName: 'chrome',
            browserVersion: '130.0.6723.69',
            maxInstances: 1,
            'goog:chromeOptions': {
                args: process.env.HEADLESS === 'false'
                    ? []
                    : ['headless=new', 'window-size=1920,1080', 'disable-gpu', 'disable-dev-shm-usage', 'no-sandbox'],
                // Uncomment this line if `chromeModheader` is defined
                // extensions: [chromeModheader.getEncodedExtension()],
            },
        },
    ],
    logLevel: 'info',
    mochaOpts: {
        ui: 'bdd',
        timeout: process.env.DEBUG === 'true' ? 7999999 : 2999999,
        retries: 1,
    },
});

// onComplete Hook
exports.config.onComplete = function (exitCode, config, capabilities, results) {
    console.log("***************** INSIDE ONCOMPLETE FUNCTION ***************");

    try {
        let envProps = {};

        capabilities.forEach((capability, index) => {
            const { browserName, browserVersion } = capability;
            envProps[`BROWSER${index + 1}`] = browserName;
            envProps[`BROWSER_VERSION${index + 1}`] = browserVersion;
        });

        const folderName = './allure-results';
        const fileName = 'environment.properties';

        if (fs.existsSync(folderName)) {
            const filePath = path.join(folderName, fileName);
            const properties = Object.entries(envProps)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');

            fs.writeFileSync(filePath, properties);

            console.log(`Environment properties file '${fileName}' created successfully.`);
        } else {
            console.log(`Folder '${folderName}' does not exist.`);
        }

        if (!process.env.CI) {
            console.log("Not in CI Environment, Generating Allure report ");
            const exec = require('child_process').exec;
            exec('allure generate allure-results --clean && allure open', (error, stdout, stderr) => {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error) {
                    console.log('exec error: ' + error);
                }
            });
        }
    } catch (e) {
        console.log("**** Error Occurred in OnComplete function ******");
        console.log(e.message);
    }
};
