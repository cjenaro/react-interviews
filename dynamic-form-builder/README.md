# Description

Create a dynamic form builder in React that allows users to add, remove, and reorder form fields.
The form should support various input types and validate user inputs before submission.

## Requirements

- Add Field: Users can add new fields by selecting a field type and specifying a label.
- Remove Field: Users can remove existing fields.
- Reorder Fields: Users can reorder fields via drag-and-drop.
- Field Types: Support for input types like text, number, email, password, checkbox, and select dropdown.
- Validation: Implement basic validation (e.g., required fields, email format).
- Preview Mode: Toggle between edit mode and preview mode to test the form.
- Submission: On form submission, display the form data in JSON format.

## Guidelines

- Use React Hooks for state management.
- Maintain a clean and modular component structure.
- Avoid using form-building libraries; implement the functionality manually.
- Styling is not the focus, but make sure the UI is usable.

## Bonus Points

- Persist Form Configuration: Save the form setup in local storage.
- Custom Validation: Allow users to add custom validation rules to fields.
- Responsive Design: Ensure the form builder is mobile-friendly.
