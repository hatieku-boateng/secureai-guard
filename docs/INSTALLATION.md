# Load the prototype locally

This shell only displays “SecureAI Guard” and “Checking not active”. It does not inspect, redact or intercept prompts or attachments.

## Build

From the project folder, run `npm ci` for a fresh dependency installation, then `npm run build`. The output folder must contain manifest.json and content.js.

## Chrome

1. Open `chrome://extensions` in Google Chrome.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select the **dist** folder, not the project root:

   ```text
   C:\Users\yawse\Documents\ChatGPT\Secure_AI_\dist
   ```

5. Confirm the SecureAI Guard card appears without errors and is enabled.
6. Open or reload https://chatgpt.com/.
7. Look at the bottom-left corner for **SecureAI Guard — Checking not active**.

The indicator may cover a small part of the page. Use its dismiss button to hide it. It returns on a full page reload; dismissal is not saved.

## Verify the shell

- Confirm the extension card has no loading errors.
- Confirm exactly one indicator appears on ChatGPT.
- Tab to the dismiss button: a visible blue focus outline should appear. Enter or Space should dismiss the indicator.
- Reload the page and confirm the indicator returns.
- Confirm it does not appear on an unrelated website.
- No prompt needs to be entered or submitted for this check.

These checks establish shell behavior only. They do not establish privacy protection.

## After code changes

Run `npm run build`, reload the extension on the extensions page, then reload the ChatGPT tab. Chrome does not automatically replace an already-running content script when source files change.

## Site access

The manifest declares a content script for `https://chatgpt.com/*` only. This allows page interaction on that site; Chrome may describe this broadly as reading/changing site data. This version's code only creates the indicator. No storage, tabs, background worker, external request or all-sites permission is declared.

## Brave fallback

Brave uses Chromium and can be tried with the same dist folder via `brave://extensions`. Record this as a Brave check; it does not replace the project's planned Google Chrome verification.

## Troubleshooting

- Missing manifest: build first and select dist.
- No indicator: confirm the extension is enabled and allowed on ChatGPT, then reload the page. A dismissed indicator needs a full reload.
- Loading errors: record the extension error text without including private page content.

Reference: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world
