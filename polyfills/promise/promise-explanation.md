in this implementation explain the role and use of onfullfilledCb, onRejectedCb and why are we checking if (this.status === PENDING) {
in then method 

In asynchronous JavaScript, a promise's state is not always known at the exact moment `.then()` is called. A promise might still be waiting for an asynchronous operation (like a network request or `setTimeout`) to finish.

The arrays `onFulfilledCb` and `onRejectedCb` along with the `this.status === PENDING` check solve the problem of **how to handle callbacks registered *before* the promise has settled**.

---

### 1. The Role of `onFulfilledCb` and `onRejectedCb`

These arrays act as **holding queues** (or subscriber lists) for your `.then()` handlers:

* **`onFulfilledCb`**: Stores the success callback functions passed via `.then(onFulfilled, ...)` when the promise is still pending.
* **`onRejectedCb`**: Stores the error callback functions passed via `.then(..., onRejected)` when the promise is still pending.

Because a promise can technically have **multiple** `.then()` calls attached to it (e.g., branching), these arrays ensure that *all* registered handlers are saved and eventually executed once the promise finally resolves or rejects.

---

### 2. Why check `if (this.status === PENDING)` in `.then()`?

When `.then()` is invoked, the promise can be in one of three states: **`FULFILLED`**, **`REJECTED`**, or **`PENDING`**. The code inside `.then()` branches based on these states:

```typescript
if (this.status === FULFILLED) {
    // If already done, run immediately
    onFulfilled(this.value as T);
}

if (this.status === REJECTED) {
    // If already failed, run immediately
    onRejected(this.reason);
}

if (this.status === PENDING) {
    // If still waiting, SAVE for later!
    this.onFulfilledCb.push((value) => { ... });
    this.onRejectedCb.push((reason) => { ... });
}

```

#### Why we push to the arrays only during `PENDING`:

1. **We don't have the data yet:** When a promise is `PENDING`, `this.value` and `this.reason` are still `null`. You cannot execute `onFulfilled(value)` yet because `value` hasn't arrived.
2. **Subscription Pattern:** By pushing a closure function into `onFulfilledCb`, you are telling the promise: *"I don't have my value yet, so hold onto this function. When `resolve()` is finally called later, loop through this array and execute my function with the final value."*

If you didn't check for `PENDING` and queue the callbacks, any `.then()` called on an asynchronous promise would execute immediately with `null` values before the async operation even had a chance to finish.


Q2. and here why are we travelling all the array element to call each and every cb, what if i called only once ? 

We iterate through the entire array using `.forEach()` because a single promise can have **multiple `.then()` handlers attached to it independently**.

If you called it only once (or stored a single callback instead of an array), **subsequent `.then()` calls would overwrite the previous ones**, and only the last handler would ever execute.

---

### Why Multiple Handlers Matter (Fan-Out)

In JavaScript, you can attach multiple `.then()` blocks to the exact same promise instance. For example:

```javascript
const myPromise = new MyPromise((resolve) => {
    setTimeout(() => resolve("Data loaded!"), 1000);
});

// Subscriber 1
myPromise.then((val) => console.log("Handler A:", val));

// Subscriber 2
myPromise.then((val) => console.log("Handler B:", val));

// Subscriber 3
myPromise.then((val) => console.log("Handler C:", val));

```

If `onFulfilledCb` were just a single variable instead of an array:

1. `Handler A` would be registered.
2. `Handler B` would overwrite `Handler A`.
3. `Handler C` would overwrite `Handler B`.
4. When the promise finally resolves, **only `Handler C**` would run, and A and B would be completely lost.

### The Role of the Array

Using an array (`onFulfilledCb[]`) acts like a **Publisher-Subscriber pattern**:

* Every time `.then()` is called while the promise is `PENDING`, a new subscriber registers its callback by pushing it into the array.
* When `resolve()` finally triggers, it loops through the array (`.forEach`) to ensure **every single subscriber** gets notified with the final value.