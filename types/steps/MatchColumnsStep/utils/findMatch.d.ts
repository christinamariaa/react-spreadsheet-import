import type { Fields } from "../../../types";
export declare const findMatch: <T extends string>(header: string, fields: Fields<T>, autoMapDistance: number) => T | undefined;
