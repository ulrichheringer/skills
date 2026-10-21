# Kotlin / Android patterns

## UI state as one sealed type

```kotlin
// Don't. Flags allow contradictory states.
data class ScreenState(val loading: Boolean, val items: List<Item>?, val error: String?)

// Do.
sealed interface ScreenState {
    data object Loading : ScreenState
    data class Ready(val items: List<Item>) : ScreenState
    data class Failed(val message: String) : ScreenState
}
```

## ViewModel exposes StateFlow

```kotlin
// Don't. Mutable state leaks, Context in ViewModel.
class ItemsViewModel(private val context: Context) : ViewModel() {
    val state = MutableStateFlow<ScreenState>(ScreenState.Loading)
}

// Do.
class ItemsViewModel(private val repo: ItemRepository) : ViewModel() {
    private val _state = MutableStateFlow<ScreenState>(ScreenState.Loading)
    val state: StateFlow<ScreenState> = _state.asStateFlow()

    fun load() = viewModelScope.launch {
        _state.value = repo.items().fold(
            onSuccess = { ScreenState.Ready(it) },
            onFailure = { ScreenState.Failed(it.message.orEmpty()) },
        )
    }
}
```

## Structured concurrency

```kotlin
// Don't. Outlives the screen, errors lost.
GlobalScope.launch { repo.sync() }

// Don't. Swallows cancellation.
try { repo.sync() } catch (e: Exception) { log(e) }

// Do.
viewModelScope.launch {
    try {
        repo.sync()
    } catch (e: IOException) {
        _state.value = ScreenState.Failed("offline")
    }
}
```

## Main-safe suspend functions

```kotlin
// Do. Caller never picks a dispatcher.
class ItemRepository(private val api: Api, private val io: CoroutineDispatcher) {
    suspend fun items(): Result<List<Item>> = withContext(io) { runCatching { api.items() } }
}
```

## Stateless composable, hoisted state

```kotlin
// Don't. Composable owns data loading.
@Composable
fun ItemsScreen() {
    val vm: ItemsViewModel = viewModel()
    LaunchedEffect(Unit) { vm.load() }
    Text(vm.state.value.toString())
}

// Do.
@Composable
fun ItemsRoute(vm: ItemsViewModel = viewModel()) {
    val state by vm.state.collectAsStateWithLifecycle()
    ItemsScreen(state = state, onRetry = vm::load)
}

@Composable
fun ItemsScreen(state: ScreenState, onRetry: () -> Unit, modifier: Modifier = Modifier) {
    when (state) {
        ScreenState.Loading -> CircularProgressIndicator(modifier)
        is ScreenState.Ready -> ItemList(state.items, modifier)
        is ScreenState.Failed -> ErrorBox(state.message, onRetry, modifier)
    }
}
```

## Testing a ViewModel

```kotlin
@get:Rule val main = MainDispatcherRule()

@Test
fun `load emits Ready`() = runTest {
    val vm = ItemsViewModel(FakeItemRepository(items = listOf(item)))
    vm.state.test {
        assertEquals(ScreenState.Loading, awaitItem())
        vm.load()
        assertEquals(ScreenState.Ready(listOf(item)), awaitItem())
    }
}
```
