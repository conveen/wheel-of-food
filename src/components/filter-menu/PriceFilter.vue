<script setup lang="ts">
import PriceFilterIcon from "@/components/icons/PriceFilterIcon.vue";
import { DollarSigns, useFilterStore } from "@/stores/filterStore";

interface PriceFilterProps {
    iconId?: string;
    inputId?: string;
    label?: string;
}

const props = withDefaults(defineProps<PriceFilterProps>(), {
    iconId: "priceFilterIcon",
    inputId: "priceFilterInput",
    label: "Price",
});

const filterStore = useFilterStore();

function updatePriceFilter(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    const price = DollarSigns[eventTarget.value as keyof typeof DollarSigns];
    const enable = eventTarget.checked;

    if (price) {
        if (enable) {
            filterStore.addPrice(price);
            console.debug(`Added price filter ${price}`);
        } else {
            filterStore.deletePrice(price);
            console.debug(`Removed price filter ${price}`);
        }
    } else {
        console.warn(`Invalid key '${eventTarget.value}' for price filter from element with ID ${eventTarget.id}`);
    }
}
</script>

<template>
    <span :id="iconId" class="filter-icon"><PriceFilterIcon /></span>
    <label :for="inputId">{{ label }}</label>
    <div class="input-group">
        <div :id="inputId" class="btn-group btn-group-toggle" style="width: 100%" data-toggle="buttons">
            <template v-for="(variantValue, variantName) in DollarSigns" :key="variantName.toLowerCase()">
                <label class="btn btn-outline-secondary" style="min-width: 25%">
                    <input
                        :id="variantName.toLowerCase()"
                        type="checkbox"
                        name="price"
                        :value="variantName"
                        @click.self="updatePriceFilter"
                    />
                    {{ variantValue }}
                </label>
            </template>
        </div>
    </div>
</template>

<style scoped></style>
