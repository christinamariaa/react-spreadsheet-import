import type { Column } from "react-data-grid";
import type { Fields } from "../../../types";
export declare const generateColumns: <T extends string>(fields: Fields<T>) => Column<any, unknown>[];
