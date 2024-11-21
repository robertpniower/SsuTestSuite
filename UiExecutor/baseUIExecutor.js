const Operations = require("../Operations/Operations");
const allureReporter = require("@wdio/allure-reporter").default;
const { assert } = require("chai");
const { Key } = require('webdriverio')

class BaseUIExecutor {

    /**
   * @description : Utility to select dropdown values either by visible text or data-value of the option
   * @param {*} element - Dropdown Element
   * @param {*} value - Visible text to be selected or the data-value attribute value
   * @param {*} type - identify option by visible text or data-value
   */
    async selectDropdownValue(element, value, type) {
        await Operations.toClick(element);
        let dropdownOption = (type === 'visibleText') ? await browser.$(`//*[contains(text(),'${value}')]`) : await browser.$(`//*[@data-value = '${value}']`);

        await Operations.toClick(dropdownOption);
    }

    /**
   * @description : Utility to select dropdown values either by visible text or data-value of the option
   * @param {*} element - Dropdown Element
   * @param {*} value - Visible text to be selected or the data-value attribute value
   * @param {*} type - identify option by visible text or data-value
   */
    async selectDropdownValueShadow(element, value, type) {
        await Operations.toClick(element);
        let dropdownOption = (type === 'visibleText') ? await browser.$(`>>>[contains(text(),'${value}')]`) : await browser.$(`>>>[data-value = '${value}']`);

        await Operations.toClick(dropdownOption);
    }

    async selectListElementDropdownValue(element, value, type) {
        await Operations.toClick(element);
        let dropdownOption = (type === 'visibleText') ? await browser.$(`//li[contains(text(),'${value}')]`) : await browser.$(`//li[@data-value = '${value}']`);

        await Operations.toClick(dropdownOption);
    }

    /**
   * @description : Utility to select dropdown values either by visible text or data-value of the option
   * @param {*} element - Dropdown Element
   * @param {*} value - Visible text to be selected or the data-value attribute value
   * @param {*} type - identify option by visible text or data-value
   */
    async selectDropdownValueJSClick(element, value, type) {
        await Operations.toClick(element);
        let dropdownOption = (type === 'visibleText') ? await browser.$(`//*[contains(text(),'${value}')]`) : await browser.$(`//*[@data-value = '${value}']`);

        await Operations.toclick_JSExecutor(dropdownOption);
    }

    /**
   * @description : Utility to select values in multi select dropdown either by visible text or data-value of the option
   * @param {*} element - Dropdown Element
   * @param {*} value - values to be selected by visible text or data-value attribute
   * @param {*} type - identify option by visible text or data-value
   * @param {*} checkSelectedValues - Boolean parameter to check whether an assertion has to be made for selected values.
   */
    async mutliSelectDropdownValue(element, value, type, checkSelectedValues = true) {
        await Operations.toClick(element);
        let options = value.split(";");

        value = value.replaceAll(";", ", ");

        for (let option of options) {
            let dropdownOption = (type === 'visibleText') ? await browser.$(`//li[contains(text(),'${option}')]`) : await browser.$(`li[data-value = '${option}']`);

            await Operations.toClick(dropdownOption);
        }

        await browser.$('#menu-').click({ x: 400 });

        if(checkSelectedValues){
            let options_selected = await this.getMultiSelectDropdownOptions(element);

            assert.strictEqual(options_selected, value, `Multi Select dropdown values does not match for options: ${options}`);

        }
    }

    /**
   * @description : Utility to select all values in multi select dropdown either by visible text or data-value of the option
   * @param {*} element - Dropdown Element
   * @param {*} valuesArray - valuesArray of Options to be selected by visible text or data-value attribute
   * @param {*} type - identify option by visible text or data-value
   */
    async selectAllDrodownOptions(element, valuesArray, type) {
        await Operations.toClick(element);

        for (let value of valuesArray) {
            let dropdownOption = (type === 'visibleText')
                ? await browser.$(`//li[contains(text(),'${value}')]`)
                : await browser.$(`li[data-value='${value}']`);

            //await Operations.toClick(dropdownOption);
            await Operations.scrollIntoView(dropdownOption)
            await dropdownOption.click()
            allureReporter.addStep(`Selected ${value} in category dropdown element`)
        }

        await browser.$('#menu-').click({ x: 400 });
    }

    /**
     * @description : Utility method to get options selected in a multi select dropdown
     * @param {*} dropdownElement - Root of Multi select Dropdown Element
     */
    async getMultiSelectDropdownOptions(dropdownElement) {
        await $(".MuiSelect-multiple").waitForExist({ timeout:40000});
        let selectedOptions = await dropdownElement.$('.MuiSelect-multiple').getText()

        return selectedOptions;
    }

    /**
   * @description : Utility to select random values in multi-select dropdown
   * @param {*} element - Dropdown Element
   * @param {*} type - identify option by visible text or data-value
   */
    async randomMutliSelectDropdownValue(element) {
        await Operations.toClick(element);
        const dropdownOptions = await browser.$$("#menu- .MuiMenuItem-root");
        const optionIndex = await Operations.generateRandomNumber(0,dropdownOptions.length-1)

        allureReporter.addStep(`Selecting  option with index ${optionIndex} in multi select dropdown`)
        let optionsText = await dropdownOptions[optionIndex].getText()

        await dropdownOptions[optionIndex].click();
        await Operations.toClick(await browser.$('#menu-'));

        return optionsText
    }

    /**
   * @description : Utility method to get selected option from a dropdown
   * @param {*} dropdownElement - Root of select Dropdown Element
   */
    async getSelectDropdownOption(dropdownElement) {
        let selectedDropdownValue =  await dropdownElement.$('div').getText();

        if(selectedDropdownValue === '') { await this.getSelectDropdownOption(dropdownElement) } else { return selectedDropdownValue}

        ;
    }

    /**
   * @description : Utility method to return all the options in a dropdown element
   * @param {*} dropdownElement - Root of select Dropdown Element
   */
    async getAllDropdownOptions(dropdownElement) {
        await Operations.toClick(dropdownElement);
        await $("#menu- .MuiMenuItem-root").waitForExist({ timeout:50000});
        let dropdownOptions = await browser.$$("#menu- .MuiMenuItem-root");
        let options = [];

        for (let option of dropdownOptions) {
            options.push(await option.getText());
        }

        return options;
    }

    /**
   * @description : Utility method to select radio button option
   * @param {*} element - Root of Radio Button Element
   * @param {*} value - Value to be selected in radio button
   */
    async selectRadioButtonOption(element, value) {
        await element.scrollIntoView();
        let radioButtonOptions = await element.$$('label >.MuiTypography-root');

        for (let option of radioButtonOptions) {
            if (await option.getText() === value) {
                await option.click();
                break;
            }
        }
    }

    /**
    * @description : Utility method to search and select a search result
    * @param {*} element - Root of Search Button Element
    * @param {*} value - Value to be Searched
    */
    async searchLookUpField(element, value) {
        const searchTerm = value.includes(';') ? value.split(';')[0].trim() : value.trim();
        const searchResultOption = value.includes(';') ? value.split(';')[1].trim() : value.trim();

        await Operations.toClick(element);
        let searchTermSplit = searchTerm.split("");

        console.log("big element",element);

        for (let searchTermCharacter of searchTermSplit) {
            await Operations.toAddValue(element, searchTermCharacter);
            await browser.pause(500);
        }

        await browser.pause(2000);
        let searchResults = await browser.$$("[id*='option-']");

        await Operations.waitForElement(searchResults[0]);

        for (let result of searchResults) {
            if ((await result.getText()).includes(searchResultOption)) {
                await result.click();
                break;
            }
        }
    }

    async clearAndSetValue(element, data){
        await element.click();
        await browser.keys([Key.Ctrl, "a"]);
        await browser.keys([Key.Backspace])
        await element.setValue(data);
    }

}
module.exports = BaseUIExecutor;