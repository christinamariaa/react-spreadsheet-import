import type { Fields } from "../../../types";
import type { Columns } from "../MatchColumnsStep";
export declare const findUnmatchedRequiredFields: <T extends string>(fields: Fields<T>, columns: Columns<T>) => string[];
