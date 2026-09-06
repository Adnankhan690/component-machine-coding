To write your own implementation of `Promise.all`, the core mental model is: **turn multiple async operations into a single Promise by counting completed results.**

Here is the step-by-step thought process, followed by the pseudocode.

---

### The Thought Process

1. **Input & Output:**
* **Input:** An iterable (usually an array) of items—some may be Promises, others might be raw values like strings or numbers.
* **Output:** A single new `Promise`.


2. **Immediate Edge Cases:**
* If the input array is **empty**, return a Promise that immediately resolves with an empty array `[]`.


3. **State Tracking:**
* Inside the returned Promise, you need to collect the resolved values. Create a `results` array of the same length as the input.
* Because Promises resolve at unpredictable times out of order, you can't rely on `results.push()`. Instead, store each result by its **exact index** (`results[index] = value`).
* Keep a `completedCount` variable starting at `0`.


4. **Iterating & Normalizing:**
* Loop through each item with its index.
* Items might not be Promises (e.g., `Promise.all([1, 2, fetch()])`). You must wrap/normalize every item with `Promise.resolve(item)` to ensure you can call `.then()` on it safely.


5. **Handling Resolution:**
* When a Promise resolves, store its value at `results[index]`.
* Increment `completedCount`.
* Check: `if (completedCount === items.length)`, call the main `resolve(results)`.


6. **Handling Rejection:**
* If *any* Promise rejects, immediately call the main `reject(error)`.
* Promises can only settle once. Calling `reject()` for the first failure immediately rejects the outer Promise—giving us the "fail-fast" behavior for free.



---

### Pseudocode

```text
FUNCTION myPromiseAll(items):
    RETURN NEW Promise(resolve, reject):
        
        // Edge Case: Empty input
        IF items is empty:
            resolve([])
            RETURN

        SET results = ARRAY of length equal to items
        SET completedCount = 0

        FOR EACH (item, index) IN items:
            
            // Step 1: Ensure item is a Promise
            Promise.resolve(item)
                .then(value => {
                    // Step 2: Store value at exact index
                    results[index] = value
                    completedCount = completedCount + 1

                    // Step 3: Resolve when ALL are done
                    IF completedCount EQUALS items.length:
                        resolve(results)
                })
                .catch(error => {
                    // Step 4: Reject immediately on first failure
                    reject(error)
                })

```

---

### Key Gotcha to Remember

Why use a `completedCount` variable instead of checking `results.length`?

In JavaScript, if you set `results[2] = 'data'` on an empty array, JS sets `results.length` to `3` immediately (creating sparse slots for index 0 and 1). Therefore, checking `results.length === items.length` will give false positives before earlier items finish!