const { assert } = require("chai");
const UIExecutor = require("../UIExecutor/UIExecutor.js")
const Operations = require("../Operations/Operations.js");
const Utilities = require("../Utilities/utility.js");
const SSUCommonUtils = require("../Utilities/commonUtils.js");
let allureReporter = require("@wdio/allure-reporter").default;

class CommonSsuValidator {

    async submitLandingPage(elements, testData) {
        allureReporter.addStep("INSIDE Submit Landing page method");
        await UIExecutor.performUIInteractions(elements, testData);

    }

    async submitBusinessDetailsPage(elements, testData) {
        allureReporter.addStep("INSIDE Submit business details page");
        await Operations.waitForPageLoad();
        await UIExecutor.performUIInteractions(elements, testData);
        await SSUCommonUtils.waitForV3Loader();
        await Operations.waitForPageLoad();
    }

    async submitAddressDetailsPage(elements, testData) {
        allureReporter.addStep("INSIDE Submit address details page");
        await Operations.waitForPageLoad();
        await UIExecutor.performUIInteractions(elements, testData);
        await SSUCommonUtils.waitForV3Loader();
        await Operations.waitForPageLoad();
    }

    async verifyErrorMessages(elements, expectedErrorMessages, country, checkDisplayed) {
        allureReporter.addStep(`Checking if error messsages are displayed`);
        const displayedErrorMessages = [];

        try {
            const errorFields = await SSUCommonUtils.getErrorFields(elements, country);
            let errorMessagesFound = false;

            for (const fieldName of errorFields) {
                const element = elements[fieldName];
                const errorMessage = $(`${element.locator}`);

                if (await errorMessage.isDisplayed()) {
                    const actualErrorMessage = (await errorMessage.getText()).trim();

                    if (actualErrorMessage !== '') {
                        displayedErrorMessages.push(actualErrorMessage);
                        errorMessagesFound = true;

                        if (checkDisplayed) {
                            console.log(`Displayed error message: ${actualErrorMessage} in Field: ${fieldName}`);
                            allureReporter.addStep(`Displayed error message: ${actualErrorMessage} in Field: ${fieldName}`);

                            if (expectedErrorMessages[fieldName]) {
                                expect(actualErrorMessage).to.equal(expectedErrorMessages[fieldName]);
                            }
                        }
                    }
                }
            }

            return (errorMessagesFound && checkDisplayed) || (!errorMessagesFound && !checkDisplayed);

            if (checkDisplayed && displayedErrorMessages.length > 0) {
                console.log('Error messages are displayed.');
                allureReporter.addStep(`Error messages are displayed.`);
            } else if (!checkDisplayed && displayedErrorMessages.length === 0) {
                console.log('Error messages are not displayed.');
                allureReporter.addStep(`Error messages are not displayed.`);
            }
        } catch (error) {
            console.error('Error occurred during error message verification:', error);
            allureReporter.addStep('Error occurred during error message verification:', error)
            throw error;
        }
    }

    async verifyFooterLinks(testCaseAttributes, elements, links) {
        allureReporter.addStep("INSIDE Verify Footer Links");

        if (testCaseAttributes.region === "LATAM") {
            links[testCaseAttributes.country + "_link"] = "#"
        }

        await Operations.waitForPageLoad();

        let linkSection = elements['link_section'];
        let footerElement = await browser.$(linkSection.locator);

        await footerElement.scrollIntoView({ block: 'center', inline: 'center' });

        for (let fieldName in elements) {

            if (fieldName.toLowerCase() === 'link_section') {
                continue;
            }

            let elementInfo = elements[fieldName];
            let linkElement = links[fieldName];

            if (linkElement) {
                allureReporter.addStep(`Testing link: ${linkElement}`)

                let element = await browser.$(elementInfo.locator)

                if (element) {
                    await Operations.assertHrefValue(element, linkElement);

                } else {

                    assert.fail(`Element not found for locator: ${elementInfo.locator}`);
                }
            } else {
                assert.fail(`Link not found for field: ${fieldName}`);
            }
        }
    }

    async verifyFaqSectionText(elements, faqData, country) {
        allureReporter.addStep("INSIDE Verify FAQ Section");

        await Operations.waitForPageLoad();
        let faqSection = elements['faq_section'];
        let faqSectionElement = await browser.$(faqSection.locator);

        if (country !== "MY") {
            let faqLink = elements['faq_link'];
            let faqLinkElement = await browser.$(faqLink.locator);

            await faqLinkElement.waitForExist();
            await faqLinkElement.waitForDisplayed();
            await Operations.toClick(faqLinkElement);
        } else {
            await Operations.scrollIntoView(faqSectionElement);
        }

        let keys = Object.keys(faqData);

        for (let i = 0; i < keys.length; i++) {
            let question = keys[i];
            let answer = faqData[question];
            let questionLocator = `${faqSection.locator}[${i + 1}]/div/div/p`;
            let questionElement = await browser.$(questionLocator);

            await questionElement.waitForExist();
            await questionElement.waitForDisplayed();
            await SSUCommonUtils.assertText(questionElement, question);

            let faqExpandButton = `${faqSection.locator}[${i + 1}]/div`;
            let faqExpandButtonElement = await browser.$(faqExpandButton);

            await faqExpandButtonElement.waitForExist();
            await faqExpandButtonElement.waitForDisplayed();
            await Operations.toClick(faqExpandButtonElement);
            await browser.pause(500);

            let answerLocator = `${faqSection.locator}[${i + 1}]/div[2]/div/div/div/div`;
            let answerElement = await browser.$(answerLocator);

            await answerElement.waitForExist();
            await answerElement.waitForDisplayed();
            await SSUCommonUtils.assertText(answerElement, answer);

        }
    }

    async validateVerticalSegment(language, dropVerticalSegments, verticalValues) {
        allureReporter.addStep("INSIDE Validate Vertical Segment Test");
        await Operations.waitForPageLoad();
        let translatedValues = dropVerticalSegments.map(obj => obj.verticalSegmentTranslated[language]);
        let translatedValuesSorted = translatedValues.sort();
        let verticalValuesSorted = verticalValues.sort();

        console.log(`verticalValues: ${verticalValuesSorted}`);
        console.log(`verticalSegments: ${translatedValuesSorted}`);

        allureReporter.addStep(`verticalValues: ${verticalValuesSorted}`);
        allureReporter.addStep(`verticalSegments: ${translatedValuesSorted}`);
        allureReporter.addStep(`Asserting that verticalValues are equal to verticalSegments`);
        expect(translatedValuesSorted).to.deep.equal(verticalValuesSorted);

        return verticalValuesSorted;

    }
}

module.exports = CommonSsuValidator;