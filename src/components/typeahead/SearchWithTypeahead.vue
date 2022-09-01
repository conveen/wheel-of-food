<script setup lang="ts">
import { reactive } from "vue";

import XCircleIcon from "@/components/icons/XCircleIcon.vue";
import { TypeaheadController } from "@/components/typeahead/controller";
import type { TypeaheadControllerProps } from "@/components/typeahead/controller";
import { SimpleTypeaheadEngine } from "@/components/typeahead/engine";
import type { SimpleTypeaheadEngineProps, TypeaheadEngine } from "@/components/typeahead/engine";

type SearchWithTypeaheadControllerProps<E extends TypeaheadEngine> = Omit<TypeaheadControllerProps<E>, "engine">;

interface SearchWithTypeaheadProps {
    controllerProps: SearchWithTypeaheadControllerProps<SimpleTypeaheadEngine>;
    engineProps: SimpleTypeaheadEngineProps;
}

const props = defineProps<SearchWithTypeaheadProps>();

const typeaheadController = reactive(
    new TypeaheadController<SimpleTypeaheadEngine>({
        engine: new SimpleTypeaheadEngine(props.engineProps),
        ...props.controllerProps,
    })
);
</script>

<template>
    <div class="dropdown">
        <div class="input-group">
            <input
                :id="typeaheadController.options.identifiers.input.idName"
                :class="`form-control ${typeaheadController.options.identifiers.input.className}`"
                :list="typeaheadController.options.identifiers.menu.idName"
                type="text"
                :placeholder="typeaheadController.options.placeholder"
                :aria-epanded="typeaheadController.state.open"
                :aria-controls="typeaheadController.options.identifiers.menu.idName"
                autocomplete="off"
                @input.self="typeaheadController.onInputElementInputHandler"
                @keyup.self.esc="typeaheadController.closeMenu"
                @keyup.self.enter="typeaheadController.onInputElementEnterHandler"
            />
            <span v-if="!typeaheadController.queryIsEmpty()" class="input-group-append">
                <button
                    class="btn typeahead-clear-button"
                    type="button"
                    @click.stop="typeaheadController.onInputElementClearButtonClickHandler"
                >
                    <XCircleIcon />
                </button>
            </span>
        </div>
        <div
            v-if="typeaheadController.shouldShowMenu()"
            :id="typeaheadController.options.identifiers.menu.idName"
            :class="`dropdown-menu show ${typeaheadController.options.identifiers.menu.className}`"
        >
            <template
                v-for="datasetSearchResults in typeaheadController.state.searchResults"
                :key="datasetSearchResults.displayName"
            >
                <h6 v-if="typeaheadController.shouldShowMenuHeader(datasetSearchResults)" class="dropdown-header">
                    {{ datasetSearchResults.displayName }}
                </h6>
                <div class="typeahead-menu-section">
                    <template v-for="searchResult in datasetSearchResults.resultSet" :key="searchResult.term">
                        <button
                            class="dropdown-item"
                            type="button"
                            :name="searchResult.term"
                            :value="searchResult.term"
                            @click.self="typeaheadController.onMenuItemClickHandler"
                        >
                            {{ searchResult.displayName }}
                        </button>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.typeahead-clear-button {
    background-clip: padding-box;
    background-color: #fff;
    border-top: 1px solid #ced4da;
    border-right: 1px solid #ced4da;
    border-bottom: 1px solid #ced4da;
    border-left: 0px;
    border-radius: 0.25rem;
    color: #495057;
}

.typeahead-menu-section {
    max-height: 100px;
    overflow: scroll;
}
</style>
