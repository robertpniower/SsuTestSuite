const BaseTest = require('./baseTest');
const Utility = require('../Utilities/utility');

describe("SSU - PedidosYa - AR Tests", function () {

    it('AR FAQ validation', async function () {
        let testCaseAttributes = {country: "AR", testCaseName: "AR FAQ validation", language: "es", entity: "PY_AR", region: "LATAM"};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.validateFAQText();
    })
})