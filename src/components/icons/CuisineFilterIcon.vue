<script setup lang="ts">
import SvgWithPaths from "@/components/icons/SvgWithPaths.vue";

const paths = [
    {
        d: "M17 14c2.26 0 4-1.894 4-4.23 0-2.337-1.832-4.232-4.09-4.232-.428 0-.84.068-1.228.194M7.09 7.848C7.09 5.171 9.106 3 11.59 3s4.5 2.17 4.5 4.848c0 1.436-.58 2.726-1.5 3.613m-7.5-5.923C4.83 5.538 3 7.433 3 9.77 3 12.106 4.832 14 7.09 14c.922 0 1.772-.315 2.456-.846M7 14v7h10v-7M11 17h6",
        attributes: {
            "fill-color": "#343a40",
            "fill-rule": "evenodd",
            stroke: "currentColor",
            "stroke-linecap": "round",
            "stroke-width": "2",
            "stroke-linejoin": "round",
        },
    },
];

const svgAttributes = {
    fill: "none",
};
</script>

<template>
    <SvgWithPaths :paths="paths" :svg-attributes="svgAttributes" title-name="Cuisine" view-box="0 0 24 24" />
</template>
