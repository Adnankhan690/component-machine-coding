# Infinite scroll with a scroll event

## Thought process

1. The feed must be the actual scrolling element. Its fixed height and `overflow-y: auto` make `scrollTop`, `clientHeight`, and `scrollHeight` available.
2. On every `scroll` event, calculate remaining content: `scrollHeight - scrollTop - clientHeight`.
3. When the remaining content is within a 120px buffer, begin requesting the next page so it arrives before the user hits the exact end.
4. Scroll events fire rapidly. An immediate ref-based request lock prevents overlapping fetches, including extra development calls caused by React Strict Mode.
5. Append a successful page, move the next-page ref forward, and stop when the API returns fewer than a page of results.

## Pseudocode

```text
state: posts, isLoading, error, hasMore
refs: nextPage = 1, requestInFlight = false

loadMore:
  if requestInFlight OR no more results: return
  lock request; show loading
  fetch nextPage
  append fetched posts
  increment nextPage
  if returned posts < page size: hasMore = false
  unlock request; hide loading

on feed scroll:
  distanceFromBottom = scrollHeight - scrollTop - clientHeight
  if distanceFromBottom <= 120px: loadMore()

on mount: loadMore()
```
