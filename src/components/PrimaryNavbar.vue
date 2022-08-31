<script setup lang="ts">
import GitHubIcon from "@/components/icons/GitHubIcon.vue";
</script>

<template>
    <nav class="navbar navbar-dark bg-dark primary-navbar d-print">
        <a class="navbar-brand" href="#">Wheel of Food</a>

        <ul class="navbar-nav ml-md-auto">
            <li class="nav-item">
                <a
                    class="nav-link pl-2 pr-1 mx-1 py-3 my-n2"
                    href="https://github.com/conveen/wheel-of-food"
                    target="_blank"
                    rel="noopener"
                    aria-label="GitHub"
                >
                    <GitHubIcon class="navbar-nav-svg" titleName="GitHub" />
                </a>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
.primary-navbar .navbar-nav-svg {
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    vertical-align: text-top;
}
</style>
