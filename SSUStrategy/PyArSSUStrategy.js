const { assert } = require("chai");
const CommonSsuStrategy = require('./CommonSSUStrategy')

class PedidisYaARSSUStrategy extends CommonSsuStrategy {
    constructor(testCaseAttributes){
        super();
        this.testCaseAttributes = testCaseAttributes
    }
}

module.exports = PedidisYaARSSUStrategy