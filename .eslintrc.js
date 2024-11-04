module.exports = {
    "globals": {
        "$$": true,
        "assert": true,
        "datadogApiKey": true
    },
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "webextensions": true,
        "jest": true,
        "jquery": true,
        "mocha": true
    },
    //"extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "ignorePatterns": [ "allure-report/" ],
    "rules": {
        //"semi": [1, "always"],
        //"quotes": [2, "double"],
        //"no-var": 1,
        //"default-case": 2,
        //"no-irregular-whitespace": [2, { "skipRegExps": true }],
        // "padding-line-between-statements": [
        //     2,
        //     { blankLine: "always", prev: "*", next: "return" },
        //     { blankLine: "always", prev: "block-like", next: "*" },
        //     { blankLine: "always", prev: "*", next: "block-like" },
        //     { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        //     { blankLine: "never", prev: ["const", "let", "var"], next: ["const", "let", "var"] }],
        //"keyword-spacing": [2, { "before": true }],
        //"no-trailing-spaces": 2,
        //"indent": [2, 4, { "SwitchCase": 1 }],
        //"no-multiple-empty-lines": [2, { "max": 1, "maxEOF": 0 }],
        //"lines-around-comment": [2, { "beforeBlockComment": true }],
        //"eqeqeq": [2, "smart"],
        // "@typescript-eslint/naming-convention": [
        //     2,
        //     { "selector": "variableLike", "format": ["strictCamelCase"] },
        //     { "selector": "typeLike", "format": ["StrictPascalCase"] }
        // ],
        // "lines-between-class-members": [
        //     "error",
        //     "always",
        //     { "exceptAfterSingleLine": true },
        //]
        //"@typescript-eslint/prefer-as-const": 1,
        //"@typescript-eslint/no-var-requires": 0,
        "no-irregular-whitespace": [
            2,
            {
                "skipStrings": true,
                "skipComments": true,
                "skipRegExps": true,
                "skipTemplates": true
            }
        ],
        "padding-line-between-statements": [
            1,
            { blankLine: "always", prev: "*", next: "return" },
            { blankLine: "always", prev: "block-like", next: "*" },
            { blankLine: "always", prev: "*", next: "block-like" },
            { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
            { blankLine: "never", prev: ["const", "let", "var"], next: ["const", "let", "var"] }
        ],
        "no-trailing-spaces": 2,
        "indent": [1, 4, { "SwitchCase": 1 }],
        "no-multiple-empty-lines": [2, { "max": 1, "maxEOF": 0 }],
        "lines-around-comment": [1, { "beforeBlockComment": true }],
        "lines-between-class-members": [
            "error",
            "always",
            { "exceptAfterSingleLine": true },
        ],
        "default-case": 2,
        //"custom-rules/check-async-await": "warn",
        "no-undef": 1,
        "no-duplicate-imports": 1,
        "no-duplicate-case": 1,
        "no-dupe-else-if": 1,
        "no-debugger": 1,
        "array-callback-return": 1,
        "for-direction": 1,
        "getter-return": 1,
        "no-cond-assign": 1,
        "no-unreachable-loop": 1,
        "no-unused-vars": 0,
        "no-const-assign": 1,
        "no-dupe-keys": 1,
        "no-self-compare": 1
    }
};
