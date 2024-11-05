
class Operations {

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

}

module.exports = Operations;