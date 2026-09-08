# ADR 0001: Browser extension with local inspection

- Date: 2026-09-08
- Status: Accepted for the planned MVP

## Context

The project should help users review sensitive prompt information without switching to a separate checking site or uploading content to a detector service.

## Decision

Start with a Chrome Manifest V3 extension targeting ChatGPT. Use TypeScript, plain HTML/CSS and local validated rules before adding an evaluated local NER model. Keep site integration separate from inspection and redaction. Store no prompt or document content.

## Consequences

The user can review findings in the existing workflow, and inspection can operate without an external detection API. Browser and website changes require adapter maintenance. Rules miss contextual entities; a local model adds download and resource costs that must be measured. Content already in the host page is not isolated from that website.

No frontend framework, entity model, build tool or document reconstruction library is selected by this decision. Record those decisions when evidence justifies them.
