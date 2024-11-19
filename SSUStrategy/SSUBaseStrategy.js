
class SsuBaseStrategy {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async submitLandingPage(testElements, testData){
        await this.strategy.submitLandingPage(testElements, testData);
    }

    async submitBusinessDetailsPage(testElements, testData){
        await this.strategy.submitBusinessDetailsPage(testElements, testData );
    }

    async submitAddressDetailsPage(testElements, testData){
        await this.strategy.submitAddressDetailsPage(testElements, testData );
    }

    async verifyErrorMessages(testElements, expectedErrorMessages, country,checkDisplayed) {
        await this.strategy.verifyErrorMessages(testElements, expectedErrorMessages, country, checkDisplayed);
    }

    async verifyFooterLinks(country, testElements, testData) {
        await this.strategy.verifyFooterLinks(country, testElements, testData);
    }

    async verifyFaqSectionText(testElements, testData, country) {
        await this.strategy.verifyFaqSectionText(testElements, testData, country);
    }

    async validateVerticalSegment(language, dropVerticalSegments, verticalSegments) {
        await this.strategy.validateVerticalSegment(language, dropVerticalSegments, verticalSegments);
    }

    async validateRestaurantVerticalSegment(language, verticalSegments, elements, testData) {
        await this.strategy.validateRestaurantVerticalSegment(language, verticalSegments, elements, testData);
    }
}

module.exports = SsuBaseStrategy;