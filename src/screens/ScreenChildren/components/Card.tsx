import { useState } from "react";

interface CardProps {
    children?: React.ReactNode;
}

export default function Card({ children }: CardProps) {
    const [toggled, setToggled] = useState(false);

    console.log("re-rendered");
    

    return (
        <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
            <h2>Card Title</h2>
            <button onClick={() => setToggled(!toggled)}>{toggled ? "Hide" : "Show"}</button>
            {children}
        </div>
    );
}