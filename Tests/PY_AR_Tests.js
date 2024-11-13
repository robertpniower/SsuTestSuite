const BaseTest = require('./baseTest');
const Utility = require('../Utilities/utility');
const utility = require('../Utilities/utility');

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

    it('AR Shop Validate VerticalSegment Test', async function () {
        let verticalSegments = require('../Objects/verticalSegments/LATAM/PY_AR.json');
        let testCaseAttributes = {country: "AR", testCaseName: "AR Shop Validate VerticalSegment Test", language: "es", entity: "PY_AR", region: "LATAM"};
        let baseTest = await new BaseTest(testCaseAttributes);

        await baseTest.validateVerticalSegmentTest(verticalSegments);
    })

    context('AR Shop Drop Test', async function () {
        let testCaseAttributes = {country: "AR", testCaseName: "AR Shop Drop Test", language: "es", entity: "PY_AR", region: "LATAM"};
        const verticalSegments = require('../Objects/verticalSegments/LATAM/PY_AR.json');
        let dropVerticalSegments = verticalSegments.filter(verticalSegment => verticalSegment.drop === true);

        dropVerticalSegments = await utility.getRandomElementsFromArray(dropVerticalSegments, 5);

        for (const dropVerticalSegment of dropVerticalSegments) {
            let baseTest = await new BaseTest(testCaseAttributes);

            it.only(`AR Shop Drop Test - ${dropVerticalSegment.verticalSegment}`, async function () {
                await baseTest.shopNonPrioritizedVerticalSegmentDropTest(dropVerticalSegment);
            })
        }
    })
})