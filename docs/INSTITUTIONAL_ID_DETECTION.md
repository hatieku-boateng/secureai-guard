# Institutional identifier detection

Institution-specific identifiers vary, so a broad numeric rule would create many false warnings. `detectInstitutionalIds(text)` therefore requires an explicit nearby label such as `Student ID`, `student number`, `Learner No.`, `Employee ID` or `staff identification`, followed by a synthetic-looking alphanumeric value.

The initial value shape is 4–20 letters, digits, slashes or hyphens and must contain at least one digit. This is a conservative context heuristic, not a Ghana-wide numbering standard. It does not infer a person's institution, validate an identifier, query a directory or identify an owner. The detector returns the value only; the label is not part of the replacement range.

It deliberately misses unlabelled numbers, labels in other languages, institution-specific punctuation outside the supported shape and values shorter than four characters. Those tradeoffs are preferable until real evaluation data can be created synthetically with participating institutions. Never add real student, employee or academic records to tests.

The synthetic tests cover student and employee labels, case, punctuation, minimum/maximum boundaries, unsupported values and UTF-16 offsets. The eventual review panel should explain that a context match is a warning requiring user review.
