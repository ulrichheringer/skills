---
name: swift
description: Swift and iOS best practices and antipatterns (concurrency, SwiftUI, Observation, Swift Testing). Use when writing, editing, or reviewing any .swift file.
---

# Swift / iOS

| Rule | Summary |
|------|---------|
| Optionals | No force-unwrap (`!`) or `try!`. `guard let` early exits; `??` with a real default. |
| Value types | `struct` and `enum` by default; `class` only for identity or shared mutable state. `let` over `var`. |
| Closed sets | `enum` with associated values + exhaustive `switch` without `default`. State as one enum, not boolean flags. |
| Typed domain values | Wrap semantic primitives (`struct UserID: Hashable { let raw: String }`). Parse at the boundary. |
| Errors | Typed `throws(MyError)` or `Result` for expected failures. No `fatalError` for runtime conditions. |
| Concurrency | `async/await`, structured tasks (`async let`, `TaskGroup`). No callback pyramids, no `DispatchQueue` in new code. |
| Isolation | UI types `@MainActor`; shared mutable state in an `actor`; `Sendable` across boundaries. Strict concurrency checking on. |
| Cancellation | Long work checks `Task.isCancelled` / `try Task.checkCancellation()`; SwiftUI `.task` ties work to view lifetime. |
| Observation | `@Observable` models; views own only ephemeral UI state (`@State`). No business logic in `body`. |
| SwiftUI | Small views, data flows down, actions flow up as closures. No side effects in initializers. |
| Dependencies | Protocols at boundaries, injected through initializers. No singletons with hidden state. |
| Resources | User-facing text in String Catalogs; colors and spacing from the design system. |
| Tests | Swift Testing (`@Test`, `#expect`, parameterized args), fakes over mocks, `@MainActor` tests for view models. |

Examples: `references/patterns.md`.
