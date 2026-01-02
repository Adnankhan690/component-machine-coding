import { useEffect, useState } from "react";
import "./with-raf.css";

export default function WithRaf() {
    const [position, setPosition] = useState(0);

    useEffect(() => {
        requestAnimationFrame(() => {
            setPosition((prev) => {
                if (prev >= 1000) {
                    return 0;
                }
                return prev + 5;
            });
        })
    }, [position]);

    return (
			<div className="raf-circle" style={{ left: `${position}px` }}>
				<p className="text">Raf</p>
			</div>
		);
}