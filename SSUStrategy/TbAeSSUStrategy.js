const { assert } = require("chai");
const CommonSSUStrategy = require('./CommonSSUStrategy')

class TalabatUAESSUStrategy extends CommonSSUStrategy {
    constructor(testCaseAttributes){
        super();
        this.testCaseAttributes = testCaseAttributes
    }
}

module.exports = TalabatUAESSUStrategy;