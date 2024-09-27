import {
  ChangeEvent,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import { createPortal } from "react-dom";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";

type ListItem = {
  id: number;
  description: string;
};
const ITEMS: Array<ListItem> = [];
const NAMES = ["John", "Sam", "Matt"];

for (let i = 0; i < 10000; i++) {
  ITEMS.push({
    id: i,
    description: NAMES[Math.floor(Math.random() * NAMES.length)],
  });
}

const SearchContext = createContext(["", () => {}, ""] as [
  string,
  Dispatch<SetStateAction<string>>,
  string,
]);

function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [debouncedState, setDebouncedState] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setDebouncedState(search);
    }, 1000);
  }, [search]);

  return (
    <SearchContext.Provider
      value={[search, setSearch, debouncedState] as const}
    >
      {children}
    </SearchContext.Provider>
  );
}

function useSearchContext() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useSearchContext hook must be used inside a SearchContext.Provider",
    );
  }

  return context;
}

function App() {
  const [search, setSearch] = useSearchContext();

  function handleSearchInput(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.currentTarget.value);
  }

  return (
    <>
      <label htmlFor="search">Search:</label>
      <input type="search" value={search} onChange={handleSearchInput} />

      <ItemList />
    </>
  );
}

function ListItemComponent({
  item,
  virtualItem,
}: {
  item: ListItem;
  virtualItem: VirtualItem;
}) {
  const [showModal, setShowModal] = useState(false);
  function toggleModal() {
    setShowModal((o) => !o);
  }

  return (
    <>
      <li
        key={item.id}
        style={{
          height: `${virtualItem.size}px`,
          transform: `translateY(${virtualItem.start}px)`,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}
      >
        {item.description}
        <button onClick={toggleModal}>Open</button>
      </li>
      {showModal &&
        createPortal(
          <div id="modal">
            <h1>
              {item.id} - {item.description}
            </h1>
            <button onClick={toggleModal}>Close</button>
          </div>,
          document.body,
        )}
    </>
  );
}

function ItemList() {
  const scrollElement = useRef(null);
  const [, , search] = useSearchContext();

  const filteredItems = ITEMS.filter((item) =>
    item.description.toLowerCase().includes(search.toLowerCase()),
  );

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => scrollElement.current,
    count: filteredItems.length,
    estimateSize: () => 40,
  });

  return (
    <div ref={scrollElement} style={{ height: 400, overflow: "auto" }}>
      <ul
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <ListItemComponent
            key={virtualItem.key}
            item={filteredItems[virtualItem.index]}
            virtualItem={virtualItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default function WithProviders() {
  return (
    <SearchProvider>
      <App />
    </SearchProvider>
  );
}
