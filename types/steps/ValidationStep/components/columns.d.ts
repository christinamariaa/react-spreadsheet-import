import { Column } from "react-data-grid";
import type { Data, Fields } from "../../../types";
import type { Meta } from "../types";
export declare const generateColumns: <T extends string>(fields: Fields<T>) => Column<Data<T> & Meta, unknown>[];
