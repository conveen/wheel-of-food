<script setup lang="ts">
import MealTypeFilterIcon from "@/components/icons/MealTypeFilterIcon.vue";
import { MealType, useFilterStore } from "@/stores/filterStore";

interface MealTypeFilterProps {
    iconId?: string;
    label?: string;
}

const props = withDefaults(defineProps<MealTypeFilterProps>(), {
    iconId: "mealTypeFilterIcon",
    label: "Meal Type",
});

const filterStore = useFilterStore();

function updateMealTypeFilter(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    const mealType = MealType[eventTarget.value as keyof typeof MealType];
    const enable = eventTarget.checked;

    if (enable) {
        filterStore.addMealType(mealType);
        console.debug(`Added meal type filter ${mealType}`);
    } else {
        filterStore.deleteMealType(mealType);
        console.debug(`Removed meal type filter ${mealType}`);
    }
}
</script>

<template>
    <span :id="iconId" class="filter-icon"><MealTypeFilterIcon /></span>
    <label>{{ label }}</label>
    <div v-for="(variantValue, variantName) in MealType" :key="variantValue" class="form-check form-check-meal-type">
        <input
            class="form-check-input"
            type="checkbox"
            :value="variantValue"
            :id="`${variantValue}MealTypeInput`"
            @change.self="updateMealTypeFilter"
        />
        <label class="form-check-label" :for="`${variantValue}MealTypeInput`">{{ variantName }}</label>
    </div>
</template>

<style scoped>
.form-check-meal-type {
    padding-left: 1.5rem;
}
</style>
