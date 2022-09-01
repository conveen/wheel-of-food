<script setup lang="ts">
import CuisineFilter from "@/components/filter-menu/CuisineFilter.vue";
import LocationFilter from "@/components/filter-menu/LocationFilter.vue";
import MealTypeFilter from "@/components/filter-menu/MealTypeFilter.vue";
import PriceFilter from "@/components/filter-menu/PriceFilter.vue";

interface FilterMenuProps {
    filterMenuId: string;
    showFilterMenu: boolean;
}

const props = defineProps<FilterMenuProps>();

let menuClass = "col-md-12 col-lg-3 mt-2 collapse navbar-collapse";
if (props.showFilterMenu) {
    menuClass = `${menuClass} show`;
}
const filterClass = "col-xs-12 col-sm-6 col-lg-12 pl-0 pr-0";
</script>

<template>
    <div :id="filterMenuId" :class="menuClass">
        <div class="form-group">
            <div :class="filterClass">
                <LocationFilter />
            </div>
        </div>
        <hr />
        <div class="form-group">
            <div :class="filterClass">
                <CuisineFilter />
            </div>
        </div>
        <hr />
        <div class="form-group">
            <div :class="filterClass">
                <MealTypeFilter />
            </div>
        </div>
        <hr />
        <div class="form-group">
            <div :class="filterClass">
                <PriceFilter />
            </div>
        </div>
    </div>
</template>

<style></style>
