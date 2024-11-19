const BaseTest = require('../baseTest');
const Utility = require('../../Utilities/utility');
const utility = require('../../Utilities/utility');

describe("SSU - Talabat - AE Tests", function () {

    it('AE FAQ validation', async function () {
        let testCaseAttributes = {country: "AE", testCaseName: "AE FAQ validation", language: "en", entity: "TB_AE", region: "MENA"};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.validateFAQText();
    });
})