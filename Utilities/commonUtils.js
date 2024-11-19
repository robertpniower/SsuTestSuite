const allureReporter = require("@wdio/allure-reporter").default;
const { assert } = require("chai");
let csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const countryConfig = require('../Objects/countryConfig.json');
const Operations = require('../Operations/Operations');
const Utility = require('./utility');
const UiExecutor = require("../UIExecutor/UIExecutor")

class CommonUtils {

    /**
 * To navigate to SSU landing page of given entity, country and environment
 * @param {*} entity - Entity name
 * @param {*} countryCode - Country Code
 * @param {*} environment - Environment
 */
    async NavigateUserToLandingPage(region, countryCode, environment, language = 'en') {
        let url = countryConfig[region][countryCode]["landingPage"][environment.toLowerCase()]
        let newUrl = (region != "LATAM") ? `${url}/${language}` : url;

        console.log(`URL: ${newUrl}`);
        await browser.newWindow(newUrl);
        allureReporter.addStep(`opening URL ${newUrl}`);
        await Operations.waitForPageLoad();
        allureReporter.addStep("Navigated to SSU Landing page");
        allureReporter.addStep(
            "Started the Test for the Country: " + region + "-" + countryCode
        );

        return url.toLowerCase();
    }

    /**
  * To filter Elements applicable for a given countryCode
  * @param {*} elements - Elements Object of a page
  * @param {*} countryCode - country code for which the elements has to be filtered
  */
    async filterElementsByCountryCode(elements, countryCode) {
        let applicableElements = {}

        for (let key in elements) {
            if (elements[key].countries.indexOf(countryCode) !== -1) {
                applicableElements[key] = elements[key]
            }
        }

        return applicableElements
    }

    /**
   * @description - Method to generate locator string based on the provided locator type
   * @param {*} locator - locator value
   * @param {*} locatorType - type of the locator
   */
    async getLocatorString(locator, locatorType) {

        let locatorString = "";

        switch (locatorType.toLowerCase()) {
            case "data-testid":
                locatorString = `[data-testid = '${locator}']`;
                break;

            case "id":
                locatorString = `#${locator}`;
                break;

            case "custom":
                locatorString = `${locator}`.replace(/["]+/g, '');
                break;

            case "name":
                locatorString = `[name = '${locator}']`;
                break;

            default:
                console.log(`Bad Locator type: ${locatorType}`);
                assert.fail(`Bad Locator type!!! No matching Locator type found for ${locatorType}. Please check!!!`);

        }

        return locatorString;
    }

    /**
* @description - Function to read web elements CSV and return it as a JSON object
* @param {*} filePath - Absolute Path to the elements File
* @param {*} country - Country Name
* @param {*} filterByCountry - Defaults to True - Filter Elements by Country Name and returns the filtered list
*/
    async getElementsFromCSV(filePath, country, filterByCountry = true) {
        if (!fs.existsSync(filePath)) {
            return {};
        }

        let elementsArray = csvToJson.supportQuotedField(true).parseSubArray('*', ';').fieldDelimiter(',').getJsonFromCsv(filePath);
        let elementsObject = {};

        for (let element of elementsArray) {
            const locatorString = await this.getLocatorString(element.locator, element.locatorType);

            element.locator = locatorString;
            elementsObject[element.fieldName] = element;
        }

        if (filterByCountry) {
            elementsObject = await this.filterElementsByCountryCode(elementsObject, country);
        }

        return elementsObject;
    }

    /**
 * @description - Function to read test data CSV and return it as a JSON object
 * @param {*} filePath - Absolute Path to the test data File
 * @param {*} testScriptName - Name of the test script
 * @param {*} index - Defaults to Zero - value will taken when two sets of test data is present for the same TC
 */
    async loadTestDataFromCSV(filePath, testScriptName, index = 0) {
        if (!fs.existsSync(filePath)) {
            return {};
        }

        let testDataArray = await Utility.getTest_rowData_fromCSVFile_and_convertToJSON(filePath, testScriptName, false);
        let formattedTestData = {};

        if (testDataArray) {
            let testData = testDataArray[index];

            delete testData[testScriptName];

            for (let field in testData) {
                let dataFormat = testData[field].split("||")[0].trim();

                console.log("TEST DATA: " + field + ":" + testData[field])
                let dataActionObj = {
                    data: dataFormat.includes("random") ? await this.generateRandomTestData(dataFormat) : dataFormat,
                    action: testData[field].split("||")[1].trim()
                }

                formattedTestData[field.trim()] = dataActionObj
            }
        }

        return formattedTestData;
    }

    /**
 * @dineshwarandh
 * @description - Function to generate random data for the given dataformat and length
 * @param {*} dataFormat - data format provided by the user in CSV containing dataType, min length and max length
 */
    async generateRandomTestData(dataFormat) {
        const dataType = dataFormat.toLowerCase().split('(')[0];
        const minLength = dataFormat.includes(',') ? dataFormat.split("(")[1].split(",")[0] : dataFormat.split("(")[1].slice(0, -1);
        const maxLength = dataFormat.includes(',') ? dataFormat.split(",")[1].slice(0, -1) : dataFormat.split("(")[1].slice(0, -1);
        let data;

        console.log("****************DATA TYPE: " + dataType)

        switch (dataType) {
            case "randomcharacter":
                data = await Utility.generateRandomCharacterString(minLength);
                break;
            case "randomnumber":
                data = await Utility.generateRandomFixedNumber(minLength);
                break;
            case "randomsubaddress":
                data = await Utility.addRandomSubaddressToEmail(minLength);
                break;
            case "randomregexbaseddata":
                data = await Utility.generateDataFromRegex(dataFormat);
                break;
            default:
                console.log(`!!!!!!!!! NO MATCHING DATA TYPE FOR GENERATING RANDOM DATA FOR ${dataType}. PLEASE CHECK !!!!`)
                assert.fail(`!!!!!!!!! NO MATCHING DATA TYPE FOR GENERATING RANDOM DATA FOR ${dataType}. PLEASE CHECK !!!!`)
        }

        return String(data);
    }

    /**
   * @description - iterate all the objects and filter only testdata and remove other fields
   * @param {testData} - an object containing multiple testdata object
   * @returns {object} returns only test data as object of objects
   */
    async cookieBannerAction(action) {
        let isCookieBannerDisplayed = false;

        await browser.pause(5000);
        isCookieBannerDisplayed = await browser
            .$(">>>[data-testid='uc-deny-all-button']")
            .isDisplayed();

        if(isCookieBannerDisplayed){
            switch (action.toLocaleLowerCase()) {
                case "deny":
                    await browser
                        .$(">>>[data-testid='uc-deny-all-button']")
                        .click();

                    break;
                case "accept":
                    await browser
                        .$(">>>[data-testid='uc-accept-all-button']")
                        .click();
                    break;

                default:
                    assert.fail("No Matching Cookie Banner Action");
            }
        }
    }

    async waitForV3Loader(){
        const v3LoaderLocator = ".MuiLinearProgress-indeterminate"

        try{
            await browser.$(v3LoaderLocator).waitForDisplayed();
        }
        catch{
            allureReporter.addStep(`Loader didn't display `);
        }

        await browser.$(v3LoaderLocator).waitForExist({reverse:true, timeout:40000});
    }

    /**
  * @description - Function to get relevant error message fields and locators
  * @param {*} elements - locator Object
  * @param {*} country - Country Name
  */
    async getErrorFields(elements, country) {
        const errorFields = [];

        for (const [fieldName, element] of Object.entries(elements)) {
            if (
                element['elementType'] === 'Text' &&
        element['locatorType'] === 'custom' &&
        element['countries'].includes(country)
            ) {
                errorFields.push(fieldName);
            }
        }

        return errorFields;
    }

    async assertText(element, data) {
        const text = await Operations.toGetText(element);
        const formattedText = text.replaceAll('\n', '');

        assert.equal(formattedText, data, `Text did not match for element with text: ${formattedText}`);
        allureReporter.addStep(`Asserted '${data}' in element with text: ${formattedText}`);
        console.log(`Asserted '${data}' in element with text: ${formattedText}`);
        console.log(`Text of Element ${element.selector}: ${formattedText}`);
    }

    /**
   * @robertpniowerdh
   * afunction to select all dropVerticalSegments in SSU BussinesDetailsPage
   * @param verticalValue -Array containing the values from VerticalSegment
   * @param businessPageElements -locators of businessDetailsPage
    */
    async fillVerticalSegmentField(verticalValues, businessPageElements) {

        for (let i = 0; i < verticalValues.length; i++) {

            const verticalSegment = await browser.$(businessPageElements['vertical_segment'].locator);
            const verticalItem = verticalValues[i]

            await Operations.waitForPageLoad();
            await verticalSegment.waitForExist();
            await verticalSegment.waitForDisplayed();
            await UiExecutor.selectListElementDropdownValue(verticalSegment, verticalItem, "visibleText");
            allureReporter.addStep(`Selected ${verticalItem} in dropdown element`);

            const continueButton = await browser.$(businessPageElements['continue_button'].locator);

            await continueButton.waitForExist();
            await continueButton.waitForDisplayed();
            await Operations.toClick(continueButton);
            await Operations.waitForPageLoad();

            await Operations.waitUntilURLContainsText("address-details", "Err: Address-Details Page did not load", 500000, 3000);

            const backButton = await browser.$(businessPageElements['atras_button'].locator);

            await backButton.waitForExist();
            await backButton.waitForDisplayed();
            await Operations.toClick(backButton);

        }
    }

    /**
   * @robertpniowerdh
   * function to transition from LandinPage to BusinessDetailsPage
   * @param verticalValue -Array containing the values from VerticalSegment
   * @param businessPageElements -locators of businessDetailsPage
    */
    async transitionToBusinessDetailsPage(landingPageElements) {
        await Operations.waitForPageLoad();

        let currentURL = await browser.getUrl();
        let bussinessURL = currentURL.replace('?lng=es', '/account-details/business-details');

        await browser.url(bussinessURL);
        await Operations.waitForPageLoad();

        let timeLineButton = await browser.$(landingPageElements['timeline_continue_button'].locator);

        await Operations.toClick(timeLineButton);

        let timeLineButton1 = await browser.$(landingPageElements['timeline_page1_continue_button'].locator);

        await Operations.toClick(timeLineButton1);
    }

    async validateVerticalSegmentDropPage(verticalSegment, country, testCaseAttributes){
        allureReporter.addStep('INSIDE validate Vertical Drop Page')
        let dropImage = await browser.$("//img[@alt='lead drop image']");

        Operations.waitForElementDisplayed( dropImage, 40000);

        if(testCaseAttributes.region === 'LATAM') {
            assert.isTrue((await dropImage.$("./preceding-sibling::div/p").getText()).includes(verticalSegment), "Vertical segment name is not displayed in Non-prioritised Vertical segment drop page");
        }

        let url = await Operations.getAttribute(await dropImage.$("./preceding-sibling::div/a"),'href');

        assert.deepEqual(url, countryConfig[testCaseAttributes.region][country]["v3Website"], "User is not redirected to respective website on clicking button in Drop page");
    }
}

module.exports = new CommonUtils();