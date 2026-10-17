---
name: go
description: Go best practices and antipatterns. Use when writing, editing, or reviewing any .go file.
---

# Go

| Rule | Summary |
|------|---------|
| Errors are values | Return `error` last. Check every error. Wrap with context: `fmt.Errorf("load config: %w", err)`. Never `_ =` an error. |
| `errors.Is` / `errors.As` | Never `==` on wrapped errors or string matching. Sentinel errors only when callers branch on them. |
| No panic | `panic` only for programmer bugs at init. Never for runtime failures. |
| Consumer interfaces | Define interfaces where used, 1-3 methods. Accept interfaces, return structs. No interface with one implementation. |
| `context.Context` first | First param on anything that does IO or blocks. Never stored in a struct. Respect cancellation. |
| Typed domain values | `type UserID string` for semantic primitives. Parse at the boundary into domain types. |
| Useful zero values | Structs work at their zero value. No constructor that only sets defaults. |
| Closed sets | Typed consts. `switch` with a `default` that returns an error. |
| Goroutine ownership | Every goroutine has an owner that waits (`errgroup`, `WaitGroup`) and a way to stop (ctx). No fire-and-forget. |
| Shared state | Channels transfer ownership; a mutex guards shared state with the smallest scope. Test with `-race`. |
| `defer` cleanup | `defer f.Close()` right after a successful open. Check close errors on writes. |
| Packages by domain | `billing`, not `utils`/`common`. No stutter: `billing.Invoice`, not `billing.BillingInvoice`. |
| Table-driven tests | `[]struct{ name string; ... }` + `t.Run`. Use `t.Helper`, `t.Cleanup`, `t.TempDir`. |
| Real tests | `httptest`, real local deps. Fakes over mocks. |
| Structured logging | `log/slog` with key-values. No `fmt.Println` in shipped code. |
| Generics sparingly | Only when the same code repeats for several types. |

Examples: `references/patterns.md`.
