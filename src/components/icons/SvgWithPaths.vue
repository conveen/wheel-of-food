<script setup lang="ts">
interface SvgPath {
    d: string;
    attributes?: Record<string, string | undefined>;
}

interface SvgWithPathsProps {
    paths: SvgPath[];
    svgAttributes?: Record<string, string | undefined>;
    titleName?: string;
    viewBox: string;
    xmlns?: string;
}

const props = withDefaults(defineProps<SvgWithPathsProps>(), {
    xmlns: "http://www.w3.org/2000/svg",
});
</script>

<template>
    <svg :xmlns="xmlns" :viewBox="viewBox" role="img" focusable="false" v-bind="svgAttributes">
        <title v-if="titleName">{{ titleName }}</title>
        <path v-for="path in paths" v-bind="path.attributes" :d="path.d"></path>
    </svg>
</template>
