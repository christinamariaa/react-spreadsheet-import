'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var react$1 = require('@chakra-ui/react');

const Autocomplete = ({ searcher, onSelect, placeholder, pageSize = 20, hasPagination = false, formatOption, value, initialOptions = [], }) => {
    const [inputValue, setInputValue] = react.useState("");
    const [suggestions, setSuggestions] = react.useState([]);
    const [allItems, setAllItems] = react.useState(initialOptions);
    const [isOpen, setIsOpen] = react.useState(false);
    const [isLoading, setIsLoading] = react.useState(false);
    const [isLoadingMore, setIsLoadingMore] = react.useState(false);
    const [offset, setOffset] = react.useState(0);
    const [hasMore, setHasMore] = react.useState(true);
    const [currentQuery, setCurrentQuery] = react.useState("");
    const inputRef = react.useRef(null);
    const listRef = react.useRef(null);
    const selectedItemRef = react.useRef(null);
    const getDisplayText = react.useCallback((item) => (formatOption ? formatOption(item) : item.name), [formatOption]);
    react.useEffect(() => {
        const findItemNameById = async () => {
            if (value && value > 0) {
                const allData = await searcher("");
                setAllItems(allData);
                const found = allData.find((x) => x.id === value);
                if (found) {
                    setInputValue(getDisplayText(found));
                    selectedItemRef.current = found;
                    return;
                }
                try {
                    setIsLoading(true);
                    const result = (await searcher("", undefined, undefined, value));
                    if (result) {
                        setInputValue(getDisplayText(result));
                        selectedItemRef.current = result;
                        setAllItems((prev) => [...prev, result]);
                    }
                    else {
                        setInputValue("");
                    }
                }
                finally {
                    setIsLoading(false);
                }
            }
        };
        findItemNameById();
    }, [value, getDisplayText]);
    const getPaginatedItems = react.useCallback((items, query, currentOffset) => {
        let filtered = items;
        if (query) {
            filtered = items.filter((item) => getDisplayText(item).toLowerCase().includes(query.toLowerCase()));
        }
        return filtered.slice(currentOffset, currentOffset + pageSize);
    }, [pageSize, getDisplayText]);
    const resetPagination = () => {
        setOffset(0);
        setHasMore(true);
    };
    const loadItems = async (query, currentOffset, append = false) => {
        const loadingSetter = currentOffset === 0 ? setIsLoading : setIsLoadingMore;
        loadingSetter(true);
        try {
            let items;
            let total = 0;
            if (hasPagination) {
                items = (await searcher(query, pageSize, currentOffset));
                total = currentOffset + items.length + 1;
            }
            else {
                if (allItems.length === 0 && currentOffset === 0) {
                    const data = (await searcher(""));
                    setAllItems(data);
                    items = getPaginatedItems(data, query, currentOffset);
                    total = data.length;
                }
                else {
                    const filtered = query
                        ? allItems.filter((i) => getDisplayText(i).toLowerCase().includes(query.toLowerCase()))
                        : allItems;
                    items = getPaginatedItems(filtered, query, currentOffset);
                    total = filtered.length;
                }
            }
            setSuggestions((prev) => (append ? [...prev, ...items] : items));
            setHasMore(currentOffset + items.length < total);
            setIsOpen(true);
        }
        catch {
            if (!append)
                setSuggestions([]);
        }
        finally {
            loadingSetter(false);
        }
    };
    const loadInitialItems = react.useCallback(async () => {
        resetPagination();
        setCurrentQuery("");
        await loadItems("", 0, false);
    }, []);
    react.useEffect(() => {
        if (selectedItemRef.current &&
            inputValue === getDisplayText(selectedItemRef.current)) {
            return;
        }
        if (inputValue.trim() !== currentQuery) {
            resetPagination();
            setCurrentQuery(inputValue.trim());
            const timer = setTimeout(() => {
                loadItems(inputValue.trim(), 0);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [inputValue]);
    const loadMore = react.useCallback(async () => {
        if (!isLoadingMore && hasMore && !isLoading) {
            const nextOffset = offset + pageSize;
            setOffset(nextOffset);
            await loadItems(currentQuery, nextOffset, true);
        }
    }, [offset, isLoadingMore, hasMore, isLoading, currentQuery]);
    const handleScroll = react.useCallback(() => {
        if (!listRef.current)
            return;
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        const bottom = scrollHeight - scrollTop - clientHeight < 50;
        if (bottom && hasMore && !isLoadingMore) {
            loadMore();
        }
    }, [hasMore, isLoadingMore, loadMore]);
    const handleSelect = (item) => {
        setInputValue(getDisplayText(item));
        selectedItemRef.current = item;
        onSelect(item.id);
        setIsOpen(false);
    };
    return (jsxRuntime.jsxs(react$1.Box, { position: "relative", w: "100%", children: [jsxRuntime.jsxs(react$1.Box, { position: "relative", children: [jsxRuntime.jsx(react$1.Input, { ref: inputRef, placeholder: placeholder, value: inputValue, onChange: (e) => setInputValue(e.target.value), onFocus: () => {
                            if (inputValue === "" && suggestions.length === 0) {
                                loadInitialItems();
                            }
                            else
                                setIsOpen(true);
                        }, onBlur: () => setTimeout(() => setIsOpen(false), 200), paddingRight: "32px" }), inputValue && (jsxRuntime.jsx(react$1.IconButton, { "aria-label": "clear", 
                        // icon={<CloseIcon boxSize={3} />}
                        onClick: () => {
                            setInputValue("");
                            selectedItemRef.current = null;
                            onSelect(null);
                        }, size: "xs", variant: "ghost", position: "absolute", top: "50%", right: "6px", transform: "translateY(-50%)" }))] }), isOpen && (jsxRuntime.jsxs(react$1.List, { ref: listRef, position: "absolute", top: "100%", left: "0", right: "0", bg: "white", borderWidth: "1px", borderColor: "gray.200", borderTop: "none", borderRadius: "0 0 6px 6px", maxH: "200px", overflowY: "auto", zIndex: 10, boxShadow: "md", onScroll: handleScroll, children: [suggestions.map((item) => (jsxRuntime.jsx(react$1.ListItem, { px: 3, py: 2, borderBottomWidth: "1px", borderColor: "gray.100", cursor: "pointer", _hover: { bg: "gray.50" }, onMouseDown: () => handleSelect(item), children: getDisplayText(item) }, item.id))), isLoadingMore && (jsxRuntime.jsx(react$1.ListItem, { textAlign: "center", py: 2, children: jsxRuntime.jsx(react$1.Spinner, { size: "sm" }) })), !hasMore && suggestions.length > 0 && (jsxRuntime.jsx(react$1.ListItem, { textAlign: "center", py: 2, color: "gray.500", children: "\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u0432\u0441\u0435 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B" })), !isLoading && suggestions.length === 0 && (jsxRuntime.jsx(react$1.ListItem, { textAlign: "center", py: 2, color: "gray.400", children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E" }))] }))] }));
};

exports.Autocomplete = Autocomplete;
