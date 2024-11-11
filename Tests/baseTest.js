const SSUStrategySelector = require('../SSUStrategy/SsuStrategySelector');
const CommonUtils = require('../Utilities/commonUtils');
const SsuBaseStrategy = require('../SSUStrategy/SSUBaseStrategy');
const landingPageFaqData = require("../Objects/faqValidationData/faqData.json");

class BaseTest {
    constructor(testCaseAttributes) {
        return (async () => {
            this.testCaseAttributes = testCaseAttributes;
            this.landingPageElements = await CommonUtils.getElementsFromCSV(`./Objects/locators/${testCaseAttributes.region}/LandingPage.csv`, testCaseAttributes.country);
            this.landingPageTestData = await CommonUtils.loadTestDataFromCSV(`./Objects/SSU_Common/v3React/testData/${testCaseAttributes.region}/LandingPage_data.csv`, testCaseAttributes.testCaseName);
            this.businessPageElements = await CommonUtils.getElementsFromCSV(`./Objects/SSU_Common/v3React/locators/${testCaseAttributes.region}/BusinessDetailsPage.csv`, testCaseAttributes.country, true, false);
            this.businessPageTestData = await CommonUtils.loadTestDataFromCSV(`./Objects/SSU_Common/v3React/testData/${testCaseAttributes.region}/BusinessDetailsPage_data.csv`, testCaseAttributes.testCaseName);
            this.country = testCaseAttributes.country;
            this.ssuStrategy = new SsuBaseStrategy(await SSUStrategySelector.selectStrategy(testCaseAttributes));

            return this;
        })();
    };

    async validateFAQText() {
        await CommonUtils.NavigateUserToLandingPage(this.testCaseAttributes.region, this.country, process.env.SSU_ENV, this.testCaseAttributes.language);
        await CommonUtils.cookieBannerAction("deny");
        await this.ssuStrategy.verifyFaqSectionText(this.landingPageElements, landingPageFaqData[this.testCaseAttributes.region][this.testCaseAttributes.country][this.testCaseAttributes.language], this.testCaseAttributes.country);

    }
}

module.exports = BaseTest;