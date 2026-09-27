# Q1. here in then method we are checking for status=fulfilled, also the pending , i want to know the case where status=fullfilled or pending during execution in the provided example, suggest your example 

To see how the `then` method handles both states, let's look at two distinct examples: **Synchronous Resolution** (where the status is *already* `FULFILLED` when `.then()` is called) and **Asynchronous Resolution** (where the status is still `PENDING`).

---

### Case 1: Status is `FULFILLED` (Synchronous / Already Settled)

This happens when a promise resolves immediately (synchronously) inside its executor, or if you attach `.then()` to a promise that finished in the past.

```javascript
const immediatePromise = new MyPromise<string>((resolve) => {
    resolve("Data is ready instantly!"); // Resolves synchronously right here
});

// When this .then() runs, `this.status` is ALREADY 'FULFILLED'.
immediatePromise.then(
    (result) => {
        // Hits the: if (this.status === FULFILLED) block
        console.log("Case 1 - Fulfilled immediately:", result);
    },
    (error) => {
        console.log(error);
    }
);

```

* **What happens in the code:** Because `resolve()` ran instantly during the `new MyPromise` construction, by the time `.then()` is reached, `this.status` is already `FULFILLED`. It bypasses the `PENDING` queue entirely and executes `onFulfilled` **immediately**.

---

### Case 2: Status is `PENDING` (Asynchronous / Still Waiting)

This is the most common use case for promises, where the operation takes time (like a network request or `setTimeout`) and `.then()` is attached *before* the data arrives.

```javascript
const delayedPromise = new MyPromise<string>((resolve) => {
    setTimeout(() => {
        resolve("Data arrived after 2 seconds!"); // Resolves later
    }, 2000);
});

// When this .then() runs, the promise is still doing async work.
delayedPromise.then(
    (result) => {
        // Hits the callback stored in `onFulfilledCb` 2 seconds later
        console.log("Case 2 - Fulfilled later:", result);
    },
    (error) => {
        console.log(error);
    }
);

console.log("This prints FIRST because the promise is still PENDING.");

```

* **What happens in the code:**
1. When `.then()` runs, `this.status` is **`PENDING`**.
2. The code skips the `FULFILLED` and `REJECTED` blocks.
3. It enters the `if (this.status === PENDING)` block and pushes your callback function into the `this.onFulfilledCb` array as a placeholder.
4. 2 seconds later, `setTimeout` fires, `resolve()` is called, changes the status to `FULFILLED`, and loops through `onFulfilledCb` to finally execute your callback.