# Use a Standard "3-Block" File Structure

For every single problem, create a file (e.g., `debounce.js`) structured exactly like this:

```js
// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does debounce do?
// A: It groups multiple sequential calls into a single execution.
// Edge cases to remember: Clearing the previous timeout, preserving 'this' context and arguments.

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myDebounce(func, delay) {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
// Write a tiny, runnable log script so you can test it instantly.
const log = () => console.log('Executed!');
const process = myDebounce(log, 300);
process(); process(); process(); // Should only log once after 300ms
```
