const BaseTest = require('./baseTest');
const Utility = require('../Utilities/utility');

describe("SSU - PedidosYa - AR Tests", function () {

    it('AR FAQ validation', async function () {
        let testCaseAttributes = {country: "AR", testCaseName: "AR FAQ validation", language: "es", entity: "PY_AR", region: "LATAM"};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.validateFAQText();
    });

    it('AR - LandingPage error messages click', async function () {
        let testCaseAttributes = {country: "AR", testCaseName: "AR - LandingPage error messages click", language: "es", entity: "PY_AR", region: "LATAM", checkDisplayed: true};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.varifyErrorMessages();
    })

    it('AR - LandingPage error messages valid input', async function () {
        let testCaseAttributes = {country: "AR", testCaseName: "AR - LandingPage error messages valid input", language: "es", entity: "PY_AR", region: "LATAM", checkDisplayed: false};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.varifyErrorMessages();
    })

    it.only('AR Shop Validate VerticalSegment Test', async function () {
        let verticalSegments = require('../Objects/verticalSegments/LATAM/PY_AR.json');
        let testCaseAttributes = {country: "AR", testCaseName: "AR Shop Validate VerticalSegment Test", language: "es", entity: "PY_AR", region: "LATAM"};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.validateVerticalSegmentTest(verticalSegments);
    })
})