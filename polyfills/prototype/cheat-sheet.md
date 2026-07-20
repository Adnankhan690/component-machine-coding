Step 3: Keep an Active Recall "Cheat Sheet" README

In the README.md of your repository, create a table summarizing your mental cues. When revising, look only at the "Key Trick" column and try to code it mentally before looking at your source files.

| Method / Problem | Key Trick / Gotcha to Remember | Complexity |
|---|---|---|
| `map` Polyfill | Don't use `forEach` inside; check for empty slots in sparse arrays. | `$O(n)$` |
| `reduce` Polyfill | Check if `initialValue` is `undefined`; if so, array index `0` becomes the accumulator. | `$O(n)$` |
| `debounce` | Must use a closure to hold the `timeoutId` reference across calls. | `$O(1)$` |
| `curry` | Compare `args.length` against the original function's expected `length`. | `$O(1)$` |
