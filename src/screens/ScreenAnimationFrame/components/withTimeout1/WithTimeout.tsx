import { useEffect, useState } from "react";
import "./animation-frame.css";

export default function WithTimeout() {
    const [position, setPosition] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPosition((prev) => {
                if (prev >= 1000) {
                    return 0;
                } 
                return prev + 0.01;
            });
        }, 0);

        return () => clearTimeout(timer);
    }, [position]);
    
    return (
            <div>
                <div className="circle" style={{ left: `${position}px` }}>
                    <p className="text">time out</p>
                </div>
            </div>
        );
}