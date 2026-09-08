# Inspection coordinator

`inspectText(text)` is the single entry point for the current local detectors. It returns the exact inspected text snapshot and a `findings` array. It does not mutate the input, store content, access the page or make a network request.

## Current detectors

The coordinator runs email, Ghana phone, international phone and Ghana Card PIN detection. Ghana-specific and international phone rules deliberately divide responsibility for `+233`/`00233` values.

## Overlap policy

Findings are first ranked by category priority: `identifier`, then `email`, then `phone`, then `person`. Within a category, the longer range wins; identical ranges use the stable finding ID. A candidate is accepted only when it does not overlap an already accepted candidate. The final output is sorted by start position, then longer range, then ID.

This policy prevents a broad phone candidate from hiding a more specific identifier and ensures repeat runs return the same order. It is a conservative choice for a first coordinator: a future model detector may need a reviewed policy for person/entity overlaps.

The coordinator does not redact or alter text. Review and redaction will consume this result only after checking that the page text still equals `result.text`.

The tests cover mixed detector output, exact duplicates, overlapping ranges, deterministic tie-breaking, ordering and input immutability. They are unit tests, not browser integration tests.
