# Ghana phone detection

`detectGhanaPhones(text)` in src/detection/ghana-phone.ts returns local, memory-only Finding objects. It preserves original formatting and uses exclusive-end UTF-16 offsets, like the email detector. IDs begin `phone:gh:` and identify an occurrence within a text snapshot. No confidence score, carrier identity, ownership or assignment claim is made.

## Basis and scope

The [NCA numbering plan](https://nca.org.gh/wp-content/uploads/2021/11/NUMBERING-PLAN-FOR-GHANA.pdf), consulted on 2026-09-08, specifies country code +233, nine national significant digits, and the 02/05 mobile and 03 fixed-line families in domestic form. The [ITU Ghana entry](https://www.itu.int/oth/T0202000052/en) provides additional published numbering material. These published resources are not a live subscriber allocation database.

The detector intentionally checks broad 2/3/5 number families, not individual carrier allocations or active lines. This can warn on unassigned numbers and identifiers that happen to fit the format.

## Accepted presentation

- Domestic: `0241234567`, `024 123 4567`, `0302 123456`.
- International Ghana forms: `+233 24 123 4567`, `00233 24 123 4567`.
- Printed optional trunk marker: `+233 (0)24 123 4567`.
- Spaces, tabs, nonbreaking spaces and single hyphens between digit groups.
- Parentheses surrounding a whole number are punctuation outside the finding.

Examples are invented test fixtures, not contact records. They are not guaranteed unassigned; do not call or message them.

The local zero must be dropped after +233/00233 unless explicitly written as the supported `(0)` marker. Bare `233...` or nine-digit numbers are not inferred as Ghanaian numbers.

## False-positive safeguards and limitations

Consume a complete numeric run before validating its digit count. Do not take a ten-digit substring from a longer identifier. Reject adjacent letters, identifier punctuation and email-domain markers. Support only full numbers in the chosen families: short codes, toll-free, premium-rate, machine-to-machine and other country codes are out of scope.

Two numbers separated only by spaces/hyphens are ambiguous and produce no finding; commas or line breaks separate candidates. Line breaks within one number, dot separators, internal area-code parentheses and extensions are not reconstructed. Digit grouping is permissive, not a dial-string validator. Arbitrary numeric identifiers can still match, and unusual text boundaries may cause missed findings. The review UI must eventually let the user decide.

The 49 synthetic phone tests cover supported forms, malformed lengths, excluded families, foreign prefixes, punctuation, UTF-16 offsets, repeated occurrences and common identifier boundaries. Together with 30 email tests, these are development checks, not a held-out precision/recall evaluation.

No browser integration is added by this step. ChatGPT still displays “Checking not active”.
