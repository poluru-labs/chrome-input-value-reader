# Input Value Reader

Chrome extension (Manifest V3) that loads the **active tab** and lists every `<input>`, `<textarea>`, and `<select>` in a selector / value table.

Maintained by [Subrahmanyam Poluru](https://polurus.com) · Poluru Labs.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Screenshot

<img width="1406" height="923" alt="image" src="https://github.com/user-attachments/assets/4ca743e3-9c76-4219-b9f9-29001c266343" />

## Features

- **Load Page** reads the current tab URL and every form field
- Table of CSS selector and current value
- Covers text, email, number, textarea, select, checkbox, and radio
- Password field values are never displayed
- Local only: no network calls, storage, or analytics

## Install (unpacked)

1. Clone this repository
2. Open Chrome → `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select **this repository folder** (the one that contains `manifest.json`)
5. Open `examples/test-page.html` in a tab to try it

## Usage

1. Open a page that has form fields
2. Click the extension icon
3. Click **Load Page**
4. Review the table: **Selector** | **Value**

Chrome cannot run this on `chrome://` pages or the Chrome Web Store.

## Project structure

```
chrome-input-value-reader/     # Load unpacked this folder
├── manifest.json
├── popup/
├── icons/
├── examples/test-page.html
├── tools/create-icons.html
└── LICENSE, NOTICE, PRIVACY.md, …
```

## Permissions

| Permission | Why |
| --- | --- |
| `activeTab` | Access the tab you are viewing, after you use the popup |
| `scripting` | Run a one-shot lookup on that tab |

See [PRIVACY.md](./PRIVACY.md).

## Development

Edit files under `popup/`, then click the refresh icon on the extension card in `chrome://extensions/`.

Regenerate toolbar icons by opening `tools/create-icons.html` in a browser.

## License

MIT © 2026 Subrahmanyam Poluru / Poluru Labs — see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

## Support

- Issues: [github.com/poluru-labs/chrome-input-value-reader/issues](https://github.com/poluru-labs/chrome-input-value-reader/issues)
- Security: [SECURITY.md](./SECURITY.md)
- Contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)
