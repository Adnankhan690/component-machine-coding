Edited stop-watch-v2.tsx
Edited useStopWatchV2.ts
Edited useStopWatchV2.ts
Viewed stop-watch-v2.tsx:2-23

### 💡 The Core Issue: How `useRef` Works in React

In React, **changing the value of a `ref` (like `intervalRef.current`) does NOT trigger a re-render of the component.** 

Because `intervalRef.current` changing from `null` to an interval ID is a side-effect that doesn't trigger a render cycle, the DOM remains stale:
1. **When you click "Start":** `intervalRef.current` is set to the interval ID. However, the DOM doesn't update immediately. The "Start" button only becomes disabled 100ms later when the first tick of `setTime` triggers a re-render.
2. **When you click "Pause":** `intervalRef.current` is set to `null` and the interval is cleared. Because `setTime` is no longer firing and a ref change doesn't trigger a re-render, **the component never re-renders after pausing**. Thus, the buttons remain stuck in their "running" visual state (Start disabled, Pause/Reset enabled).

---

### 🛠️ The Solution: Use React State to Track Running Status

To make the UI update instantly when starting or pausing, you should introduce an `isRunning` state in your hook. React will then handle the re-render automatically.

Here is the corrected implementation for both files:

#### 1. Update [useStopWatchV2.ts](file:///Users/adnan/Desktop/component-machine-coding/components/src/screens/StopWatch/hooks/useStopWatchV2.ts)
```typescript
import { useState, useRef } from "react";

export default function useStopWatchV2() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false); // Track running state in React state
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = () => {
        if (intervalRef.current) return;
        setIsRunning(true); // Triggers immediate re-render
        const startDate = Date.now() - time;

        intervalRef.current = setInterval(() => {
            setTime(Date.now() - startDate);
        }, 10);
    }

    const pause = () => {
        if (!intervalRef.current) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false); // Triggers immediate re-render
    }

    const reset = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTime(0);
        setIsRunning(false); // Triggers immediate re-render
    }

    const formatTime = () => {
        const ms = String(time % 1000).padStart(3, '0');
        const sec = String(Math.floor((time / 1000)) % 60).padStart(2, '0');
        const min = String(Math.floor(time / (60 * 1000)) % 60).padStart(2, '0');
        const hr = String(Math.floor(time / (60 * 60 * 1000)) % 24).padStart(2, '0');
        const day = String(Math.floor(time / (24 * 60 * 60 * 1000)) % 365).padStart(2, '0');

        return `${day}: ${hr}: ${min}: ${sec}: ${ms}`
    }

    return {
        time: formatTime(),
        isRunning, // Return isRunning state instead of intervalRef
        start,
        pause,
        reset,
    }
}
```

#### 2. Update [stop-watch-v2.tsx](file:///Users/adnan/Desktop/component-machine-coding/components/src/screens/StopWatch/components/stop-watch-v2.tsx)
```tsx
import useStopWatchV2 from "../hooks/useStopWatchV2";

export default function StopWatchV2() {
    const {
        time,
        start,
        pause,
        reset,
        isRunning, // Consume the isRunning state
    } = useStopWatchV2();

    return (
        <div>
            <p>{time}</p>
            <div>
                <button disabled={isRunning} onClick={start}>start</button>
                <button disabled={!isRunning} onClick={pause}>pause</button>
                <button disabled={time === "00: 00: 00: 00: 000" && !isRunning} onClick={reset}>reset</button>
            </div>
        </div>
    )
}
```