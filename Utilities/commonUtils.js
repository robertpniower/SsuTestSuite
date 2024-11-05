const allureReporter = require("@wdio/allure-reporter").default;
const { assert } = require("chai");
let csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const countryConfig = require('../Objects/countryConfig.json');
const Operations = require('../Utilities/Operations');

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
* @dineshwarandh
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

        let testDataArray = await Utilities.getTest_rowData_fromCSVFile_and_convertToJSON(filePath, testScriptName, false);
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
                data = await Operations.generateRandomCharactersString(minLength);
                break;
            case "randomnumber":
                data = await RandomDataGenerator.generateRandomFixedNumber(minLength);
                break;
            case "randomsubaddress":
                data = await RandomDataGenerator.addRandomSubaddressToEmail(minLength);
                break;
            case "randomregexbaseddata":
                data = await Utilities.generateDataFromRegex(dataFormat);
                break;
            default:
                console.log(`!!!!!!!!! NO MATCHING DATA TYPE FOR GENERATING RANDOM DATA FOR ${dataType}. PLEASE CHECK !!!!`)
                assert.fail(`!!!!!!!!! NO MATCHING DATA TYPE FOR GENERATING RANDOM DATA FOR ${dataType}. PLEASE CHECK !!!!`)
        }

        return String(data);
    }
}

module.exports = CommonUtils;