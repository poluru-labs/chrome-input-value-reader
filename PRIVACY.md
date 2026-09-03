# Privacy Policy

**Last updated:** 2 September 2026

Input Value Reader is a local Chrome extension maintained by **Subrahmanyam Poluru / Poluru Labs**.

## What this extension does

When you click **Load Page**, the extension reads the **current tab URL** and every `<input>`, `<textarea>`, and `<select>` on that page. Selectors and values are shown in the popup table.

## What we collect

**Nothing.** The extension:

- Does not include analytics or crash reporters
- Does not make network requests
- Does not store selectors or values
- Does not send data to Poluru Labs, GitHub, or any other server
- Does not persist data in `chrome.storage` or cookies

Values exist only in memory in the popup until you close it or click **Clear**.

## Permissions

| Permission | Why |
| --- | --- |
| `activeTab` | Access the tab you are looking at, only after you click Load Page |
| `scripting` | Run a one-shot scan of form fields on that tab |

The extension does **not** inject a content script on every website.

## Passwords

Password fields (`input[type="password"]`) are never returned. The popup reports that the field was found and that the value is hidden.

## Restricted pages

Chrome blocks extensions on `chrome://` pages, the Chrome Web Store, and some other privileged URLs. That is expected.

## Contact

Questions about this policy: [mail.polurus@gmail.com](mailto:mail.polurus@gmail.com)
