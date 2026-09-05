# Input Value Reader

A Chrome extension for inspecting the current page's form fields without sending data anywhere. It reads the active tab, finds every input, textarea, and select element, and shows a selector/value table in the popup.

Maintained by [Subrahmanyam Poluru](https://polurus.com) · Poluru Labs.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Screenshot

<img width="1406" height="923" alt="Input Value Reader popup" src="https://github.com/user-attachments/assets/4ca743e3-9c76-4219-b9f9-29001c266343" />

## What it does

This extension loads the active tab and inspects the DOM for form fields, then displays:

- the field selector
- the current value
- a hidden placeholder for password fields
- page URL information in the popup header

It is designed for local debugging and form inspection only.

## Features

- Load the active page and scan its form controls
- Show a table with Selector and Value columns
- Support text, email, number, textarea, select, checkbox, and radio fields
- Mask password inputs as `[hidden]`
- Return empty values as `—` when a field is blank
- Do not persist data locally or send requests to a remote server
- Works only on inspectable URLs such as http, https, and file pages

## Install

1. Clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the project folder that contains `manifest.json`.
6. Open `examples/test-page.html` in a tab to test the extension.

## Usage

1. Open a page with form fields.
2. Click the extension icon.
3. Click Load Page.
4. Review the selector and value table.

Notes:

- Chrome internal pages like `chrome://` and the Chrome Web Store cannot be inspected.
- The extension does not modify page content; it only reads values from the current tab.
- Password values are intentionally hidden.

## Supported field types

The extension reads these form elements:

- `input` (except submit/button/reset/image)
- `textarea`
- `select`

For checkboxes and radio buttons, it reports whether the control is checked or unchecked.

## Project structure

```text
chrome-input-value-reader/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── icons/
├── examples/
│   └── test-page.html
├── tools/
│   └── create-icons.html
├── LICENSE
├── NOTICE
├── PRIVACY.md
├── SECURITY.md
├── CONTRIBUTING.md
├── README.md
└── CHANGELOG.md
```

## Permissions

| Permission | Purpose |
| --- | --- |
| `activeTab` | Access the currently active tab after the user invokes the extension |
| `scripting` | Run a one-time script on the active page to collect field data |

See [PRIVACY.md](./PRIVACY.md) for the privacy and data-handling details.

## Development

- Edit files in the `popup/` folder.
- Refresh the extension in `chrome://extensions/` after making changes.
- To regenerate toolbar icons, open `tools/create-icons.html` in a browser.

## License

MIT © 2026 Subrahmanyam Poluru / Poluru Labs. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

## Support

- Issues: [github.com/poluru-labs/chrome-input-value-reader/issues](https://github.com/poluru-labs/chrome-input-value-reader/issues)
- Security: [SECURITY.md](./SECURITY.md)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
