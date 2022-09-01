import { defineStore } from "pinia";

import type { TypeaheadDataset } from "../components/typeahead/engine";

export enum DollarSigns {
    One = "$",
    Two = "$$",
    Three = "$$$",
    Four = "$$$$",
}

export enum MealType {
    Breakfast = "breakfast",
    Lunch = "lunch",
    Dinner = "dinner",
    Dessert = "dessert",
    Drinks = "drinks",
}

export enum ReservationSite {
    OpenTable = "OpenTable",
    Resy = "Resy",
    Tock = "Tock",
}

export interface Restaurant {
    name: string;
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    cuisine: string;
    price: DollarSigns;
    mealTypes: MealType[];
    reservationSite: ReservationSite;
    reservationLink: string;
    labels: string[];
}

class LocationFilterDatasets {
    public cities: TypeaheadDataset;
    private citiesCache: Set<string>;
    public countries: TypeaheadDataset;
    private countriesCache: Set<string>;
    public neighborhoods: TypeaheadDataset;
    private neighborhoodsCache: Set<string>;
    public states: TypeaheadDataset;
    private statesCache: Set<string>;

    private static genEmptyDatasetWithDisplayName(displayName: string): TypeaheadDataset {
        return {
            data: [],
            displayName: displayName,
        };
    }

    constructor() {
        this.cities = LocationFilterDatasets.genEmptyDatasetWithDisplayName("City");
        this.citiesCache = new Set();

        this.countries = LocationFilterDatasets.genEmptyDatasetWithDisplayName("Country");
        this.countriesCache = new Set();

        this.neighborhoods = LocationFilterDatasets.genEmptyDatasetWithDisplayName("Neighborhood");
        this.neighborhoodsCache = new Set();

        this.states = LocationFilterDatasets.genEmptyDatasetWithDisplayName("State");
        this.statesCache = new Set();
    }

    addCity(restaurant: Restaurant): void {
        if (!this.citiesCache.has(restaurant.city)) {
            this.citiesCache.add(restaurant.city);
            this.cities.data.push({
                term: restaurant.city,
                displayName: `${restaurant.city} (${restaurant.state}, ${restaurant.country})`,
            });
        }
    }

    addCountry(restaurant: Restaurant): void {
        if (!this.countriesCache.has(restaurant.country)) {
            this.countriesCache.add(restaurant.country);
            this.countries.data.push({
                term: restaurant.country,
                displayName: restaurant.country,
            });
        }
    }

    addNeighborhood(restaurant: Restaurant): void {
        if (!this.neighborhoodsCache.has(restaurant.neighborhood)) {
            this.neighborhoodsCache.add(restaurant.neighborhood);
            this.neighborhoods.data.push({
                term: restaurant.neighborhood,
                displayName: `${restaurant.neighborhood} (${restaurant.city}, ${restaurant.state}, ${restaurant.country})`,
            });
        }
    }

    addState(restaurant: Restaurant): void {
        if (!this.statesCache.has(restaurant.state)) {
            this.statesCache.add(restaurant.state);
            this.states.data.push({
                term: restaurant.state,
                displayName: `${restaurant.state} (${restaurant.country})`,
            });
        }
    }

    addRestaurant(restaurant: Restaurant): void {
        this.addCity(restaurant);
        this.addCountry(restaurant);
        this.addNeighborhood(restaurant);
        this.addState(restaurant);
    }
}

export interface CuisineFilterOptions {
    [cuisine: string]: number;
}

export interface FilterState {
    cuisine: string | null;
    cuisineFilterOptions: CuisineFilterOptions;
    filteredRestaurants: Restaurant[] | null;
    location: string | null;
    locationFilterDatasets: LocationFilterDatasets;
    mealTypes: Set<MealType>;
    prices: Set<DollarSigns>;
    restaurants: Restaurant[] | null;
}

function genAdder(x: number): (y: number) => number {
    return (y) => {
        return x + y;
    };
}

function setOrUpdateProperty<V>(
    object: Record<string, V>,
    property: string,
    newValue: V,
    updateFn: (currentValue: V) => V
): void {
    if (!Object.prototype.hasOwnProperty.call(object, property)) {
        object[property] = newValue;
    } else {
        object[property] = updateFn(object[property]);
    }
}

export const useFilterStore = defineStore("filter", {
    state: (): FilterState => ({
        cuisine: null,
        cuisineFilterOptions: {},
        filteredRestaurants: null,
        location: null,
        locationFilterDatasets: new LocationFilterDatasets(),
        mealTypes: new Set(),
        prices: new Set(),
        restaurants: null,
    }),

    actions: {
        matchesCurrentFilters(restaurant: Restaurant): boolean {
            return (
                (this.cuisine === null || restaurant.cuisine === this.cuisine) &&
                (this.location === null ||
                    restaurant.country === this.location ||
                    restaurant.state === this.location ||
                    restaurant.city === this.location ||
                    restaurant.neighborhood === this.location) &&
                (this.mealTypes.size === 0 ||
                    restaurant.mealTypes.filter((mealType: MealType) => {
                        return this.mealTypes.has(mealType);
                    }).length > 0) &&
                (this.prices.size === 0 || this.prices.has(restaurant.price))
            );
        },
        // apply filters to set filtered restaurant list
        applyFilters(): void {
            if (this.restaurants) {
                console.debug("Applying filters to restaurant list");
                this.clearFilterOptions();
                const addOne = genAdder(1);

                this.filteredRestaurants = this.restaurants.filter((restaurant: Restaurant) => {
                    if (this.matchesCurrentFilters(restaurant)) {
                        setOrUpdateProperty<number>(this.cuisineFilterOptions, restaurant.cuisine, 1, addOne);

                        this.locationFilterDatasets.addRestaurant(restaurant);

                        return true;
                    }

                    return false;
                });
                console.debug(`${this.filteredRestaurants.length} restaurants meet the filter criteria`);
            }
        },

        // reset state
        clearCuisine(): void {
            if (this.cuisine !== null) {
                this.cuisine = null;
                this.applyFilters();
            }
        },
        clearLocation(): void {
            if (this.location !== null) {
                this.location = null;
                this.applyFilters();
            }
        },
        clearMealType(): void {
            if (this.mealTypes.size !== 0) {
                this.mealTypes.clear();
                this.applyFilters();
            }
        },
        clearPrice(): void {
            if (this.prices.size === 0) {
                this.prices.clear();
                this.applyFilters();
            }
        },
        clearFilterOptions(): void {
            // Reset cuisine and location filter data
            this.cuisineFilterOptions = {};
            this.locationFilterDatasets = new LocationFilterDatasets();
        },

        // setters
        setCuisine(cuisine: string): void {
            if (cuisine !== this.cuisine) {
                this.cuisine = cuisine;
                this.applyFilters();
            }
        },
        setLocation(location: string): void {
            if (location !== this.location) {
                this.location = location;
                this.applyFilters();
            }
        },
        addMealType(mealType: MealType): void {
            if (!this.mealTypes.has(mealType)) {
                this.mealTypes.add(mealType);
                this.applyFilters();
            }
        },
        deleteMealType(mealType: MealType): void {
            if (this.mealTypes.has(mealType)) {
                this.mealTypes.delete(mealType);
                this.applyFilters();
            }
        },
        addPrice(price: DollarSigns): void {
            if (!this.prices.has(price)) {
                this.prices.add(price);
                this.applyFilters();
            }
        },
        deletePrice(price: DollarSigns): void {
            if (this.prices.has(price)) {
                this.prices.delete(price);
                this.applyFilters();
            }
        },
        initializeRestaurants(restaurants: Restaurant[]): void {
            this.restaurants = restaurants;
            this.applyFilters();
        },
    },
});
