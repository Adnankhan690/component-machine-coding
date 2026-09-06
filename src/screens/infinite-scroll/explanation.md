```text
                     Initial render
                           │
                           ▼
              ┌─────────────────────────┐
              │ posts = []              │
              │ page = 1                │
              │ isLoading = false       │
              │ requestInFlight = false │
              └───────────┬─────────────┘
                          │
                          ▼
                   loadMore()
                          │
          ┌───────────────┴────────────────┐
          │ Is a request already running,   │
          │ loading, or no more posts?      │
          └───────────────┬────────────────┘
                    yes   │   no
                  ┌───────▼───┐
                  │  Return   │
                  └───────────┘
                            │
                            ▼
          ┌─────────────────────────────────┐
          │ requestInFlight.current = true   │
          │ isLoading = true                 │
          └───────────────┬─────────────────┘
                          │
                          ▼
           Fetch: /posts?_page=page&_limit=10
                          │
              ┌───────────┴───────────┐
              │                       │
           Success                   Failure
              │                       │
              ▼                       ▼
 append new posts to `posts`     set `error`
 increment `page`                     │
              │                       │
              └───────────┬───────────┘
                          ▼
          ┌─────────────────────────────────┐
          │ requestInFlight.current = false  │
          │ isLoading = false                │
          └─────────────────────────────────┘
```

The scrolling part is separate:

```text
┌─────────────────────────────────────────────┐
│ Scrollable feed (`feedRef`)                  │
│                                             │
│  Post 1                                     │
│  Post 2                                     │
│  ...                                        │
│  Post 10                                    │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Sentinel (`sentinelRef`)               │  │
│  │ "Loading more posts..."                │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                        │
                        │ sentinel enters view
                        ▼
              IntersectionObserver callback
                        │
                        ▼
                   loadMore()
```

`requestInFlight` is a `useRef` lock:

```text
Observer fires twice quickly
        │
        ├── First call: requestInFlight = false
        │   → changes it to true → starts fetch
        │
        └── Second call: requestInFlight = true
            → returns immediately
```

A ref is useful here because it updates immediately without waiting for React to re-render, preventing duplicate API calls.