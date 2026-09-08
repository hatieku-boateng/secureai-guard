# Selected redaction

`redactSelected(text, findings)` creates a protected preview from selected findings. It never mutates the original text or the finding objects. Ranges are sorted by position, checked against the exact snapshot, and rejected if invalid or overlapping.

Placeholders are meaningful and numbered by category in text order: `[PERSON_1]`, `[EMAIL_1]`, `[PHONE_1]` and `[IDENTIFIER_1]`. Unselected findings remain unchanged. The returned original text lets a review panel preserve the source until the user chooses an action.

A stale finding is rejected when the current text no longer contains the finding at the recorded range. This prevents applying approval to a changed composer. The redaction result is only an in-memory preview; it does not submit or attach anything.

The layer does not claim that every sensitive value was found, and placeholders can still be edited by the user. Safe document reconstruction remains separate future work.
