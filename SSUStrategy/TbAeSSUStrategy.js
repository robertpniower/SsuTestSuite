const { assert } = require("chai");
const CommonSSUStrategy = require('./CommonSsuStrategy')

class TalabatUAESsuStrategy extends CommonSSUStrategy {
    constructor(testCaseAttributes){
        super();
        this.testCaseAttributes = testCaseAttributes
    }
}

module.exports = TalabatUAESsuStrategy;