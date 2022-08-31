<script setup lang="ts">
import SvgWithPaths from "@/components/icons/SvgWithPaths.vue";

const paths = [
    {
        d: "M21 8.25H10m-5.25 0H3",
        attributes: {
            stroke: "currentColor",
            "stroke-width": "1.5",
        },
    },
    {
        d: "M7.5 6v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z",
        attributes: {
            "clip-rule": "evenodd",
            stroke: "currentColor",
            "stroke-width": "1.5",
        },
    },
    {
        d: "M3 15.75h10.75m5 0H21",
        attributes: {
            stroke: "currentColor",
            "stroke-width": "1.5",
        },
    },
    {
        d: "M16.5 13.5v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z",
        attributes: {
            "clip-rule": "evenodd",
            stroke: "currentColor",
            "stroke-width": "1.5",
        },
    },
];
const svgAttributes = {
    fill: "none",
};
</script>

<template>
    <SvgWithPaths :paths="paths" :svg-attributes="svgAttributes" title-name="Price" view-box="0 0 24 24" />
</template>
