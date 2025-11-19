import type { Data, Fields, RowHook, TableHook } from "../../../types";
import type { Meta } from "../types";
export declare const addErrorsAndRunHooks: <T extends string>(data: (Data<T> & Partial<Meta>)[], fields: Fields<T>, rowHook?: RowHook<T> | undefined, tableHook?: TableHook<T> | undefined, changedRowIndexes?: number[]) => Promise<(Data<T> & Meta)[]>;
