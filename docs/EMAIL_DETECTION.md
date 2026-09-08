# Email detector: first rule

## How it works

`src/detection/email.ts` exports `detectEmails(text)`. It returns an array of Finding objects without changing the input, accessing the page, saving values or making network requests.

Each finding describes one occurrence, with its category, original text, detector source and start/end positions. Positions use JavaScript UTF-16 offsets, with the end excluded: `text.slice(start, end)` reproduces the detected value. IDs such as `email:13:28` are deterministic within the inspected snapshot, not global identifiers. Repeated addresses produce separate findings. No confidence score is invented for a rule match.

## Supported scope

- Common ASCII local parts, including dot-separated words, plus tags, underscores and apostrophes.
- Domain labels with letters/digits and internal hyphens, including subdomains.
- At least two domain labels and a final alphabetic label of 2–63 characters.
- Maximum 64 characters before @, 63 per domain label, and 254 overall.
- Surrounding brackets, commas and sentence-ending full stops are excluded from findings.

Candidate scanning includes Unicode characters and repeated @ signs, then validates the entire candidate. This avoids recognizing an ASCII fragment inside several common malformed or unsupported addresses.

## Limitations

This is a practical privacy heuristic, not a complete email-standard parser. Unicode addresses/domains, quoted local parts, address literals and single-label domains are outside the supported scope. No DNS or mailbox checks are performed; a syntactically plausible address may not exist. Obfuscated addresses and spaces inside an address are not reconstructed. Trailing dots are interpreted as prose punctuation. URLs, code and unusual punctuation may be ambiguous and need broader evaluation.

The tests are development fixtures, not an independent precision/recall benchmark. All example addresses are fictional. More representative evaluation comes later.

## Run the checks

`npm test` runs the synthetic cases once with Vitest and one worker. `npm run build` checks production TypeScript and builds the indicator. The detector is not imported by the content script, so it is not active on ChatGPT yet.

Test runner reference: https://vitest.dev/guide/
