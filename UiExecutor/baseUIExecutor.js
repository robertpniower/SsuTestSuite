const Operations = require("../Operations/Operations");
const allureReporter = require("@wdio/allure-reporter").default;
const { assert } = require("chai");
const { Key } = require('webdriverio')

class BaseUIExecutor {

    async selectDropdownValue(element, value, type) {
        await Operations.toClick(element);
        let dropdownOption = (type === 'visibleText') ? await browser.$(`//*[contains(text(),'${value}')]`) : await browser.$(`//*[@data-value = '${value}']`);

        await Operations.toClick(dropdownOption);
    }

    async selectListElementDropdownValue(element, value, type) {
        await Operations.toClick(element);
        let dropdownOption = (type === 'visibleText') ? await browser.$(`//li[contains(text(),'${value}')]`) : await browser.$(`//li[@data-value = '${value}']`);

        await Operations.toClick(dropdownOption);
    }

    async selectDropdownValueJSClick(element, value, type) {
        await Operations.toClick(element);
        let dropdownOption = (type === 'visibleText') ? await browser.$(`//*[contains(text(),'${value}')]`) : await browser.$(`//*[@data-value = '${value}']`);

        await Operations.toclick_JSExecutor(dropdownOption);
    }

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

    async getMultiSelectDropdownOptions(dropdownElement) {
        await $(".MuiSelect-multiple").waitForExist({ timeout:40000});
        let selectedOptions = await dropdownElement.$('.MuiSelect-multiple').getText()

        return selectedOptions;
    }

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

    async getSelectDropdownOption(dropdownElement) {
        let selectedDropdownValue =  await dropdownElement.$('div').getText();

        if(selectedDropdownValue === '') { await this.getSelectDropdownOption(dropdownElement) } else { return selectedDropdownValue}

        ;
    }

    async getAllDropdownOptions(dropdownElement) {
        await Operations.toClick(dropdownElement);
        await $("#menu- .MuiMenuItem-root").waitForExist({ timeout:80000});
        let dropdownOptions = await browser.$$("#menu- .MuiMenuItem-root");
        let options = [];

        for (let option of dropdownOptions) {
            options.push(await option.getText());
        }

        return options;
    }

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