const PedidisyaARSSUStrategy = require("./PyArSSUStrategy");
const TalabatUAESSUStrategy = require('./TbAeSSUStrategy')
const { assert } = require("chai");

class SSUStrategySelector {

    async selectStrategy(testCaseAttributes){
        let strategy;

        switch (testCaseAttributes.entity) {
            case "PY_AR":
                strategy = new PedidisyaARSSUStrategy(testCaseAttributes)
                break;
            case "TB_AE":
                strategy = new TalabatUAESSUStrategy(testCaseAttributes)
                break;
            default:
                break;
        }
    }
}