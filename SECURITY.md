# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.x | Yes |

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Email **mail.polurus@gmail.com** with:

- A short description of the issue
- Steps to reproduce or a proof of concept
- Affected version(s)
- Any known impact

You should receive an acknowledgement within a few business days.

## Scope

In scope:

- Unexpected access to page content without a user click
- Leakage of form values off-device
- Display or storage of password field values
- XSS via selector handling or popup rendering

Out of scope:

- Using the extension on a page you already control to read non-password fields (that is the documented purpose)
- Restricted Chrome pages (`chrome://`, Chrome Web Store) where `scripting` cannot run

## Notes for reviewers

This is a developer tool. It reads the value of a matching form control on the **active tab** after the user clicks **Find Input**. Values stay in the popup. Password inputs are not returned.
