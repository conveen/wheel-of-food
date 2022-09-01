import type {
    TypeaheadDatasets,
    TypeaheadEngine,
    TypeaheadDatasetSearchResults,
    TypeaheadSearchResults,
} from "@/components/typeahead/engine";

type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? RecursivePartial<U>[]
        : T[P] extends object
        ? RecursivePartial<T[P]>
        : T[P];
};

export interface TypeaheadControllerUniqueIdentifierOption {
    idName: string;
    className: string;
}

export type TypeaheadControllerPropsUniqueIdentifierOption = Partial<TypeaheadControllerUniqueIdentifierOption>;

export interface TypeaheadControllerNonUniqueIdentifierOption {
    className: string;
}

export type TypeaheadControllerPropsNonUniqueIdentifierOption = Partial<TypeaheadControllerNonUniqueIdentifierOption>;

export interface TypeaheadControllerIdentifierOptions {
    input: TypeaheadControllerUniqueIdentifierOption;
    menu: TypeaheadControllerUniqueIdentifierOption;
}

export type EventHandler = (event: Event) => void;

export interface TypeaheadControllerOptions<E extends TypeaheadEngine> {
    engine: E;
    identifiers: TypeaheadControllerIdentifierOptions;
    minLength: number;
    onInputElementEnter: EventHandler;
    placeholder: string;
}

export interface TypeaheadControllerState {
    datasets: TypeaheadDatasets;
    open: boolean;
    searchResults: TypeaheadSearchResults | null;
    setCloseTypeaheadOnClickOutsideInput: boolean;
    query: string;
}

export type TypeaheadControllerProps<E extends TypeaheadEngine> = RecursivePartial<
    Omit<TypeaheadControllerOptions<E>, "engine">
> &
    Pick<TypeaheadControllerOptions<E>, "engine"> &
    Pick<TypeaheadControllerState, "datasets">;

/* eslint-disable @typescript-eslint/no-empty-function */
function eventHandlerNoOp(_event: Event): void {}

export class TypeaheadController<E extends TypeaheadEngine> {
    readonly options: TypeaheadControllerOptions<E>;
    state: TypeaheadControllerState;

    constructor(props: TypeaheadControllerProps<E>) {
        this.options = {
            engine: props.engine,
            identifiers: {
                input: {
                    ...{ idName: "typeaheadInputId", className: "typeahead-input" },
                    ...props.identifiers?.input,
                },
                menu: { ...{ idName: "typeaheadMenuId", className: "typeahead-menu" }, ...props.identifiers?.menu },
            },
            minLength: props.minLength || 1,
            onInputElementEnter: props.onInputElementEnter || eventHandlerNoOp,
            placeholder: props.placeholder || "Search",
        };

        this.state = {
            datasets: props.datasets,
            open: false,
            searchResults: null,
            setCloseTypeaheadOnClickOutsideInput: false,
            query: "",
        };
        this.addCloseTypeaheadOnClickOutsideInputListener();
    }

    openMenu(): void {
        this.state.open = true;
    }

    closeMenu(): void {
        this.state.open = false;
    }

    addCloseTypeaheadOnClickOutsideInputListener() {
        if (!this.state.setCloseTypeaheadOnClickOutsideInput) {
            document.addEventListener("click", (event: Event) => {
                const eventTarget: HTMLElement = event.target as HTMLElement;
                if (eventTarget.id !== this.options.identifiers.input.idName) {
                    this.closeMenu();
                }
            });
            this.state.setCloseTypeaheadOnClickOutsideInput = true;
            console.debug("Added event handler to close menu after click outside of typeahead component");
        }
    }

    search(): void {
        this.state.searchResults = Object.fromEntries(
            Object.entries(this.state.datasets).map(([datasetName, datasetInjector]) => {
                return [datasetName, this.options.engine.search(datasetInjector, this.state.query)];
            })
        );
    }

    queryIsEmpty() {
        return this.state.query === "";
    }

    shouldShowMenu() {
        return (
            this.state.open &&
            this.state.searchResults &&
            Object.values(this.state.searchResults).filter(
                (datasetSearchResult) => datasetSearchResult.resultSet.length > 0
            ).length > 0 &&
            this.state.query.length >= this.options.minLength
        );
    }

    shouldShowMenuHeader(datasetSearchResults: TypeaheadDatasetSearchResults) {
        return (
            this.state.searchResults &&
            Object.keys(this.state.searchResults).length > 1 &&
            datasetSearchResults.resultSet.length > 0
        );
    }

    selectInputElement(): HTMLInputElement {
        return document.querySelector(`#${this.options.identifiers.input.idName}`) as HTMLInputElement;
    }

    onInputElementClearButtonClickHandler(_event: Event): void {
        const inputElement = this.selectInputElement();
        inputElement.value = "";

        this.state.query = "";
        this.closeMenu();

        inputElement.focus();
    }

    onInputElementEnterHandler(event: Event): void {
        this.options.onInputElementEnter(event);
        this.closeMenu();
    }

    onInputElementInputHandler(event: Event): void {
        this.state.query = (event.target as HTMLInputElement).value;
        if (this.state.query.length >= this.options.minLength) {
            this.search();
            this.openMenu();
        }
    }

    onMenuItemClickHandler(event: Event): void {
        const selectedItemValue = (event.target as HTMLButtonElement).value;
        const inputElement = this.selectInputElement();

        inputElement.value = selectedItemValue;
        this.closeMenu();
        inputElement.focus();
        inputElement.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }));
    }
}
