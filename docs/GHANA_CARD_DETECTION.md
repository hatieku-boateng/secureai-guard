# Ghana Card PIN detection

`detectGhanaCardPins(text)` checks the published Ghana Card Personal Identification Number shape `GHA-000000000-0`: the `GHA` country code, nine digits, a hyphen and one final digit. The National Identification Authority describes this format in its [FAQ](https://register.nia.gov.gh/faqs), and an NIA portal shows the same input shape. The detector runs locally and returns the shared `Finding` contract.

This is a shape warning only. It does not verify a checksum, query NIA, prove that a number was issued, identify a person or establish citizenship. Test values are fictional and must not be used for identity verification.

The rule accepts uppercase or lowercase `GHA` and the exact hyphenated form. It rejects missing or extra digits, alternate separators, adjacent identifier characters and embedded email-like values. OCR variants and numbers printed with spaces are outside the initial scope. The review interface will need to explain that a format match is not confirmation of a real Ghana Card PIN.

The 19 synthetic tests cover valid shapes, malformed lengths, separators, boundaries, repeats and UTF-16 offsets. They are development checks, not an accuracy benchmark.
