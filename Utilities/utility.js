const allureReporter = require('@wdio/allure-reporter').default;
const { assert } = require('chai');
const rimraf = require("rimraf");
var RandExp = require('randexp');
const fs = require('fs');
const path = require('path');

class Utility {

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

    __sanitizeFilePath(filePath) {
        return filePath.replace(/^(\.\.(\/|\\|$))+/, '');
    }

    /**
    * @description : Generate random expression
    * @param {*} exp Expression pattern
    */
    async randomExpression(exp) {
        return new RandExp(exp).gen();
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

    async generateRandomCharacterString(length) {
        let result = '';

        for (let i = 0; i < length; i++) {
            let charCode = Math.floor(Math.random() * 26) + 65;

            result += String.fromCharCode(charCode);
        }

        return result;
    }

    async generateRandomFixedNumber(length){
        return await Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
    }

    async addRandomSubaddressToEmail(email, regex=/^\+[a-z0-9]{9}$/) {
        //Generate a random alphanumeric character
        const alphanumericChar = new RandExp(regex).gen();
        //Split the email into two parts: the part before "@" and the part after "@"
        const [emailPart1, emailPart2] = email.split('@');
        //Combine the parts with the added alphanumeric character
        const modifiedEmail = `${emailPart1}${alphanumericChar}@${emailPart2}`;

        return modifiedEmail;
    }

    async getRandomValues(array, numValues) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());

        return shuffled.slice(0, numValues);
    }

}

module.exports = new Utility();