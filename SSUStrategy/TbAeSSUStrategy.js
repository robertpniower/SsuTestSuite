const { assert } = require("chai");
const CommonSsuStrategy = require('./CommonSSUStrategy')
const UIExecutor = require('../UIExecutor/UIExecutor.js');
const utility = require('../Utilities/utility.js');
const Operations = require("../Operations/Operations.js");
let allureReporter = require("@wdio/allure-reporter").default;

class TalabatUAESsuStrategy extends CommonSsuStrategy {
    constructor(testCaseAttributes){
        super();
        this.testCaseAttributes = testCaseAttributes
    }

    async validateRestaurantVerticalSegment(language, verticalSegments, businessPageElements) {
        allureReporter.addStep("INSIDE Talabat Restaurant Vertical Segment Test");
        let verticalSegmentElement = await browser.$(businessPageElements['vertical_segment'].locator);

        await verticalSegmentElement.waitForExist();
        await verticalSegmentElement.waitForDisplayed();
        let verticalValues = (await UIExecutor.getAllDropdownOptions(verticalSegmentElement)).sort();
        let businessVerticalSegments = verticalSegments.map(segment => segment.verticalSegmentTranslated).sort();

        await browser.refresh();

        allureReporter.addStep(`Asserting that verticalValues: ${verticalValues} are equal to verticalSegments: ${businessVerticalSegments}`);
        expect(businessVerticalSegments).to.deep.equal(verticalValues);

        for (let business of businessVerticalSegments) {
            await browser.refresh();
            verticalSegmentElement = await browser.$(businessPageElements['vertical_segment'].locator);
            await verticalSegmentElement.waitForExist();
            await verticalSegmentElement.waitForDisplayed();
            let segmentData = verticalSegments.find(segment => segment.verticalSegmentTranslated === business);
            let categories = segmentData.categories;
            let categoryTranslated = categories.map(category => category.categoryTranslated[language]).sort();

            await UIExecutor.selectListElementDropdownValue(verticalSegmentElement, business, 'visibleText');
            allureReporter.addStep(`Selected ${business} in dropdown element`);

            let businessCategoryElement = await browser.$(businessPageElements['category'].locator);

            await businessCategoryElement.waitForExist();
            await businessCategoryElement.waitForDisplayed();

            let categoryValues = (await UIExecutor.getAllDropdownOptions(businessCategoryElement)).sort();

            await browser.refresh();
            allureReporter.addStep(`Asserting that categoryValues: ${categoryValues} are equal to categorySegments: {categoryTranslated}`);
            expect(categoryTranslated).to.deep.equal(categoryValues);

        }

        return businessVerticalSegments;

    };

    async fillRestaurantVerticalSegments(businessPageElements, businessPageTestData, verticalSegments) {
        allureReporter.addStep('INSIDE FillRestaurantVerticalSegments.');
        let businessVerticalSegments = verticalSegments.map(segment => segment.verticalSegmentTranslated).sort();

        await UIExecutor.performUIInteractions(businessPageElements, businessPageTestData);

        for (let business of businessVerticalSegments) {
            if (business === 'Coffee') {
                continue;
            } else {
                let verticalSegmentElement = await browser.$(businessPageElements['vertical_segment'].locator);
                let businessCategoryElement = await browser.$(businessPageElements['category'].locator);

                await UIExecutor.selectListElementDropdownValue(verticalSegmentElement, business, 'visibleText');
                allureReporter.addStep(`Selected ${business} in dropdown element`)
                let categoryValues = (await UIExecutor.getAllDropdownOptions(businessCategoryElement)).sort();
                let categoryValuesString = categoryValues.join(";");

                await businessCategoryElement.waitForExist();
                await businessCategoryElement.waitForDisplayed();
                let randomCategories = [];

                if(categoryValues.length > 3){
                    randomCategories = await utility.getRandomValues(categoryValues, 3)
                }
                else {
                    randomCategories = [...categoryValues]
                }

                await UIExecutor.mutliSelectDropdownValue(businessCategoryElement, randomCategories.sort().join(";"), 'visibleText')

                const continueButton = await browser.$(businessPageElements['continue_button'].locator);

                await continueButton.waitForExist();
                await continueButton.waitForDisplayed();
                await Operations.toClick(continueButton);

                await Operations.waitUntilURLContainsText("address-details", "Err: Address-Details Page did not load", 500000, 3000);
                await Operations.waitForPageLoad();

                const backButton = await browser.$(businessPageElements['back_button'].locator);

                await backButton.waitForExist();
                await backButton.waitForDisplayed();
                await Operations.toClick(backButton);
                await Operations.waitForPageLoad();
                await browser.refresh();

                if (business === businessVerticalSegments[businessVerticalSegments.length - 1]) {
                    break;
                } else {
                    await UIExecutor.mutliSelectDropdownValue(businessCategoryElement, randomCategories.sort().join(";"), 'visibleText', false)

                }

            }
        }
    };
}

module.exports = TalabatUAESsuStrategy;