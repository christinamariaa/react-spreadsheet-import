interface AutocompleteProps<T extends {
    id: number;
    name: string;
}> {
    searcher: (query: string, limit?: number, offset?: number, id?: number) => Promise<T[]> | Promise<T>;
    onSelect: (id: number | null) => void;
    placeholder?: string;
    pageSize?: number;
    hasPagination?: boolean;
    formatOption?: (item: T) => string;
    value?: number;
    initialOptions?: T[];
}
export declare const Autocomplete: <T extends {
    id: number;
    name: string;
}>({ searcher, onSelect, placeholder, pageSize, hasPagination, formatOption, value, initialOptions, }: AutocompleteProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
