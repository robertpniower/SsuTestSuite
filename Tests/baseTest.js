const SsuStrategySelector = require('../SSUStrategy/SsuStrategySelector');
const CommonUtils = require('../Utilities/commonUtils');
const SsuBaseStrategy = require('../SSUStrategy/SSUBaseStrategy');
const landingPageFaqData = require("../Objects/faqValidationData/faqData.json");
const UiExecutor = require('../UiExecutor/UiExecutor');
const errorMessages = require('../Objects/errorMessages/errorMessages.json')

class BaseTest {
    constructor(testCaseAttributes) {
        return (async () => {
            this.testCaseAttributes = testCaseAttributes;
            this.landingPageElements = await CommonUtils.getElementsFromCSV(`./Objects/locators/${testCaseAttributes.region}/LandingPage.csv`, testCaseAttributes.country);
            this.landingPageTestData = await CommonUtils.loadTestDataFromCSV(`./Objects/testData/${testCaseAttributes.region}/LandingPage_data.csv`, testCaseAttributes.testCaseName);
            this.businessPageElements = await CommonUtils.getElementsFromCSV(`./Objects/locators/${testCaseAttributes.region}/BusinessDetailsPage.csv`, testCaseAttributes.country, true, false);
            this.businessPageTestData = await CommonUtils.loadTestDataFromCSV(`./Objects/testData/${testCaseAttributes.region}/BusinessDetailsPage_data.csv`, testCaseAttributes.testCaseName);
            this.addressPageElements =  await CommonUtils.getElementsFromCSV(`./Objects/locators/${testCaseAttributes.region}/AddressDetailsPage.csv`, testCaseAttributes.country, true, true);
            this.addressPageTestData =  await CommonUtils.loadTestDataFromCSV(`./Objects/testData/${testCaseAttributes.region}/AddressDetailsPage_data.csv`, testCaseAttributes.testCaseName);
            this.country = testCaseAttributes.country;
            this.ssuStrategy = new SsuBaseStrategy(await SsuStrategySelector.selectStrategy(testCaseAttributes));

            return this;
        })();
    };

    async validateFAQText() {
        await CommonUtils.NavigateUserToLandingPage(this.testCaseAttributes.region, this.country, process.env.SSU_ENV, this.testCaseAttributes.language);
        await CommonUtils.cookieBannerAction("deny");
        await this.ssuStrategy.verifyFaqSectionText(this.landingPageElements, landingPageFaqData[this.testCaseAttributes.region][this.testCaseAttributes.country][this.testCaseAttributes.language], this.testCaseAttributes.country);

    }

    async varifyErrorMessages() {
        await CommonUtils.NavigateUserToLandingPage(this.testCaseAttributes.region, this.country, process.env.SSU_ENV, this.testCaseAttributes.language);
        await UiExecutor.performUIInteractions(this.landingPageElements, this.landingPageTestData);
        await this.ssuStrategy.verifyErrorMessages(this.landingPageElements, errorMessages, this.country, this.testCaseAttributes.checkDisplayed);
    }

    async validateVerticalSegmentTest(verticalSegments) {
        await CommonUtils.NavigateUserToLandingPage(this.testCaseAttributes.region, this.country, process.env.SSU_ENV);
        await CommonUtils.cookieBannerAction("deny")
        await this.ssuStrategy.submitLandingPage(this.landingPageElements,this.landingPageTestData);
        let verticalSegment = await browser.$(this.businessPageElements['vertical_segment'].locator);
        let verticalValues = await UiExecutor.getAllDropdownOptions(verticalSegment);
        let dropVerticalSegments = verticalSegments.filter(verticalSegment => verticalSegment.verticalSegment !== 'Regular Restaurant');

        await this.ssuStrategy.validateVerticalSegment(this.testCaseAttributes.language, dropVerticalSegments, verticalValues);

        await browser.refresh();

        await UiExecutor.performUIInteractions(this.businessPageElements, this.businessPageTestData);

        await CommonUtils.fillVerticalSegmentField(verticalValues, this.businessPageElements);
    }

    async shopVerticalSegmentDropTest(verticalSegment){
        await CommonUtils.NavigateUserToLandingPage(this.testCaseAttributes.region, this.country, process.env.SSU_ENV);

        this.businessPageTestData.vertical_segment.data = verticalSegment.verticalSegmentTranslated[this.testCaseAttributes.language]
        await CommonUtils.cookieBannerAction("deny")
        await this.ssuStrategy.submitLandingPage(this.landingPageElements,this.landingPageTestData);
        await this.ssuStrategy.submitBusinessDetailsPage(this.businessPageElements,this.businessPageTestData);
        await this.ssuStrategy.submitAddressDetailsPage(this.addressPageElements, this.addressPageTestData)
        await CommonUtils.validateVerticalSegmentDropPage(this.businessPageTestData.vertical_segment.data, this.country, this.testCaseAttributes)

    }

}

module.exports = BaseTest;