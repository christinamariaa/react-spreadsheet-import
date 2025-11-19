type ContinueButtonProps = {
    onContinue: (val: any) => void;
    onBack?: () => void;
    title: string;
    backTitle?: string;
    isLoading?: boolean;
};
export declare const ContinueButton: ({ onContinue, onBack, title, backTitle, isLoading }: ContinueButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
