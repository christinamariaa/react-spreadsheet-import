import type { Meta } from "./types";
import type { Data } from "../../types";
type Props<T extends string> = {
    initialData: (Data<T> & Meta)[];
    file: File;
    onBack?: () => void;
};
export declare const ValidationStep: <T extends string>({ initialData, file, onBack }: Props<T>) => import("react/jsx-runtime").JSX.Element;
export {};
