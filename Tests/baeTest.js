const SSUStrategySelector = require('../SSUStrategy/SSUStrategySelector');
const SSUBaseStrategy = require('../SSUStrategy/SSUBaseStrategy');

class BaseTest {
    constructor(testCaseAttributes) {
        return (async () => {
            this.ssuStrategy = new SSUBaseStrategy(await SSUStrategySelector.selectStrategy(testCaseAttributes));
        })
    }
}

module.exports = BaseTest;