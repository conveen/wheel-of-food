<script setup lang="ts">
import PrimaryNavbar from "./components/PrimaryNavbar.vue";
import WheelOfFood from "./components/WheelOfFood.vue";
</script>

<template>
    <div class="app-container">
        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <header>
                        <PrimaryNavbar />
                    </header>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <main>
                        <div class="row">
                            <div class="col">
                                <WheelOfFood />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col"></div>
                        </div>
                    </main>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <footer></footer>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@media (min-width: 992px) {
    .app-container {
        padding-left: 5%;
        padding-right: 5%;
    }
}

@media (max-width: 991.98px) {
    .app-container {
        padding-left: 2%;
        padding-right: 2%;
    }
}
</style>
