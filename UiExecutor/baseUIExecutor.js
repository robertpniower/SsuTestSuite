const Operations = require("../Operations/Operations");
const allureReporter = require("@wdio/allure-reporter").default;
const { assert } = require("chai");
const { Key } = require('webdriverio')

class BaseUIExecutor {

    /**
   * @dineshwarandh
   * @description : Utility to select dropdown values either by visible text or data-value of the option
   * @param {*} element - Dropdown Element
   * @param {*} value - Visible text to be selected or the data-value attribute value
   * @param {*} type - identify option by visible text or data-value
   */
    async selectDropdownValue(element, value, type) {
        await Operations.toClick(element);
        let dropdownOption = (type === 'visibleText') ? await browser.$(`//*[contains(text(),'${value}')]`) : await browser.$(`//*[@data-value = '${value}']`);

        await Operations.toClick(dropdownOption);
    //Needs to be modified so that it'll be global across entity as getSelectDropdownOption method contains v2plus specific locators
    //let selectedValue = await this.getSelectDropdownOption(element);
    //assert.equal(selectedValue, await dropdownOption.getText(), `Selected Dropdown value ${selectedValue} does not match with provided value ${value}`);
    }

    /**
   * @darshankdh
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
    //Needs to be modified so that it'll be global across entity as getSelectDropdownOption method contains v2plus specific locators
    //let selectedValue = await this.getSelectDropdownOption(element);
    //assert.equal(selectedValue, await dropdownOption.getText(), `Selected Dropdown value ${selectedValue} does not match with provided value ${value}`);
    }

    /**
   * @darshankdh
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
   * @dineshwarandh
   * @description : Utility to select values in multi select dropdown either by visible text or data-value of the option
   * @param {*} element - Dropdown Element
   * @param {*} value - values to be selected by visible text or data-value attribute
   * @param {*} type - identify option by visible text or data-value
   * @param {*} checkSelectedValues - Boolean parameter to check whether an assertion has to be made for selected values.
   */
    async mutliSelectDropdownValue(element, value, type, checkSelectedValues = true) {
        await Operations.toClick(element);
        // ToDo currently this method is only handling comma seperated Strings should also be implemented for Arrays
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
   * @robertpniowerDh
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
     * @dineshwarandh
     * @description : Utility method to get options selected in a multi select dropdown
     * @param {*} dropdownElement - Root of Multi select Dropdown Element
     */
    async getMultiSelectDropdownOptions(dropdownElement) {
        await $(".MuiSelect-multiple").waitForExist({ timeout:40000});
        let selectedOptions = await dropdownElement.$('.MuiSelect-multiple').getText()

        return selectedOptions;
    }

    /**
   * @dineshwarandh
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
   * @dineshwarandh
   * @description : Utility method to get selected option from a dropdown
   * @param {*} dropdownElement - Root of select Dropdown Element
   */
    async getSelectDropdownOption(dropdownElement) {
        let selectedDropdownValue =  await dropdownElement.$('div').getText();

        if(selectedDropdownValue === '') { await this.getSelectDropdownOption(dropdownElement) } else { return selectedDropdownValue}

        ;
    }

    /**
   * @dineshwarandh
   * @description : Utility method to return all the options in a dropdown element
   * @param {*} dropdownElement - Root of select Dropdown Element
   */
    async getAllDropdownOptions(dropdownElement) {
        await Operations.toClick(dropdownElement);
        await $("#menu- .MuiMenuItem-root").waitForExist({ timeout:40000});
        let dropdownOptions = await browser.$$("#menu- .MuiMenuItem-root");
        let options = [];

        for (let option of dropdownOptions) {
            options.push(await option.getText());
        }

        return options;
    }

    /**
   * @dineshwarandh
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
    * @dineshwarandh
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

        // adding browser.pause() since the application is rendering different element before it renders the actual element,
        // Discussing with dev team on how to handle it
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

    /**
  * @dineshwarandh
  * @description : Utility method to search and select a date in Calendar
  * @param {*} element - Root of Calendar Element
  * @param {*} value - Date to be selected
  * @param {*} separator - Character that separates date, month and year. Defaults to /
  */
    async selectDate(element, value, separator = "/") {
        const date = value.split(separator)[0];
        const month = value.split(separator)[1];
        const year = value.split(separator)[2];

        await element.click();
        await Operations.waitforElementAndClick(await browser.$(`//*[@id='datepicker-popover'] //span[contains(text(),'edit')]`));
        await browser.$(`//*[@id="datepicker-popover"]  //button[contains(text(),'${year}')]`).click();
        let monthName = await browser.$("//*[@id='datepicker-popover']/div[3]/div/div[1]/span").getText();

        monthName = monthName.split(" ")[0];

        while(!monthName.includes("January")){
            await browser.$("//*[@id='datepicker-popover'] //span[contains(text(),'navigate_before')]").click();
            monthName = await browser.$("//*[@id='datepicker-popover']/div[3]/div/div[1]/span").getText();
            monthName = monthName.split(" ")[0];
            await browser.pause(200);
        }

        for (let startMonth = 1; startMonth < Number(month); startMonth++) {
            await browser.$("//*[@id='datepicker-popover'] //span[contains(text(),'navigate_next')]").click();
            await browser.pause(200);
        }

        await Operations.waitforElementAndClick(browser.$(`//*[@id="datepicker-popover"] //div[contains(text(),'${Number(date)}')]`));
    }

    async clearAndSetValue(element, data){
        await element.click();
        await browser.keys([Key.Ctrl, "a"]);
        await browser.keys([Key.Backspace])
        await element.setValue(data);
    }

}
module.exports = BaseUIExecutor;