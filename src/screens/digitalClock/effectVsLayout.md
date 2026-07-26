Viewed useDigitalClockV1.ts:1-42

The fundamental difference between `useEffect` and `useLayoutEffect` lies in **when they execute in relation to the browser's paint cycle.**

---

### ⏳ The Render & Paint Timeline

```
1. React Renders Component
2. React Updates Virtual DOM
3. DOM mutations are applied (in-memory)
│
├─► [useLayoutEffect fires synchronously] 
│   (State updates scheduled here run immediately, blocking the paint)
│
4. Browser Paints the screen (Pixels are drawn)
│
└─► [useEffect fires asynchronously] 
    (State updates scheduled here cause a subsequent render and a new paint)
```

---

### ⚖️ Detailed Comparison

| Feature | `useEffect` | `useLayoutEffect` |
| :--- | :--- | :--- |
| **Timing** | **Asynchronous:** Runs *after* the browser paints the screen. | **Synchronous:** Runs *before* the browser paints the screen. |
| **Main Thread** | **Non-blocking:** Yields control to the event loop so the page remains responsive. | **Blocking:** Halts browser execution until the effect code completes. |
| **Visuals** | Can cause **visual flickering** if you modify the DOM or layout properties inside it. | Prevents flickering by resolving updates before pixels are drawn. |
| **Usage Frequency** | Used for **99%** of tasks. | Used **rarely (1%)** for layout/visual adjustments. |

---

### 🛠️ When to Use Which?

#### Use **`useEffect`** (The Default)
Use this for any side-effects that do not require instant visual updates.
* Fetching API data.
* Setting up event listeners, timers, or intervals.
* Logging analytics.
* Updating state that doesn't directly shift layout properties on-screen.

#### Use **`useLayoutEffect`** (The Exception)
Use this only when you need to read or mutate the DOM **before** the user sees it to prevent layout shifts or visual jumps.
* **Tooltips & Popovers:** Measuring the size (`getBoundingClientRect()`) of a button to position a floating menu/tooltip next to it.
* **Scroll Position Reset:** Restoring scroll positions on navigation.
* **Layout Transitions:** Running immediate animations that must start exactly when an element is mounted.

---

### 💡 Visual Flickering Example
If you want to read a `div`'s width and set the position of another element based on that:
* **With `useEffect`:** React renders $\rightarrow$ Browser paints elements $\rightarrow$ `useEffect` reads width $\rightarrow$ Updates position $\rightarrow$ React re-renders $\rightarrow$ Browser repaints. **The user sees the element jump or flicker.**
* **With `useLayoutEffect`:** React renders $\rightarrow$ `useLayoutEffect` reads width $\rightarrow$ Updates position $\rightarrow$ React re-renders $\rightarrow$ Browser paints. **The user only sees the final, correctly positioned element.**