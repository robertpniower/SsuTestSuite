const PedidisyaARSsuStrategy = require("./PyArSsuStrategy");
const TalabatUAESsuStrategy = require('./TbAeSsuStrategy')
const { assert } = require("chai");

class SSUStrategySelector {

    async selectStrategy(testCaseAttributes){
        let strategy;

        switch (testCaseAttributes.entity) {
            case "PY_AR":
                strategy = new PedidisyaARSsuStrategy(testCaseAttributes)
                break;
            case "TB_AE":
                strategy = new TalabatUAESsuStrategy(testCaseAttributes)
                break;
            default:
                break;
        }

        return strategy;
    }
}

module.exports = new SSUStrategySelector();