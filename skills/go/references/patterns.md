# Go patterns

## Errors are values

```go
// Don't. Error dropped, no context.
data, _ := os.ReadFile(path)

// Do. Checked and wrapped.
data, err := os.ReadFile(path)
if err != nil {
	return Config{}, fmt.Errorf("read config %s: %w", path, err)
}
```

## `errors.Is` / `errors.As`

```go
// Don't. Breaks once the error is wrapped.
if err == sql.ErrNoRows || strings.Contains(err.Error(), "no rows") {}

// Do.
if errors.Is(err, sql.ErrNoRows) {}

var pathErr *fs.PathError
if errors.As(err, &pathErr) {}
```

## Consumer interfaces

```go
// Don't. Producer-side interface mirroring one struct.
package store
type UserStore interface { Get(ctx context.Context, id UserID) (User, error); Save(...); Delete(...) }

// Do. The consumer declares only what it needs.
package billing
type userGetter interface {
	Get(ctx context.Context, id UserID) (User, error)
}
```

## `context.Context` first

```go
// Don't.
type Client struct{ ctx context.Context }
func (c *Client) Fetch(url string) error

// Do.
func (c *Client) Fetch(ctx context.Context, url string) error
```

## Typed domain values

```go
// Don't. Swappable strings.
func Transfer(from, to string, cents int64) error

// Do.
type AccountID string
type Cents int64

func Transfer(from, to AccountID, amount Cents) error
```

## Closed sets

```go
type Status string

const (
	StatusPending Status = "pending"
	StatusPaid    Status = "paid"
)

func label(s Status) (string, error) {
	switch s {
	case StatusPending:
		return "Pending", nil
	case StatusPaid:
		return "Paid", nil
	default:
		return "", fmt.Errorf("unknown status %q", s)
	}
}
```

## Goroutine ownership

```go
// Don't. Fire-and-forget, errors lost, no cancellation.
for _, u := range urls {
	go fetch(u)
}

// Do.
g, ctx := errgroup.WithContext(ctx)
for _, u := range urls {
	g.Go(func() error { return fetch(ctx, u) })
}
return g.Wait()
```

## Table-driven tests

```go
func TestParseCents(t *testing.T) {
	tests := []struct {
		name string
		in   string
		want Cents
		err  bool
	}{
		{name: "whole", in: "12", want: 1200},
		{name: "decimals", in: "12.34", want: 1234},
		{name: "invalid", in: "abc", err: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParseCents(tt.in)
			if (err != nil) != tt.err {
				t.Fatalf("err = %v, want err %v", err, tt.err)
			}
			if got != tt.want {
				t.Fatalf("got %d, want %d", got, tt.want)
			}
		})
	}
}
```

## Packages by domain

```go
// Don't.
utils.FormatInvoice(inv)
billing.BillingInvoice{}

// Do.
billing.Format(inv)
billing.Invoice{}
```
