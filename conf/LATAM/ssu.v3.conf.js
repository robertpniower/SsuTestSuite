const deepmerge = require('deepmerge');
const fs = require('fs');
const path = require('path');
const baseConf = require('../../wdio.base.conf');
const utilities = require("../../Utilities/utility");
const CWD = process.env.CI ? process.env.WORKSPACE : process.env.PWD

exports.config = deepmerge(baseConf.config, {
    username: process.env.STAGEQAAUTO_USERNAME,
    password: process.env.STAGEQAAUTO_KEY,
    username_uat: process.env.STAGEQAAUTO_USERNAME_UAT,
    password_uat: process.env.STAGEQAAUTO_KEY_UAT,
});

exports.config.specs = [
    `${CWD}/Tests/**/*.js`
]
exports.config.capabilities[0].browserVersion = '130.0.6723.69';

exports.config.maxInstances = 1;
exports.config.capabilities[0].maxInstances = 1;
//exports.config.capabilities[0]['goog:chromeOptions']["extensions"]= [chromeModheader.getEncodedExtension()];
exports.config.logLevel = 'info';
exports.config.mochaOpts = {
    ui: 'bdd',
    timeout: process.env.DEBUG === 'true' ? 7999999 : 2999999,
    retries: 1,
},

exports.config.capabilities[0]['goog:chromeOptions']["args"] = (process.env.HEADLESS === 'false') ? [] : ['headless=new', 'window-size=1920,1080', 'disable-gpu', 'disable-dev-shm-usage', 'no-sandbox']

exports.config.onComplete = function (exitCode, config, capabilities, results) {
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
}
