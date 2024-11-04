const deepmerge = require('deepmerge');
const baseConf = require('../../wdio.base.config');
const commonSoql =  require("../../../Objects/SOQL/common_soql")
const utilities = require("../../Utilities/utilities");
const chromeModheader = require('chrome-modheader');

const CWD = process.env.CI ? process.env.WORKSPACE : process.env.PWD

exports.config = deepmerge(baseConf.config, {
    username: process.env.STAGEQAAUTO_USERNAME,
    password: process.env.STAGEQAAUTO_KEY,
    username_uat: process.env.STAGEQAAUTO_USERNAME_UAT,
    password_uat: process.env.STAGEQAAUTO_KEY_UAT,
    
});


exports.config.specs = [
     `${CWD}/Tests/SSU_V3_React/LATAM/**/*.js`
]
exports.config.capabilities[0].browserVersion = '130.0.6723.69';

exports.config.maxInstances = 1;
exports.config.capabilities[0].maxInstances = 1;
//exports.config.capabilities[0]['goog:chromeOptions']["extensions"]= [chromeModheader.getEncodedExtension()];
exports.config.logLevel = 'info';
exports.config.mochaOpts = {
    ui: 'bdd',
    timeout: process.env.DEBUG === 'true' ? 7999999: 2999999,
    retries: 1,
},

exports.config.capabilities[0]['goog:chromeOptions']["args"] =  (process.env.HEADLESS === 'false') ? [] : ['headless=new', 'window-size=1920,1080', 'disable-gpu', 'disable-dev-shm-usage', 'no-sandbox']
exports.config.before = function (capabilities, specs) {
    process.env.SSU_VERSION = "V3React"
    global.datadogApiKey = process.env.datadog_api_key

    commonSoql.get_auth_token(process.env.SSU_SF_CLIENT_ID_UAT, process.env.SSU_SF_CLIENT_SECRET_UAT, process.env.SSU_SF_USERNAME_UAT, process.env.SSU_SF_PASSWORD_UAT, process.env.SFENV).then(accessToken =>{
        process.env.SSU_SF_ACCESS_TOKEN = accessToken;
    })
};

exports.config.onComplete = function (exitCode, config, capabilities, results) {
    console.log("***************** INSIDE ONCOMPLETE FUNCTION ***************")
    try{
        let envProps = utilities.retrunEnvironmentInfosInForAllure(capabilities);
        utilities.writeEnvironmentProperties('./allure-results', 'environment.properties', envProps)
        utilities.generateAllureReport();
    }
    catch(e){
        console.log("**** Error Occurred in OnComplete function ******")
        console.log(e.message)
    }
   
};
