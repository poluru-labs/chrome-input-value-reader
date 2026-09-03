# Input Value Reader

Chrome extension (Manifest V3) that finds an `<input>`, `<textarea>`, or `<select>` on the **active tab** using a CSS selector and shows its value in the popup.

Maintained by [Subrahmanyam Poluru](https://polurus.com) · Poluru Labs.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Features

- Lookup by ID, class, attribute, or any CSS selector
- Reads text, email, number, textarea, select, checkbox, and radio controls
- Highlights the matched element on the page
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
3. Enter a selector, for example:
   - `#inputId`
   - `.email-input`
   - `[name="username"]`
   - `input[type="email"]`
4. Click **Find Input** (or press Enter)

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
