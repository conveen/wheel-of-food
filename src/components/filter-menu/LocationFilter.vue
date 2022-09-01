<script setup lang="ts">
import { storeToRefs } from "pinia";
import { reactive } from "vue";

import LocationFilterIcon from "@/components/icons/LocationFilterIcon.vue";
import SearchWithTypeahead from "@/components/typeahead/SearchWithTypeahead.vue";
import { useFilterStore } from "@/stores/filterStore";

interface LocationFilterProps {
    iconId?: string;
    inputId?: string;
    label?: string;
    placeholder?: string;
    typeaheadMenuId?: string;
}

const props = withDefaults(defineProps<LocationFilterProps>(), {
    iconId: "locationFilterIcon",
    inputId: "locationFilterInput",
    label: "Location",
    placeholder: "Location",
    typeaheadMenuId: "locationFilterDatalist",
});

const filterStore = useFilterStore();

function onInputElementEnter(event: Event) {
    const newLocation = (event.target as HTMLInputElement).value;

    if (newLocation === "") {
        filterStore.clearLocation();
        console.debug("Location filter reset");
    } else {
        filterStore.setLocation(newLocation);
        console.debug(`Location filter set to ${filterStore.location}`);
    }
}

const controllerProps = {
    datasets: {
        cities: () => filterStore.locationFilterDatasets.cities,
        countries: () => filterStore.locationFilterDatasets.countries,
        neighborhoods: () => filterStore.locationFilterDatasets.neighborhoods,
        states: () => filterStore.locationFilterDatasets.states,
    },
    identifiers: {
        input: { idName: props.inputId },
        menu: { idName: props.typeaheadMenuId },
    },
    minLength: 1,
    onInputElementEnter: onInputElementEnter,
    placeholder: props.placeholder,
};
const engineProps = {
    caseInsensitive: true,
};
</script>

<template>
    <span :id="iconId" class="filter-icon"><LocationFilterIcon /></span>
    <label :for="inputId">{{ label }}</label>
    <SearchWithTypeahead :controllerProps="controllerProps" :engineProps="engineProps" />
</template>

<style scoped></style>
