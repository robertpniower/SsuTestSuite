const { assert } = require("chai");
const CommonSsuStrategy = require('./CommonSSUStrategy');
const UIExecutor = require('../UIExecutor/UIExecutor.js');
const utility = require('../Utilities/utility.js');
const Operations = require("../Operations/Operations.js");
let allureReporter = require("@wdio/allure-reporter").default;

class PedidisYaARSSUStrategy extends CommonSsuStrategy {
    constructor(testCaseAttributes){
        super();
        this.testCaseAttributes = testCaseAttributes
    }

    async validateRestaurantVerticalSegment(language, verticalSegments, businessPageElements) {
        allureReporter.addStep("INSIDE PedidosYa Restaurant Vertical Segment Test");
        let businessCategoryElement = await browser.$(businessPageElements['category'].locator);

        await businessCategoryElement.waitForExist();
        await businessCategoryElement.waitForDisplayed();

        let categoryValues = (await UIExecutor.getAllDropdownOptions(businessCategoryElement)).sort();
        let segmentData = verticalSegments.find(segment => segment.verticalSegmentTranslated === 'Restaurant');
        let categories = segmentData.categories;
        let categoryTranslated = categories.map(category => category.categoryTranslated[language]).sort();

        await browser.refresh();
        allureReporter.addStep(`Asserting that verticalValues: ${categoryValues} are equal to verticalSegments: ${categoryTranslated}`);
        expect(categoryTranslated).to.deep.equal(categoryValues);

        return categoryTranslated

    }
}

module.exports = PedidisYaARSSUStrategy