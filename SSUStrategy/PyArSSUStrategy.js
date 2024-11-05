const { assert } = require("chai");
const CommonSSUStrategy = require('./CommonSSUStrategy')

class PedidisyaARSSUStrategy extends CommonSSUStrategy {
    constructor(testCaseAttributes){
        super();
        this.testCaseAttributes = testCaseAttributes
    }
}

module.exports = PedidisyaARSSUStrategy