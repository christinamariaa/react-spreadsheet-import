import type XLSX from "xlsx-ugnis";
import type { RawData } from "../types";
export declare enum StepType {
    upload = "upload",
    selectSheet = "selectSheet",
    selectHeader = "selectHeader",
    matchColumns = "matchColumns",
    validateData = "validateData"
}
export type StepState = {
    type: StepType.upload;
} | {
    type: StepType.selectSheet;
    workbook: XLSX.WorkBook;
} | {
    type: StepType.selectHeader;
    data: RawData[];
} | {
    type: StepType.matchColumns;
    data: RawData[];
    headerValues: RawData;
} | {
    type: StepType.validateData;
    data: any[];
};
interface Props {
    state: StepState;
    onNext: (v: StepState) => void;
    onBack?: () => void;
}
export declare const UploadFlow: ({ state, onNext, onBack }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
