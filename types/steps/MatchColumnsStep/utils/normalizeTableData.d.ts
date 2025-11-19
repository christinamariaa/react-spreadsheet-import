import type { Columns } from "../MatchColumnsStep";
import type { Data, Fields, RawData } from "../../../types";
export declare const normalizeTableData: <T extends string>(columns: Columns<T>, data: RawData[], fields: Fields<T>) => Data<T>[];
