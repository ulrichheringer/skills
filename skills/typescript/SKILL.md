---
name: typescript
description: TypeScript best practices and antipatterns. Use when writing, editing, or reviewing any .ts or .tsx file.
---

# TypeScript

Make the compiler reject impossible states, mismatched primitives, and unhandled variants. Define errors and special cases out of existence instead of adding handlers.

| Rule | Summary |
|------|---------|
| Discriminated unions | Model variants with a `kind` literal discriminant. No boolean + optional-field bags. |
| Branded types | Brand semantic primitives with `& { readonly __brand: "X" }`. Validate once at the boundary. |
| Constructive modeling | Shape the type so the illegal value can't be built: `[T, ...T[]]` non-empty, `[T, T][]` pairs, `start` + `durationMs` for ranges. |
| Simplest total type | Keep `T[]` while every operation stays total. Strengthen only where the loose type forces `!`, a cast, or a "never happens" throw. |
| `unknown` over `any` | External data is `unknown` until parsed. |
| Schemas before guards | Use the repo's schema library and infer the type (`z.infer`). Never add a schema dependency for one guard. |
| No `as` casts | Cast only after validation. |
| Narrowing hierarchy | Discriminant switch > `in` > `typeof`/`instanceof` > type guard > `as`. |
| Honest type guards | A guard must verify its claim. Name them `isX`/`hasX`. |
| Exhaustiveness | `const _exhaustive: never = x;` in every default arm. |
| `satisfies` over `as` | Validates without widening literals. |
| Boundary validation | Parse where data crosses in, into a named domain type. Trust types inside. No re-validation deep in call chains. |
| Derived types | `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof` or generated schema types before a new interface. |
| Object args | Objects over positional args. Skip on hot paths. |
| Real tests | Don't mock what you can run. Mock only what can't run locally. |
| Structured telemetry | Structured logger with context. No `console.log` in shipped code. |

Examples: `references/patterns.md`. Boundary placement: `references/boundaries.md`.

Adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack) (MIT, Lauren Tan). See `LICENSE.pstack`.
