# Swift / iOS patterns

## State as one enum

```swift
// Don't. Flags allow contradictory states.
@Observable final class ItemsModel {
    var isLoading = false
    var items: [Item]?
    var error: String?
}

// Do.
enum LoadState {
    case loading
    case ready([Item])
    case failed(String)
}

@MainActor @Observable final class ItemsModel {
    private(set) var state: LoadState = .loading
    private let repo: ItemRepository

    init(repo: ItemRepository) { self.repo = repo }

    func load() async {
        do {
            state = .ready(try await repo.items())
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}
```

## No force-unwrap

```swift
// Don't.
let url = URL(string: input)!

// Do.
guard let url = URL(string: input) else { throw InputError.invalidURL(input) }
```

## Structured concurrency

```swift
// Don't. Callback pyramid, no cancellation.
api.fetchUser(id) { user in
    api.fetchOrders(user.id) { orders in completion(user, orders) }
}

// Do.
func profile(id: UserID) async throws -> Profile {
    async let user = api.user(id)
    async let orders = api.orders(id)
    return try await Profile(user: user, orders: orders)
}
```

## Shared mutable state in an actor

```swift
actor TokenStore {
    private var token: String?
    func set(_ value: String) { token = value }
    func current() -> String? { token }
}
```

## Thin SwiftUI view

```swift
struct ItemsView: View {
    @State var model: ItemsModel

    var body: some View {
        switch model.state {
        case .loading: ProgressView()
        case .ready(let items): List(items) { ItemRow(item: $0) }
        case .failed(let message): ErrorView(message: message) { Task { await model.load() } }
        }
    }
}
```

Attach loading with `.task { await model.load() }` so it cancels when the view disappears.

## Swift Testing

```swift
@MainActor
@Test func loadShowsItems() async {
    let model = ItemsModel(repo: FakeItemRepository(items: [.sample]))
    await model.load()
    #expect(model.state == .ready([.sample]))
}

@Test(arguments: ["", " ", "abc"])
func rejectsInvalidAmounts(_ input: String) {
    #expect(throws: AmountError.self) { try Amount(parsing: input) }
}
```
