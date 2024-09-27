Requirements:
Search Input:

Create an input field that allows users to type in a search term. The list of results should filter in real-time as the user types.
Ensure the search operation is debounced to avoid excessive re-renders and improve performance.

List Display:

Display the filtered results in a list below the search input.
The list of items should support virtual scrolling to efficiently handle a large dataset without rendering all items at once.
Item Details:

Each item in the list should have a button that, when clicked, opens a modal displaying detailed information about the selected item.
The modal should be implemented using React Portals for better control over the DOM hierarchy.
Performance Considerations:

Implement performance optimizations using React.memo or useMemo, useCallback hooks to avoid unnecessary re-renders of the list and search input.
Ensure your code handles large datasets efficiently, avoiding performance bottlenecks.
State Management:

Use React Context API to manage the state of the search input and the filtered results. Ensure that the state is properly scoped and doesn’t cause unnecessary re-renders of unrelated components.
Unit Tests:

Write unit tests for the search component using a testing framework like Jest and React Testing Library.
Cover edge cases, such as an empty search result, very large lists, and interactions with the modal.
Accessibility:

Ensure that the search input and modal are accessible. Implement proper keyboard navigation and screen reader support for the entire UI.
Optional:

Implement pagination in case the list grows too large, or a lazy-load approach that only fetches more results as the user scrolls down.
Add an optional sorting feature that allows the user to sort the search results alphabetically or by relevance.
