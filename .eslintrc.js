/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript/recommended",
        "@vue/eslint-config-prettier",
    ],
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                // With VueJS Composition API, props is assigned in <script setup> but appears to not be used
                "@typescript-eslint/no-unused-vars": "off",
                // Allow unused variables with "_" prefix
                "vue/no-unused-vars": [
                    "error",
                    {
                        ignorePattern: "^_",
                    },
                ],
                // Should not require a :key for every v-for loop
                "vue/require-v-for-key": "warn",
            },
        },
        {
            files: ["*.ts"],
            rules: {
                // Allow underscore parameters (args) to be unused
                "@typescript-eslint/no-unused-vars": [
                    "error",
                    {
                        argsIgnorePattern: "_+[^\\s]*",
                    },
                ],
            },
        },
    ],
};
