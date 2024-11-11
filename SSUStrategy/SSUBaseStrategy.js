
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

    async submitRecoveryPage(testElements, testData){
        await this.strategy.submitRecoveryPage(testElements, testData);
    }

    async submitBusinessDetailsPage(testElements, testData){
        await this.strategy.submitBusinessDetailsPage(testElements, testData );
    }

    async submitAddressDetailsPage(testElements, testData){
        await this.strategy.submitAddressDetailsPage(testElements, testData );
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

    async validateCategoryValues(language, dropVerticalSegments, verticalSegments) {
        await this.strategy.validateCategoryValues(language, dropVerticalSegments, verticalSegments);
    }

    async validateCategory(language, dropVerticalSegments, category) {
        await this.strategy.validateCategory(language, dropVerticalSegments, category);
    }
}

module.exports = SsuBaseStrategy;