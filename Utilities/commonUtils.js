
class CommonUtils {

    /**
 * To navigate to SSU landing page of given entity, country and environment
 * @param {*} entity - Entity name
 * @param {*} countryCode - Country Code
 * @param {*} environment - Environment
 */
    async NavigateUserToLandingPage(region, countryCode, environment, language = 'en') {
        let url = countryConfig[region][countryCode]["landingPage"][environment.toLowerCase()]
        let newUrl = (region != cs.SSUFields.entity.LATAM && region != cs.SSUFields.entity.EU) ? `${url}/${language}` : url;

        console.log(`URL: ${newUrl}`);
        await browser.newWindow(newUrl);
        allureReporter.addStep(`opening URL ${newUrl}`);
        TestResult.teststeps.push(`opening URL ${newUrl}`);
        await Operations.waitForPageLoad();
        allureReporter.addStep("Navigated to SSU Landing page");
        TestResult.teststeps.push("Navigated to SSU Landing page");
        allureReporter.addStep(
            "Started the Test for the Country: " + region + "-" + countryCode
        );

        return url.toLowerCase();
    }
}

module.exports = CommonUtils;