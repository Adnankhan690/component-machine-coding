# Code Review: `Counter.tsx` (Interview Prep)

Here is a breakdown of what you can improve in this component to stand out in a frontend interview.

---

## 1. Major Bug: Stale Closures in Async Actions 🚨
In a React interview, handling asynchronous state updates is a common trap.

### The Issue
Lines 107–108 initiate asynchronous state updates using `setTimeout`:
```tsx
<button onClick={() => setTimeout(() => handleIncrement(), 3000)}>async+</button>
```

When `handleIncrement` is scheduled, it closes over the values of `counterValue` and `limit` from that specific render frame. 

* **Scenario:** If the max limit is `10`, and `counterValue` is currently `9`.
* If a user clicks `async+` and then immediately clicks the synchronous `Increment` button:
  1. The synchronous increment updates the counter to `10`.
  2. 3 seconds later, the timeout executes `handleIncrement`.
  3. Inside that stale closure, `counterValue` is still evaluated as `9` (from 3 seconds ago).
  4. The guard `if (counterValue >= safeMax) return;` (i.e. `if (9 >= 10)`) evaluates to **false**, so it bypasses the guard.
  5. The functional update `setCounterValue((prev) => prev + 1)` is called, pushing the value to `11`.
* **Result:** The max limit boundary is violated.

### The Solution
Perform boundary checks inside the functional state updater (`setCounterValue`) where you are guaranteed to access the most up-to-date state (`prev`):

```typescript
const handleIncrement = () => {
    const step = inputValue.trim() === '' ? 1 : Number(inputValue);
    if (isNaN(step)) return;

    setCounterValue((prev) => {
        const { max: safeMax } = getSafeLimits();
        const nextValue = prev + step;
        return nextValue > safeMax ? prev : nextValue; // or Math.min(nextValue, safeMax)
    });
};
```

---

## 2. Resource Leaks (Unmounted State Updates) 🧹
If a user triggers the 3-second async buttons and then navigates away (unmounting this component), the timeout will still fire. This leads to attempts to update the state of an unmounted component, resulting in memory leaks.

### The Solution
Use a `useRef` to track active timeouts and clear them on component unmount:

```typescript
import { useEffect, useRef } from "react";

// Inside component:
const timeoutsRef = useRef<number[]>([]);

const handleAsyncIncrement = () => {
    const id = window.setTimeout(() => {
        handleIncrement();
        // Remove completed timeout from ref
        timeoutsRef.current = timeoutsRef.current.filter(tId => tId !== id);
    }, 3000);
    timeoutsRef.current.push(id);
};

// Cleanup on unmount
useEffect(() => {
    return () => {
        timeoutsRef.current.forEach((id) => clearTimeout(id));
    };
}, []);
```

---

## 3. Tightening TypeScript Types 🛡️
On line 57, `type` is typed as a generic `string`:
```typescript
const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>, type: string)
```

In an interview, you should show strong type-safety discipline. If `type` can only be `'min'` or `'max'`, restrict it to that union type.

### The Solution
```typescript
const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    // TypeScript will now prevent passing invalid keys
};
```

---

## 4. Input Sanitization & Edge Cases 🔍
* **NaN Safety:** Using `Number(inputValue)` directly can result in `NaN` if the input is somehow invalid or empty. Even with `type="number"`, browsers behave inconsistently and can permit inputs like `1e3` (scientific notation) or trailing dots.
* Always handle `isNaN()` fallbacks before doing math on state values.

---

## 5. Separation of Concerns (Architecture Bonus) 🏗️
Extracting state management and operations into a custom hook `useCounter` makes the logic reusable and makes it clean to write isolated unit tests without mounting UI elements.

### Example Hook structure:
```typescript
// useCounter.ts
export function useCounter(initialValue = 0) {
    const [counterValue, setCounterValue] = useState(initialValue);
    // ... all counter logic
    return {
        counterValue,
        increment,
        decrement,
        reset,
        // ... limit and input state
    };
}
```

---

## 6. Accessibility (a11y) ♿
* The input on line 75 lacks an associated `<label>` or `aria-label`. Screen readers won't know what this input is for.
* Add an `aria-label="Increment or decrement step value"` or a visible `<label htmlFor="...">`.
