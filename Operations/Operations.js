const allureReporter = require('@wdio/allure-reporter').default;
const { expect, Assertion, assert } = require('chai');

class Operations {

    async toClick(element) {
        if (element != null) {
            try {
                // await this.waitForElement(element)
                //this.waitUntilElementExists(element)
                await this.scrollIntoView(element)
                await element.click()
            }
            catch (err) {
                console.error('**********' + err.message + '****************')
            }
        }

    }

    async toSetValue(element, value) {
        await element.waitForDisplayed();
        await element.clearValue();
        await element.setValue(value);
    }

    async toAddValue(element, value) {
        await element.waitForDisplayed()
        await element.addValue(value)
    }

    async toGetText(element) {
        await element.waitForDisplayed()
        await element.scrollIntoView();

        return await element.getText()
    }

    async scrollIntoView(element) {
        await browser.pause(1000)
        await element.scrollIntoView();
    }

    async waitForElementDisplayed(element, sec) {
        await element.waitForDisplayed({ timeout: sec });
    }

    async waitForElementEnabled(element, sec) {
        await element.waitForEnabled({ timeout: sec })
    }

    async waitForElement(element) {
        await browser.waitUntil(
            async () => (await element.isDisplayed()) === true,
            {
                timeout: 120000,
                timeoutMsg: element.selector + 'didnt load afer 80 seconds of wait',
                interval: 1000
            }
        )
    }

    async waitUntilElementEnabled(element) {
        await browser.waitUntil(
            async () => (await element.waitForEnabled()) === true,
            {
                timeout: 100000,
                timeoutMsg: "Element " + element.selector + 'is not enabled',
                interval: 1000
            }
        )
    }

    async getBrowserURL() {
        var url = await browser.getUrl();

        return url

    }

    async getAttribute(element, attribute) {
        await this.waitForElement(element)

        //this.waitUntilElementExists(element)
        return element.getAttribute(attribute)
    }

    async waitUntilElementIsClickable(element, displaymsg, time, timeoutinterval) {
        await element.waitForClickable({ timeout: time, timeoutMsg: displaymsg, interval: timeoutinterval })
    }

    async waitForPageLoad() {
        await browser.waitUntil(async function () {
            const state = await browser.execute(function () {
                return document.readyState;
            });

            console.log("state:" + state)

            return state === 'complete';
        },
        {
            timeout: 60000, //60secs
            timeoutMsg: 'Oops! Check your internet connection'
        });
    }

    async waitForExist(element, displaymsg, time, timeoutinterval) {

        await element.waitForExist({
            timeout: time,
            timeoutMsg: displaymsg,
            interval: timeoutinterval

        })
    }

    async assertHrefValue(element, data) {
        try {
            const hrefValue = await this.getAttribute(element, "href");

            assert.equal(hrefValue, data, `Values didn't match for element with href '${hrefValue}'`);
            console.log(`Asserted ${data} in element with href '${hrefValue}'`);
            allureReporter.addStep(`Element ${element.selector} has link: ${hrefValue}`);
            allureReporter.addStep(`Asserted ${data} in element with href '${hrefValue}'`);
        } catch (error) {
            console.error(`Error asserting href value: ${error}`);
            throw error;
        }
    }

    async toGetText(element) {
        await element.waitForDisplayed()
        await element.scrollIntoView();

        return await element.getText();
    }

    async waitForPageLoad() {
        await browser.waitUntil(async function () {
            const state = await browser.execute(function () {
                return document.readyState;
            });

            console.log("state:" + state)

            return state === 'complete';
        },
        {
            timeout: 60000, //60secs
            timeoutMsg: 'Oops! Check your internet connection'
        });
    }

    async waitUntilURLContainsText(text, displaymsg, time, timeoutinterval) {
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes(text),
            {
                timeout: time,
                timeoutMsg: displaymsg,
                interval: timeoutinterval
            }
        )

    }
}

module.exports = new Operations()