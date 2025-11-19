'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('@chakra-ui/react');

const ContinueButton = ({ onContinue, onBack, title, backTitle, isLoading }) => {
    const styles = react.useStyleConfig("Modal");
    const nextButtonMobileWidth = onBack ? "8rem" : "100%";
    return (jsxRuntime.jsxs(react.ModalFooter, { children: [onBack && (jsxRuntime.jsxs(react.Popover, { children: [jsxRuntime.jsx(react.PopoverTrigger, { children: jsxRuntime.jsx(react.Box, { bg: "blue.300", p: 2, children: "Hover me" }) }), jsxRuntime.jsxs(react.PopoverContent, { children: [jsxRuntime.jsx(react.PopoverArrow, {}), jsxRuntime.jsx(react.Button, { size: "md", sx: styles.backButton, onClick: onBack, isLoading: isLoading, variant: "link", children: backTitle })] })] })), jsxRuntime.jsx(react.Button, { size: "lg", w: { base: nextButtonMobileWidth, md: "21rem" }, sx: styles.continueButton, onClick: onContinue, isLoading: isLoading, children: title })] }));
};

exports.ContinueButton = ContinueButton;
