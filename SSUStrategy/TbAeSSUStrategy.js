const { assert } = require("chai");
const CommonSsuStrategy = require('./CommonSSUStrategy')

class TalabatUAESsuStrategy extends CommonSsuStrategy {
    constructor(testCaseAttributes){
        super();
        this.testCaseAttributes = testCaseAttributes
    }
}

module.exports = TalabatUAESsuStrategy;