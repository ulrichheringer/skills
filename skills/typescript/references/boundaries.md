# Boundaries

Validation, narrowing, and error handling live at system boundaries. Internal code trusts types. Business logic lives in pure functions; the shell is thin.

## Boundaries

CLI args, config files, env vars, network/RPC payloads, `JSON.parse`, `postMessage`, IPC, file contents, database rows, external APIs.

## Rules

- At boundaries: parse raw input into domain types, return errors, handle defensively.
- Inside: typed data, error propagation, no redundant null checks or re-validation.
- Across the boundary: expose domain concepts, never transport, storage, framework, or wire types.
- Validate config at parse time, not inside business logic.
- Derive types from the authoritative schema (proto, OpenAPI, GraphQL, migrations) instead of hand-rolling parallel types.
- Parse, prompt construction, and scoring are pure transforms: state in, value out.

## Tests

- Is this data crossing a boundary right now? If not, validation is redundant.
- Can this be a pure function the shell calls? If yes, extract it.
