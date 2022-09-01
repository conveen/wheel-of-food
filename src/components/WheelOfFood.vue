<script setup lang="ts">
import axios from "axios";
import { onMounted } from "vue";

import FilterMenu from "@/components/filter-menu/FilterMenu.vue";
import FilterMenuToggle from "@/components/filter-menu/FilterMenuToggle.vue";
import { useFilterStore } from "@/stores/filterStore";

function isLargeDevice(): boolean {
    if (window.matchMedia("(min-width: 992px)").matches) {
        return true;
    }

    return false;
}

const filterMenuId = "filterMenu";

const filterStore = useFilterStore();

onMounted(() => {
    console.debug("Loading restaurants");
    axios
        .get("/data/restaurants/latest/restaurants.json")
        .then((response) => {
            filterStore.initializeRestaurants(response.data);
            console.debug(`${filterStore.restaurants?.length || 0} restaurants loaded`);
        })
        .catch((err) => {
            console.error("Failed to load restaurants: ", err);
        });
});
</script>

<template>
    <div class="row">
        <div class="col">
            <FilterMenuToggle :filter-menu-id="filterMenuId" :show-filter-menu="isLargeDevice()" />
        </div>
    </div>
    <div class="row">
        <FilterMenu :filter-menu-id="filterMenuId" :show-filter-menu="isLargeDevice()" />
    </div>

    <div class="row">
        <div class="col"></div>
    </div>
</template>

<style>
.filter-icon {
    display: inline-block;
    margin-right: 3px;
    width: 1.5rem;
}
</style>
