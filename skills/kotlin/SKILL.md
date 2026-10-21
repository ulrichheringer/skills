---
name: kotlin
description: Kotlin and Android best practices and antipatterns (coroutines, Flow, Compose, ViewModel). Use when writing, editing, or reviewing any .kt or .kts file.
---

# Kotlin / Android

| Rule | Summary |
|------|---------|
| Null safety | No `!!`. Model absence in types; `?.`, `?:`, `requireNotNull` at boundaries only. |
| Immutability | `val`, read-only `List`/`Map`, `data class` with `copy`. `var` only for local accumulation. |
| Closed sets | `sealed interface` + exhaustive `when` without `else`. State as one sealed type, not boolean flags. |
| Typed domain values | `@JvmInline value class UserId(val raw: String)`. Parse at the boundary. |
| Errors | Expected failures in the return type (`Result`, sealed outcome). Exceptions for bugs. Never swallow `CancellationException`. |
| Structured concurrency | `viewModelScope` / `lifecycleScope` / injected `CoroutineScope`. No `GlobalScope`, no `runBlocking` in app code. |
| Dispatchers | Inject them; `withContext(io)` inside the data layer, not in UI. Suspend functions are main-safe. |
| Flow | `StateFlow` for UI state, collected with `collectAsStateWithLifecycle()`. Cold `Flow` for streams; `stateIn(WhileSubscribed(5_000))`. |
| ViewModel | Exposes one immutable `StateFlow<UiState>` and event functions. No `Context`, no Views, no navigation objects. |
| Compose | Stateless composables, state hoisted; `Modifier` first optional param; no business logic or I/O in composables; `remember` keys explicit; stable params. |
| Resources | Strings in `strings.xml`, dimensions from the theme. No hardcoded user-facing text or colors. |
| DI | Constructor injection. No service locators or singletons holding `Context`. |
| Tests | JUnit + `runTest`, Turbine for Flow, fakes over mocks, `MainDispatcherRule`. Compose UI via `createComposeRule`. |
| Build | Version catalog (`libs.versions.toml`), no dynamic versions, `ktlint`/`detekt` in CI. |

Examples: `references/patterns.md`.
