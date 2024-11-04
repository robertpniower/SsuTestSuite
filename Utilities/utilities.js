const allureReporter = require('@wdio/allure-reporter').default;
const { assert } = require('chai');
const rimraf = require("rimraf");
var RandExp = require('randexp');
const fs = require('fs');
const path = require('path');
const format = require('date-fns/format');
const GlobalCountryEntityMapping = require("../Utilities/Entity_Country.json");

class Utility {

    /**
     * returns the local part of the email
     * @param {string} inputDate always should be in mm-dd-yyyy format
    * @returns {string} local part of the email
    */
    async formatDate(inputDate, dateFormat) {
        // the input date string should always be in
        // MM dd yyyy format with valid seperator like -, /, .
        let date = new Date(inputDate);

        return format(date, dateFormat);
    }

    async compareTwoList(actual, expected) {
        if (actual.length != expected.length) {
            await allureReporter.addStep('actual string has ' + actual.length + ' values, However expected string has  ' + expected.length + ' values', " ", 'failed');

        }

        for (let i = 0; i < actual.length; i++) {
            if (expected[i] !== (await actual[i].getText()).trim()) {
                await allureReporter.addStep('actual was ' + (await actual[i].getText()).trim() + ' However expected was ' + expected[i], " ", 'failed');
            }
        }
    }

    async compareTwoList1(actual, expected) {

        let arr = [];

        if (actual.length != expected.length) {
            await allureReporter.addStep('Actual string has ' + actual.length + ' values, However expected string has  ' + expected.length + ' values', " ", 'failed');
        }

        for (let i = 0; i < actual.length; i++) {

            arr.push(await actual[i].getText());

            if (expected[i] !== (await actual[i].getText()).trim()) {
                await allureReporter.addStep('Actual was ' + (await actual[i].getText()).trim() + ' However expected was ' + expected[i], " ", 'failed');
            }
        }

        await allureReporter.addStep("The Actual field values are:" + arr)
    }

    /**
     * @description - Convert date format from mm/dd/yyyy to dd.mm.yyyy
     * @param {*} dateString
     */
    async convertDateFormat(dateString, dateFormat = 'dd.MM.YYYY') {

        return this.formatDate(dateString, dateFormat)
    }

    /**
    * @returns Convert Date format from MM/DD/YYYY to YYYY-MM-DD
    */
    async convertDateFormat1(dateString, dateFormat = 'YYYY-MM-dd') {
        return this.formatDate(dateString, dateFormat);
    }

    /**
   * @returns Convert Date format from DD/MM/YYYY to dd-MM-YYYY
   */
    async convertDateFormat2(dateString, dateFormat = 'dd-MM-YYYY') {
        // Split the input date string into month, day, and year components
        const [day, month, year] = dateString.split('-');

        // Create a new Date object using the extracted components
        return this.formatDate(`${day}/${month}/${year}`, dateFormat);
    }

    //Need to discuss with Azman
    /**
     * @description - dd-MM-yyyy to dd/mm/yyyy
     * @param {*} dateString
     */
    async convertDateFormat3(dateString, dateFormat = 'd/M/yyyy') {

        let parts = dateString.split('-');

        //converting them to mm/dd/yyyy format so that Date class can parse it
        return this.formatDate(`${parts[1]}-${parts[0]}-${parts[2]}`, dateFormat);
    }

    /**
     * @param {*} fileLocation - location of test data file
     * @param {*} testScriptName - Test Script Name for which the data is required
     * @returns JSON array of objects
     * @TestDataFormatinCSVfile - TestScriptName,DataKey:DataValue,DataKey:DataValue,DataKey:DataValue,DataKey:DataValue..
     */
    async getTest_rowData_fromCSVFile_and_convertToJSON(fileLocation, testScriptName, failWhenNoTestDataFound = true) {

        try {
            fileLocation = this.__sanitizeFilePath(fileLocation);
            var fileContents = fs.readFileSync(fileLocation);
            var data = {},
                records = [],
                lines = fileContents.toString().split(/\r\n|\r|\n/)
            var rowNo = undefined;

            for (var l = 0; l <= lines.length - 1; l++) {
                let testName = lines[l].split(',');

                if (testScriptName === testName[0]) {
                    rowNo = l
                }

            }

            if (rowNo !== undefined) {
                console.log('TEST DATA FOUND')
                var rowData = lines[rowNo].split(',')

                for (var l = 0; l <= rowData.length - 1; l++) {
                    if (l == 0) {
                        data[rowData[l]] = rowData[l];
                    }
                    else {
                        data[rowData[l].split('=')[0]] = rowData[l].split('=')[1];
                    }

                }

                records.push(data);

                return JSON.parse(JSON.stringify(records));
            }
            else {
                await assert.fail("************NO MATCHING TEST DATA FOUND IN THE TEST FILE**************")

            }

        } catch (error) {
            console.error('**********' + error.message + '****************')
        }

    }

    /**
   * @description : Add hypen between digits
   * @param {*} number number
   * @param {*} positions An array which cointains the positions
   */
    async addHyphensAtPositions(number, positions) {
        const numberStr = number.toString();
        let formattedNumber = '';
        let currentPosition = 0;

        for (let i = 0; i < positions.length; i++) {
            if (positions[i] > currentPosition && positions[i] <= numberStr.length) {
                formattedNumber += numberStr.slice(currentPosition, positions[i]) + '-';
                currentPosition = positions[i];
            } else {
                return "Invalid position or length.";
            }
        }

        if (currentPosition < numberStr.length) {
            formattedNumber += numberStr.slice(currentPosition);
        }

        return formattedNumber;
    }

    /**
    * @description : Generate random expression
    * @param {*} exp Expression pattern
    */
    async randomExpression(exp) {
        return new RandExp(exp).gen();
    }

    /**
     * This will modify the regex if you are passing using csv if includes commas in it.
     * Here we are modifying regex for making it readable on csv file test data.
     * @arpitpaliwal
     * @param {*} regex
     * @returns
     */
    async modifyRegExWithCommas(regex) {
        regex = regex.replace(/&/g, ',');
        regex = regex.replace(/_/g, '-');

        return this.randomExpression(regex);
    }

    /**
    * @darshankDH
    * @returns Removes all the special characters from the string
    * @param {*} inputString
    */
    async removeSpecialCharacters(inputString) {
        // Define a regular expression to match any character that is not a letter or a number
        const regex = /[^a-zA-Z0-9\s]/g;
        // Use the replace method with the regular expression to remove special characters
        const cleanedString = inputString.replace(regex, '');

        return cleanedString;
    }

    /**
     * @description - Synchronous function to read data from Csv File and Store it as JSON Object
     * @param {*} fileLocation - Absolute Path to the File
     * @param {*} testScriptName - Test Name
     * @returns
     */
    getDataFromCsv(fileLocation, testScriptName) {

        try {
            fileLocation = this.__sanitizeFilePath(fileLocation);
            var fileContents = fs.readFileSync(fileLocation);
            var data = {},
                records = [],
                lines = fileContents.toString().split(/\r\n|\r|\n/)
            var rowNo = undefined;

            for (var l = 0; l <= lines.length - 1; l++) {
                let testName = lines[l].split(',');

                if (testScriptName === testName[0]) {
                    rowNo = l
                }

            }

            if (rowNo !== undefined) {
                console.log('TEST DATA FOUND')
                var rowData = lines[rowNo].split(',')

                for (var l = 0; l <= rowData.length - 1; l++) {
                    if (l == 0) {
                        data[rowData[l]] = rowData[l];
                    }
                    else {
                        data[rowData[l].split('=')[0]] = rowData[l].split('=')[1];
                    }

                }

                records.push(data);

                return JSON.parse(JSON.stringify(records));
            }
            else {
                assert.fail("************NO MATCHING TEST DATA FOUND IN THE TEST FILE**************")

            }

        } catch (error) {
            console.error('**********' + error.message + '****************')
        }

    }

    /**
     * @description - To sanitize user input
     * @param {*} input
     * @returns
     */
    async sanitizeUserInputForXPath(input) {
        // Remove characters that may be used in XPath injection attacks
        // For example, remove single and double quotes
        return input.replace(/["']/g, '');
    }

    /**
     * Configure chai with wdio
     */
    configureChaiAndWebDriver() {
        const chai = require('chai');
        const chaiWebdriver = require('chai-webdriverio').default;

        chai.use(chaiWebdriver(browser));
        global.assert = chai.assert;
        global.should = chai.should;
        global.expect = chai.expect;
    }

    /**
     * Configure wdio browser timeout
     */
    setWdioBrowserTimeout() {
        browser.setTimeout({
            'pageLoad': 10000,
            'implicit': 8000
        }
        );
    }

    /**
     * generate allure report after tests are finished
     */
    generateAllureReport() {
        var exec = require('child_process').exec;
        let child = exec('allure generate | allure open', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);

            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    }

    /**
     * delete allure and junit report before executing the tests
     */
    deleteAllureJunitReports() {
        rimraf('./allure-*', function () { console.log("deleted allure files "); });
        rimraf('./junit', function () { console.log("Junit reports deleted "); });
    }

    /**
     * this method checks if folderName exists in the cwd
     * and add a file inside the folder with the values
     * in a envrioment properties structure
     * @param {string) folderName
     * @param {string) fileName
     * @param {object) values
     */
    writeEnvironmentProperties(folderName, fileName, values) {
        folderName = this.__sanitizeFilePath(folderName);
        fileName = this.__sanitizeFilePath(fileName);

        // Check if the folder exists
        if (fs.existsSync(folderName)) {
            // Create the file path
            const filePath = path.join(folderName, fileName);
            // Convert values to the environment properties format
            const properties = Object.entries(values).map(([key, value]) => `${key}=${value}`).join('\n');

            // Write the properties to the file
            fs.writeFileSync(filePath, properties);

            console.log(`Environment properties file '${fileName}' created successfully.`);
        } else {
            console.log(`Folder '${folderName}' does not exist.`);
        }
    }

    /**
     * return browser specific capabilities to be added in allure report
     * @param {object) capabilities - browser capabilities
     */
    retrunEnvironmentInfosInForAllure(capabilities) {
        //Add Environment variables in Allure report
        const envProperties = {};

        capabilities.forEach((capability, index) => {
            const { browserName, browserVersion } = capability;

            envProperties[`BROWSER${index + 1}`] = browserName;
            envProperties[`BROWSER_VERSION${index + 1}`] = browserVersion;
        });
        envProperties["URL"] = process.env.ENV === 'UAT' ? "https://deliveryhero--uat.sandbox.lightning.force.com" : "https://deliveryhero--qa.sandbox.lightning.force.com"

        return envProperties;
    }

    /**
   * @description - Function to return key by its value
   * @param {*} object - A JSON Object
   * @param {*} value - Value for which key has to be found
   */
    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    /**
     * check if object has its own property. If the property is also object returns true, else false
     * @param {object) o - json data
     * @returns {boolean}
    */
    __hasproperty(o) {
        if (typeof o === 'object') {
            for (let k in o) {
                if (o.hasOwnProperty(k)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * assert if the toTest json object's key has the same value as the main object's key
     * @param {object) main - json object
     * @param {object) toTest - json object
    */

    async assertJSONObjectValues(main, toTest) {
        for (let k in toTest) {
            if (toTest.hasOwnProperty(k)) {
                if (this.__hasproperty(toTest[k])) {
                    console.log('within ' + k);
                    this.assertJSONObjectValues(main[k], toTest[k]);
                    console.log('exit ' + k);
                } else {

                    assert.equal(toTest[k], main[k], `Values didn't match. expect ${main[k]}, received ${toTest[k]} for ${k}`);
                    allureReporter.addStep(`Asserted ${main[k]}, received ${toTest[k]} for ${k}`);
                }
            }
        }
    }

    /**
     * add country code to the phone number
     * @param {string) phoneNumber
    * @param {string) entity
    * @returns {string} phoneNumber with Country_Code
    */
    addCountryCodeToPhoneNumber(phoneNumber, entity) {
        return GlobalCountryEntityMapping[entity].Phone_Code + phoneNumber;
    }

    /**
     * rename the keys of a object
     * @param {object) obj - the object for which keys needs to be renamed
     * @param {object) newKeys - the mapping of the new keys and old keys
     * @returns {object}
     */
    renameKeys(obj, newKeys) {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = newKeys[key] || key;

            return { [newKey]: obj[key] };
        });

        return Object.assign({}, ...keyValues);
    }

    /**
     * check if object has its own property. If the property is also object returns true, else false
     * @param {object) o - json data
     * @returns {boolean}
    */
    __hasproperty(o) {
        if (typeof o === 'object') {
            for (let k in o) {
                if (o.hasOwnProperty(k)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * assert if the toTest json object's key has the same value as the main object's key
     * @param {object) main - json object
     * @param {object) toTest - json object
    */

    assertJSONObjectValues(main, toTest) {
        for (let k in toTest) {
            if (toTest.hasOwnProperty(k)) {
                if (this.__hasproperty(toTest[k])) {
                    console.log('within ' + k);
                    this.assertJSONObjectValues(main[k], toTest[k]);
                    console.log('exit ' + k);
                } else {

                    assert.equal(toTest[k], main[k], `Values didn't match. expect ${main[k]}, received ${toTest[k]} for ${k}`);
                    allureReporter.addStep(`Asserted ${main[k]}, received ${toTest[k]} for ${k}`);
                }
            }
        }
    }

    /**
     * returns the seconds since Epoch for a date
     * @param {Date) date
    * @returns {Number} seconds since epoch
    */
    secondsSinceEpoch(date) {
        return Math.floor(date.getTime() / 1000);
    }

    async generateTimeStampInSeconds(length, date = new Date()) {
        let timestamp = String(this.secondsSinceEpoch(date));

        timestamp = (timestamp.length > length) ? timestamp.substring(0, length) : timestamp.padEnd(length, 0);

        return timestamp;
    }

    /**
     * returns the date object with added minutes
     * @param {Date} date
     * @param{Number} minutes
    * @returns {Date} date
    */
    addMinutesToDateTime(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    /**
    * @oritrobdh
    * returns the date object with removed minutes
    * @param {Date} date
    * @param{Number} minutes
   * @returns {Date} date
   */
    removeMinutesToDateTime(date, minutes) {
        return new Date(date.getTime() - minutes * 60000);
    }

    /**
     * @oritrobdh
     * returns the local part of the email
     * @param {string} email
    * @returns {string} local part of the email
    */
    getLocalPartFromEmail(email) {
        return email.split('@')[0];
    }

    __sanitizeFilePath(filePath) {
        return filePath.replace(/^(\.\.(\/|\\|$))+/, '');
    }

    async retry(callback, errorMessage = "", maxRetryCount = 1) {
        let numberOfTries = 0;
        let returnValue;

        do {
            try {
                returnValue = await callback();
                break;
            }
            catch (error) {
                console.log("INSIDE CATCH BLOCK ERROR: " + error);

                if (numberOfTries !== maxRetryCount) { await browser.refresh() }

                ;
                numberOfTries++;

                if (numberOfTries > maxRetryCount) {
                    allureReporter.addStep(`${errorMessage} 
                Failed with error: ${error} after ${numberOfTries} attempts`);

                    assert.isTrue(false, ` ${errorMessage} 
                Failed with error: ${error} after ${numberOfTries} attempts`);
                }

                allureReporter.addStep(`${callback.name} function thrown error: ${error}, Retrying again...
             retryCount: ${numberOfTries}`)
            }
        } while (numberOfTries <= maxRetryCount)

        return returnValue;
    }

    async getRandomElementsFromArray(array, numberOfElements) {
        let randomArray = [];

        if (numberOfElements >= array.length) {
            allureReporter.addStep("Array Length is less than or equal to the number of elements mentioned. Returning the whole array");

            return array
        }

        while (randomArray.length < numberOfElements) {
            const randomElement = array[Math.floor(Math.random() * array.length)];

            if (!randomArray.includes(randomElement)) {
                randomArray.push(randomElement);
            }
        }

        return randomArray;
    }

    /**
     * @returns generates random regex based data
     * @param {*} dataFormat - data format provided by the user in CSV containing regex
     */
    async generateDataFromRegex(dataFormat) {
        let regex = dataFormat.split('"')[1];
        let data = await this.randomExpression(regex);

        return data;
    }

    /**
     * Description - Function to save screenshot to a folder.
     * @param {} testTile
     */
    async saveScreenshotToAFolder(testTile) {
        console.log("*********************Inside Save Screenshot to Folder")
        const testName = await testTile.replace(/\s+/g, "_");
        const screenshotPath = `./Screenshots/${testName}.png`;

        await browser.saveScreenshot(screenshotPath);
        console.log(`Screenshot captured for failed test: ${screenshotPath}`);

    }

    /**
     * Generate random number divisible by a certain number between two values
     * @param {} testTile
     */
    async getRandomNumberDivisible(min, max, divisor) {

        const start = Math.ceil(min / divisor) * divisor;
        const end = Math.floor(max / divisor) * divisor;
        const count = (end - start) / divisor + 1;
        const randomIndex = Math.floor(Math.random() * count);
        let randomNumber = start + randomIndex * divisor;

        return randomNumber;
    }

    /**
     * utility function to get n random values from a given array
     * @param {} array - Array from which we require random values
     * @param {} numValues - number of random values required
     */
    async getRandomValues(array, numValues) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());

        return shuffled.slice(0, numValues);
    }

}

module.exports = new Utility();