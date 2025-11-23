import { useState } from "react";
import Child from "./Child";

//This example demonstrates React memo for preventing unnecessary re-renders of Child component
// 2.

export default function Parent() {
    const [count, setCount] = useState(0);
    const someDummyData = "Hello from Parent Component";

    return (
        <div>
            <h1>Parent Component</h1>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <p>Count: {count}</p>
            <Child count={count} />
        </div>
    );
}