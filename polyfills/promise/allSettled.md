To implement `Promise.allSettled`, the core mental model centers on one key rule: **never call the outer `reject()` when an individual promise fails.** Instead, catch all rejections and transform every outcome into a standardized status object.

---

### The Thought Process

1. **Input & Output:**
* **Input:** An array/iterable of promises or raw values.
* **Output:** A single new `Promise` that **always resolves** with an array of objects describing the outcome of each input item.


2. **Edge Case Handling:**
* If the input array is empty, resolve immediately with an empty array `[]`.


3. **Tracking Results & Order:**
* Create a `results` array matching the input array's length.
* To maintain exact index ordering regardless of completion order, write values directly to `results[index]`.
* Create a `completedCount` counter set to `0`.


4. **Standardizing the Result Format:**
* **On Success:** Store `{ status: 'fulfilled', value: value }` at `results[index]`.
* **On Failure:** Store `{ status: 'rejected', reason: reason }` at `results[index]`.


5. **Shared Completion Logic:**
* Both `.then()` and `.catch()` represent a task settling.
* Both handlers must increment `completedCount`.
* Both handlers must check: `if (completedCount === items.length)`, call `resolve(results)`.


6. **Normalizing Non-Promises:**
* Wrap each item in `Promise.resolve(item)` so non-promise values (like numbers or strings) are handled seamlessly through the same `.then()` pipeline.



---

### Pseudocode

```text
FUNCTION myPromiseAllSettled(items):
    RETURN NEW Promise(resolve, reject):
        
        // Edge Case: Empty input
        IF items is empty:
            resolve([])
            RETURN

        SET results = ARRAY of length equal to items
        SET completedCount = 0

        FOR EACH (item, index) IN items:
            
            // Step 1: Normalize item to ensure it is a Promise
            Promise.resolve(item)
                .then(value => {
                    // Step 2a: Store fulfillment object
                    results[index] = { status: 'fulfilled', value: value }
                    completedCount = completedCount + 1

                    // Step 3: Resolve outer promise only when ALL have settled
                    IF completedCount EQUALS items.length:
                        resolve(results)
                })
                .catch(reason => {
                    // Step 2b: Store rejection object (do NOT call outer reject)
                    results[index] = { status: 'rejected', reason: reason }
                    completedCount = completedCount + 1

                    // Step 3: Resolve outer promise only when ALL have settled
                    IF completedCount EQUALS items.length:
                        resolve(results)
                })

```

---

### `Promise.all` vs. `Promise.allSettled` Polyfill Logic

| Feature | `Promise.all` Polyfill | `Promise.allSettled` Polyfill |
| --- | --- | --- |
| **Catch Handler** | Calls `reject(reason)` immediately | Formats error object, increments count, checks if done |
| **Stored Array Values** | Raw values (`value`) | Wrapped objects (`{ status, value/reason }`) |
| **Outer Rejection** | Triggered on first failure | **Never triggered** by item failures |