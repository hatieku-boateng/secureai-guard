# International phone detection

`detectInternationalPhones(text)` uses the local `libphonenumber-js/max` metadata package to find explicit international numbers beginning with `+` or `00`. It returns the shared Finding shape with original text and UTF-16 offsets. It does not contact a service, check whether a number is assigned, identify an owner or store the value.

## Scope

- Accepts common international presentations such as `+1 202 555 0123`, `+44 20 7946 0123`, `+234 803 123 4567` and their `00` equivalents.
- Requires an explicit international prefix. Local numbers without a country code are left to country-specific detectors.
- Excludes Ghana (`+233` and `00233`) so the dedicated Ghana detector remains the single owner of those findings.
- Rejects candidates embedded in words, identifiers, email addresses or longer numeric runs.
- Uses the library's `isValid()` check with its full (`max`) metadata. A syntactically plausible but unsupported or reserved example can therefore be missed.

## Dependency decision

`libphonenumber-js` 1.13.12 is an exact production dependency. Its metadata is maintained from Google's numbering data, and its text matcher and validation reduce the risk of maintaining country rules ourselves. The full metadata is a deliberate tradeoff: a minified standalone bundle of this detector measured 195,717 bytes (50,182 bytes gzip) on this machine. The current extension bundle does not import the detector yet, so this cost is not currently paid in dist/content.js.

Before connecting this detector to the content script, measure the combined extension bundle and decide whether lazy loading, a reduced metadata set or another approach is justified. Any bundled metadata is public application data, not user content.

## Limitations

Valid format does not prove that a number exists, is reachable or belongs to a person. Numbering plans and library metadata change. This detector may produce false positives on realistic-looking fictional data and false negatives for unusual but valid presentations. The test fixture for UK `+44 7700 900123` is deliberately rejected by the library's stricter validation, demonstrating that “phone-like” and “library-valid” are different concepts. Keep such limitations visible in the eventual review panel.

The 34 tests cover international countries, spacing, parentheses, `00` prefixes, malformed input, boundaries, Ghana delegation, repeated values and offsets. They are synthetic development checks, not a held-out accuracy evaluation.

Reference: https://github.com/catamphetamine/libphonenumber-js
