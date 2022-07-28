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
                // Should not require a :key for every v-for loop
                "vue/require-v-for-key": "warn",
            },
        },
    ],
};
