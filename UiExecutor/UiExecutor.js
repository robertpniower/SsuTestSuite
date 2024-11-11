const { assert } = require("chai");
const allureReporter = require("@wdio/allure-reporter").default;
const Operations = require("../Operations/Operations.js");
const Utilities = require("../Utilities/utility.js");
const BaseUIExecutor = require("./baseUIExecutor.js");

class UIExecutor extends BaseUIExecutor {

    /**
     * @dineshwarandh
     * To perform UI Interaction on elements for given testData and action
     * @param {*} elements - Locator Object
     * @param {*} testData - testdata which are passed to the elements
    */
    async performUIInteractions(elements, testData) {
        const keys = Object.keys(testData);

        for (let i = 0; i < keys.length; i++) {
            if (!(String(testData[keys[i]].action).toLowerCase()).includes("nouiaction")) {
                let element = browser.$(elements[keys[i]].locator);
                let actions = String(testData[keys[i]].action).toLowerCase().split(";");
                let data = testData[keys[i]].data;

                for (let action of actions) {
                    switch (action) {
                        case "click":
                            await Operations.toClick(element);
                            allureReporter.addStep(`Clicked ${keys[i]} element`);
                            break;

                        case "setvalue":
                            await element.scrollIntoView();
                            await Operations.toSetValue(element, data);
                            allureReporter.addStep(`Entered ${data} in ${keys[i]} element`);
                            break;

                        case "clearandsetvalue":
                            await element.scrollIntoView();
                            await this.clearAndSetValue(element, data);
                            allureReporter.addStep(`Entered ${data} in ${keys[i]} element`);
                            break;

                        case "addvalue":
                            await element.scrollIntoView({ block: 'center', inline: 'center' });
                            await Operations.toAddValue(element, data);
                            allureReporter.addStep(`Entered ${data} in ${keys[i]} element`);
                            break;

                        case "selectdropdownbytext":
                            await this.selectDropdownValue(element, data, "visibleText");
                            allureReporter.addStep(`Selected ${data} in ${keys[i]} dropdown element`);
                            break;

                        case "multiselectdropdownbytext":
                            await this.mutliSelectDropdownValue(element, data, "visibleText");
                            allureReporter.addStep(`Selected ${data} in ${keys[i]} multi select dropdown element`);
                            break;

                        case "selectradiobutton":
                            await this.selectRadioButtonOption(element, data);
                            allureReporter.addStep(`Selected ${data} in ${keys[i]} radio button element`);
                            break;

                        case "search":
                            await this.searchLookUpField(element, data);
                            allureReporter.addStep(`Searched and selected ${data} in ${keys[i]} lookup field`);
                            break;

                        case "waitforelementtobeenabled":
                            await Operations.waitUntilElementIsClickable(element, "Element is not yet clickable", 180000, 3000);
                            allureReporter.addStep(`Element has been enabled`);
                            break;

                        case "waitforelementtobedispalyed":
                            await Operations.waitForElementDisplayed(element, 180000);
                            allureReporter.addStep(`Element is present`);
                            break;

                        case "assertvalue":
                            const elementValue = await Operations.getAttribute(element, 'value');

                            assert.equal(elementValue.trim(), data, `Values didn't match for element ${elements[keys[i]].locator}`);
                            allureReporter.addStep(`Asserted ${data} in ${keys[i]} element`);
                            break;

                        default:
                            console.log(`Bad Test Data. No Matching UI Actions for ${action}`);
                            assert.fail(`Bad Test Data. No Matching UI Actions for ${action}`);
                    }
                }
            }
        }

        return testData;
    }

}

module.exports = new UIExecutor();
