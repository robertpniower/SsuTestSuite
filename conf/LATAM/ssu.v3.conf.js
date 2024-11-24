const fs = require('fs');
const path = require('path');
const baseConf = require('../../wdio.base.conf');
const CWD = process.env.CI ? process.env.WORKSPACE : process.env.PWD;

exports.config = {
    ...baseConf.config,
    specs: [`${CWD}/Tests/LATAM/**/*.js`],
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
            },
        },
    ],
    logLevel: 'info',
    mochaOpts: {
        ui: 'bdd',
        timeout: process.env.DEBUG === 'true' ? 7999999 : 2999999,
        retries: 1,
    },
};

// onComplete Hook
exports.config.onComplete = (exitCode, config, capabilities, results) => {
    console.log("***************** INSIDE ONCOMPLETE FUNCTION ***************");

    try {
        const envProps = capabilities.reduce((props, capability, index) => {
            const { browserName, browserVersion } = capability;

            props[`BROWSER${index + 1}`] = browserName;
            props[`BROWSER_VERSION${index + 1}`] = browserVersion;

            return props;
        }, {});
        const folderName = './allure-results';
        const fileName = 'environment.properties';

        // Safely write environment properties if the folder exists
        if (fs.existsSync(folderName)) {
            const filePath = path.join(folderName, fileName);
            const propertiesContent = Object.entries(envProps)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');

            fs.writeFileSync(filePath, propertiesContent);
            console.log(`Environment properties file '${fileName}' created successfully.`);
        } else {
            console.warn(`Folder '${folderName}' does not exist.`);
        }

        // Generate and open Allure report if not in CI
        if (!process.env.CI) {
            console.log("Not in CI Environment, Generating Allure report...");
            const { exec } = require('child_process');

            exec('allure generate allure-results --clean && allure open', (error, stdout, stderr) => {
                if (stdout) console.log('stdout:', stdout);
                if (stderr) console.error('stderr:', stderr);
                if (error) console.error('Error executing Allure command:', error.message);
            });
        }
    } catch (error) {
        console.error("**** Error Occurred in OnComplete function ******");
        console.error(error.message);
    }
};
