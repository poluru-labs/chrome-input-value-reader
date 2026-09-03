# Contributing

Thanks for helping improve Input Value Reader.

## Ground rules

- Keep the extension **local-only**: no analytics, remote logging, or network calls.
- Do not read, store, or display password field values.
- Do not inject a content script on every page. Use `activeTab` + `scripting` on user action.
- Do not commit secrets, real credentials, or copyrighted third-party assets.
- Keep LICENSE, NOTICE, AUTHORS, and PRIVACY.md in sync when behavior changes.

## Local setup

```bash
git clone https://github.com/poluru-labs/chrome-input-value-reader.git
cd chrome-input-value-reader
```

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this repository folder (contains `manifest.json`)
4. Open `examples/test-page.html` in a tab and try selectors from the README

After code changes, click the refresh icon on the extension card.

## Project layout

```
manifest.json       Required at repo root for Load unpacked
popup/              Toolbar UI
icons/              16 / 48 / 128 PNG
examples/           Local test page
tools/              Icon generator
```

## Pull requests

1. Create a focused branch from `main`
2. Describe the user-facing change
3. Update README.md and CHANGELOG.md when behavior changes
4. Do not commit `.env`, `.DS_Store`, or generated downloads from the icon tool

## Code of conduct

Participation is governed by [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
