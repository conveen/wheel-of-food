<script setup lang="ts">
import CuisineFilterIcon from "@/components/icons/CuisineFilterIcon.vue";
import { useFilterStore } from "@/stores/filterStore";

interface CuisineFilterProps {
    iconId?: string;
    inputId?: string;
    label?: string;
}

const props = withDefaults(defineProps<CuisineFilterProps>(), {
    iconId: "cuisineFilterIcon",
    inputId: "cuisineFilterInput",
    label: "Cuisine",
});
const EMPTY_OPTION = "Choose...";

const filterStore = useFilterStore();

function updateCuisineFilter(event: Event): void {
    const selectedCuisine = (event.target as HTMLSelectElement).value;

    if (selectedCuisine === EMPTY_OPTION) {
        filterStore.clearCuisine();
        console.debug("Cuisine filter reset");
    } else {
        filterStore.setCuisine(selectedCuisine);
        console.debug(`Cuisine filter set to ${filterStore.cuisine}`);
    }
}
</script>

<template>
    <span :id="iconId" class="filter-icon"><CuisineFilterIcon /></span>
    <label :for="inputId">{{ label }}</label>
    <select class="form-control" :id="inputId" @change.self="updateCuisineFilter">
        <option selected>{{ EMPTY_OPTION }}</option>
        <option
            v-for="[cuisine, _] in Object.entries(filterStore.cuisineFilterOptions).sort()"
            :key="cuisine"
            :value="cuisine"
        >
            {{ cuisine }}
        </option>
    </select>
</template>

<style scoped></style>
