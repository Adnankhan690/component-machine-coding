import WithRaf from "./components/withRaf/WithRaf";
import WithTimeout from "./components/withTimeout1/WithTimeout";
import WithTimeout2 from "./components/withTimeout2/WithTimeout2";

export default function ScreenAnimationFrame() {
    return (
			<div>
				<WithTimeout />
            <WithTimeout2 />
            <WithRaf />

            <div>
                <h2>Explanation:</h2>
                <p>
                    In the WithTimeout component, we use setTimeout to update the position state every 0 milliseconds. This causes a re-render of the component each time the position changes, leading to a smooth animation as the circle moves across the screen.
                </p>
                <p>
                    In the WithRaf component, we use requestAnimationFrame to update the position state. requestAnimationFrame is optimized for animations and synchronizes with the browser's refresh rate, resulting in a smoother animation compared to setTimeout.
                    
                </p>
                <p>
                    Overall, using requestAnimationFrame is generally preferred for animations in web applications due to its efficiency and smoother performance.
                </p>
            </div>
			</div>
		);
}