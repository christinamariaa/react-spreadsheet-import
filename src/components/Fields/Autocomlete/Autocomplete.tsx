import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  Spinner,
  IconButton,
  Text,
} from "@chakra-ui/react";
// import { CloseIcon } from "@chakra-ui/icons";

interface AutocompleteProps<T extends { id: number; name: string }> {
  searcher: (
    query: string,
    limit?: number,
    offset?: number,
    id?: number
  ) => Promise<T[]> | Promise<T>;
  onSelect: (id: number | null) => void;
  placeholder?: string;
  pageSize?: number;
  hasPagination?: boolean;
  formatOption?: (item: T) => string;
  value?: number;
  initialOptions?: T[];
}

export const Autocomplete = <T extends { id: number; name: string }>({
  searcher,
  onSelect,
  placeholder,
  pageSize = 20,
  hasPagination = false,
  formatOption,
  value,
  initialOptions = [],
}: AutocompleteProps<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [allItems, setAllItems] = useState<T[]>(initialOptions);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedItemRef = useRef<T | null>(null);

  const getDisplayText = useCallback(
    (item: T) => (formatOption ? formatOption(item) : item.name),
    [formatOption]
  );

  useEffect(() => {
    const findItemNameById = async () => {
      if (value && value > 0) {
        const allData = await searcher("") as T[];
        setAllItems(allData);
        const found = allData.find((x) => x.id === value);

        if (found) {
          setInputValue(getDisplayText(found));
          selectedItemRef.current = found;
          return;
        }

        try {
          setIsLoading(true);
          const result = (await searcher("", undefined, undefined, value)) as T;
          if (result) {
            setInputValue(getDisplayText(result));
            selectedItemRef.current = result;
            setAllItems((prev) => [...prev, result]);
          } else {
            setInputValue("");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
    findItemNameById();
  }, [value, getDisplayText]);

  const getPaginatedItems = useCallback(
    (items: T[], query: string, currentOffset: number): T[] => {
      let filtered = items;
      if (query) {
        filtered = items.filter((item) =>
          getDisplayText(item).toLowerCase().includes(query.toLowerCase())
        );
      }
      return filtered.slice(currentOffset, currentOffset + pageSize);
    },
    [pageSize, getDisplayText]
  );

  const resetPagination = () => {
    setOffset(0);
    setHasMore(true);
  };

  const loadItems = async (
    query: string,
    currentOffset: number,
    append = false
  ) => {
    const loadingSetter = currentOffset === 0 ? setIsLoading : setIsLoadingMore;
    loadingSetter(true);

    try {
      let items: T[];
      let total = 0;

      if (hasPagination) {
        items = (await searcher(query, pageSize, currentOffset)) as T[];
        total = currentOffset + items.length + 1;
      } else {
        if (allItems.length === 0 && currentOffset === 0) {
          const data = (await searcher("")) as T[];
          setAllItems(data);
          items = getPaginatedItems(data, query, currentOffset);
          total = data.length;
        } else {
          const filtered = query
            ? allItems.filter((i) =>
                getDisplayText(i).toLowerCase().includes(query.toLowerCase())
              )
            : allItems;

          items = getPaginatedItems(filtered, query, currentOffset);
          total = filtered.length;
        }
      }

      setSuggestions((prev) => (append ? [...prev, ...items] : items));

      setHasMore(currentOffset + items.length < total);
      setIsOpen(true);
    } catch {
      if (!append) setSuggestions([]);
    } finally {
      loadingSetter(false);
    }
  };

  const loadInitialItems = useCallback(async () => {
    resetPagination();
    setCurrentQuery("");
    await loadItems("", 0, false);
  }, []);

  useEffect(() => {
    if (
      selectedItemRef.current &&
      inputValue === getDisplayText(selectedItemRef.current)
    ) {
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

  const loadMore = useCallback(async () => {
    if (!isLoadingMore && hasMore && !isLoading) {
      const nextOffset = offset + pageSize;
      setOffset(nextOffset);
      await loadItems(currentQuery, nextOffset, true);
    }
  }, [offset, isLoadingMore, hasMore, isLoading, currentQuery]);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const bottom = scrollHeight - scrollTop - clientHeight < 50;

    if (bottom && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, loadMore]);

  const handleSelect = (item: T) => {
    setInputValue(getDisplayText(item));
    selectedItemRef.current = item;
    onSelect(item.id);
    setIsOpen(false);
  };

  return (
    <Box position="relative" w="100%">
      <Box position="relative">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            if (inputValue === "" && suggestions.length === 0) {
              loadInitialItems();
            } else setIsOpen(true);
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          paddingRight="32px"
        />

        {inputValue && (
          <IconButton
            aria-label="clear"
            // icon={<CloseIcon boxSize={3} />}
            onClick={() => {
              setInputValue("");
              selectedItemRef.current = null;
              onSelect(null);
            }}
            size="xs"
            variant="ghost"
            position="absolute"
            top="50%"
            right="6px"
            transform="translateY(-50%)"
          />
        )}
      </Box>

      {isOpen && (
        <List
          ref={listRef}
          position="absolute"
          top="100%"
          left="0"
          right="0"
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          borderTop="none"
          borderRadius="0 0 6px 6px"
          maxH="200px"
          overflowY="auto"
          zIndex={10}
          boxShadow="md"
          onScroll={handleScroll}
        >
          {suggestions.map((item) => (
            <ListItem
              key={item.id}
              px={3}
              py={2}
              borderBottomWidth="1px"
              borderColor="gray.100"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              onMouseDown={() => handleSelect(item)}
            >
              {getDisplayText(item)}
            </ListItem>
          ))}

          {isLoadingMore && (
            <ListItem textAlign="center" py={2}>
              <Spinner size="sm" />
            </ListItem>
          )}

          {!hasMore && suggestions.length > 0 && (
            <ListItem textAlign="center" py={2} color="gray.500">
              Показаны все элементы
            </ListItem>
          )}

          {!isLoading && suggestions.length === 0 && (
            <ListItem textAlign="center" py={2} color="gray.400">
              Ничего не найдено
            </ListItem>
          )}
        </List>
      )}
    </Box>
  );
};
