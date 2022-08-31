<script setup lang="ts">
import ShowFiltersIcon from "@/components/icons/ShowFiltersIcon.vue";

interface FilterMenuToggleProps {
    filterMenuId: string;
    showFilterMenu: boolean;
}

const props = defineProps<FilterMenuToggleProps>();
</script>

<template>
    <nav id="filterMenuToggleNavbar" class="navbar navbar-light">
        <button
            id="showFilterMenuButton"
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            :data-target="`#${filterMenuId}`"
            :aria-controls="filterMenuId"
            :aria-expanded="showFilterMenu"
            aria-label="Toggle filter menu"
        >
            <span id="showFilterMenuIcon" class="mr-1 filter-icon"><ShowFiltersIcon /></span>
            <span>Filters</span>
        </button>
    </nav>
</template>

<style scoped>
#filterMenuToggleNavbar {
    padding-left: 0px;
}

#showFilterMenuButton {
    border-color: transparent;
    color: #212529;
    font-size: 1rem;
    padding-left: 0px;
}
</style>
