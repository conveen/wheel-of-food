export interface TypeaheadDatasetDatum {
    term: string;
    displayName: string;
}

export interface TypeaheadDataset {
    data: TypeaheadDatasetDatum[];
    displayName: string;
}

export interface TypeaheadDatasets {
    [name: string]: () => TypeaheadDataset;
}

export interface TypeaheadDatasetSearchResult extends TypeaheadDatasetDatum {
    context: {
        start: number;
        end: number;
    };
}

export interface TypeaheadDatasetSearchResults {
    resultSet: TypeaheadDatasetSearchResult[];
    displayName: string;
}

export interface TypeaheadSearchResults {
    [datasetName: string]: TypeaheadDatasetSearchResults;
}

export interface TypeaheadEngine {
    search(datasetInjector: () => TypeaheadDataset, query: string): TypeaheadDatasetSearchResults;
}

export enum SortOutcome {
    GreaterThan = 1,
    EqualTo = 0,
    LessThan = -1,
}

type SortFn = (a: string, b: string) => SortOutcome;

export interface SimpleTypeaheadEngineProps {
    caseInsensitive?: boolean;
    sorter?: SortFn;
    useRegex?: boolean;
}

export class SimpleTypeaheadEngine {
    readonly caseInsensitive: boolean;
    readonly sorter: SortFn;
    readonly useRegex: boolean;

    constructor(options: SimpleTypeaheadEngineProps) {
        this.caseInsensitive = options.caseInsensitive || true;
        this.sorter = options.sorter || this.defaultSorter;
        this.useRegex = options.useRegex || false;
    }

    private defaultSorter(datumA: string, datumB: string): SortOutcome {
        return datumA > datumB ? SortOutcome.GreaterThan : datumA < datumB ? SortOutcome.LessThan : SortOutcome.EqualTo;
    }

    private genSearcherFromSubstring(query: string): (term: string) => number {
        return (term) => {
            const transformedTerm = this.caseInsensitive ? term.toLowerCase() : term;
            return transformedTerm.indexOf(query);
        };
    }

    private genSearcherFromRegex(query: string): (term: string) => number {
        const queryRegex = new RegExp(query, this.caseInsensitive ? "i" : "");

        return (term) => {
            return term.search(queryRegex);
        };
    }

    private searchDatumReducer(
        query: string
    ): (resultSet: TypeaheadDatasetSearchResult[], datum: TypeaheadDatasetDatum) => TypeaheadDatasetSearchResult[] {
        const genSearchContextStart = this.useRegex
            ? this.genSearcherFromRegex(query)
            : this.genSearcherFromSubstring(query);

        return (resultSet, datum) => {
            const contextStart = genSearchContextStart(datum.term);

            if (contextStart !== -1) {
                const contextEnd =
                    datum.term.length - contextStart < query.length ? contextStart + query.length : datum.term.length;

                resultSet.push({
                    context: {
                        start: contextStart,
                        end: contextEnd,
                    },
                    ...datum,
                });
            }
            return resultSet;
        };
    }

    search(datasetInjector: () => TypeaheadDataset, query: string): TypeaheadDatasetSearchResults {
        const reducer = this.searchDatumReducer(query);

        return {
            displayName: datasetInjector().displayName,
            resultSet: datasetInjector()
                .data.reduce(reducer, [])
                .sort((a: TypeaheadDatasetSearchResult, b: TypeaheadDatasetSearchResult): SortOutcome => {
                    return this.sorter(a.term, b.term);
                }),
        };
    }
}
