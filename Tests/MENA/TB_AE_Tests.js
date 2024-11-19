const BaseTest = require('../baseTest');
const Utility = require('../../Utilities/utility');
const utility = require('../../Utilities/utility');

describe("SSU - Talabat - AE Tests", function () {

    it('AE FAQ validation', async function () {
        let testCaseAttributes = {country: "AE", testCaseName: "AE FAQ validation", language: "en", entity: "TB_AE", region: "MENA"};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.validateFAQText();
    });

    it('AE Shop Validate VerticalSegment Test', async function () {
        let verticalSegments = require('../../Objects/verticalSegments/MENA/TB_AE.json');
        let dropVerticalSegments = verticalSegments.filter(verticalSegment => verticalSegment.drop === true);
        let testCaseAttributes = {country: "AE", testCaseName: "AE Shop Validate VerticalSegment Test", language: "en", entity: "TB_AE", region: "MENA"};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.shopVerticalSegmentTest(dropVerticalSegments)
    });

    it.only('AE Restarant Validate VerticalSegment Test', async function () {
        let verticalSegments = require('../../Objects/categories/MENA/TB_AE.json');
        let dropVerticalSegments = verticalSegments.filter(verticalSegment => verticalSegment.drop === true);
        let testCaseAttributes = {country: "AE", testCaseName: "AE Restaurant Validate VerticalSegment Test", language: "en", entity: "TB_AE", region: "MENA"};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.validateRestaurantVerticalSegmentTest(dropVerticalSegments)
    });
})