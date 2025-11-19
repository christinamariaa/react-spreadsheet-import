'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const titleMap = {
    checkbox: "Boolean",
    select: "Options",
    input: "Text",
    autocomplete: "search value"
};
const generateExampleRow = (fields) => [
    fields.reduce((acc, field) => {
        acc[field.key] = field.example || titleMap[field.fieldType.type];
        return acc;
    }, {}),
];

exports.generateExampleRow = generateExampleRow;
