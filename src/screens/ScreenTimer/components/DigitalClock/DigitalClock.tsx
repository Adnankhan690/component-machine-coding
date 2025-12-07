// import { useEffect, useState } from "react";

import { useEffect, useState } from "react";

// export default function DigitalClock() {
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//         setInterval(() => {
//             setCount((prev) => prev + 1);
//         })
//     }, []);

// 	return <div>{new Date().toLocaleTimeString()}</div>;
// }

export default function DigitalClock() {
	//Method 1: Using setInterval inside useEffect

	// const [count, setCount] = useState(0);

	// useEffect(() => {
	// 	setInterval(() => {
	// 		setCount((prev) => prev + 1);
	// 	}, 1000); //Million dollars can be lost due to this 1second interval, suppose when we come to the page
	//     // at 10:23:45:500, the first tick will be at 10:23:46:500 which is wrong, so we lost 500ms here
	//     // example 2: suppose we come at 10:23:45:900, then the first tick will be at 10:23:46:900, so we lost 900ms here
	// }, []);

	//Method 2: calculate time with precision, solves million dollar problem
	// const [, setTick] = useState(0);

	// useEffect(() => {
	// 	const preciseMilisecondsInterval = 1000 - new Date().getMilliseconds();

	// 	const intervalId = setInterval(() => {
	// 		setTick((tick) => tick + 1);
	// 	}, preciseMilisecondsInterval);

	// 	return () => clearInterval(intervalId);
	// }, []);

	//Method 3: Calculate time with precision and setTimeout, solves million dollar problem -> using setTimeout is better which will avoid UI flickering
	// const [_, setTime] = useState(new Date());

	// useEffect(() => {
	// 	const tick = () => {
	// 		setTime(new Date());
	// 		const preciseMilisecondsInterval = 1000 - new Date().getMilliseconds();
	// 		setTimeout(tick, preciseMilisecondsInterval);
	// 	};

	// 	const timeOutId = setTimeout(tick, 1000 - new Date().getMilliseconds());

	// 	return () => clearTimeout(timeOutId);
	// }, []);

	// Method 4: Using requestAnimationFrame - syncs with system FPS (typically 60fps)
	// This updates every frame (16.67ms at 60fps) for ultra-smooth animations
	const [, setTick] = useState(0);

	// useEffect(() => {
	// 	let animationFrameId: number;

	// 	const updateClock = () => {
	// 		setTick((prev) => prev + 1); // Force re-render
	// 		animationFrameId = requestAnimationFrame(updateClock);
	// 	};

	// 	animationFrameId = requestAnimationFrame(updateClock);

	// 	return () => cancelAnimationFrame(animationFrameId);
    // }, []);
    
    useEffect(() => {
        let animationFrameId: number;
        const updateClock = () => {
            setTick((prev) => prev + 1); // Force re-render
            animationFrameId = requestAnimationFrame(updateClock);
        }
        animationFrameId = requestAnimationFrame(updateClock);

        return () => cancelAnimationFrame(animationFrameId);

    }, [])

	const customDigitalClock = () => {
		const now = new Date();
		let hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const seconds = String(now.getSeconds()).padStart(2, "0");
		const miliSeconds = String(now.getMilliseconds()).padStart(3, "0");

		const meridian = Number(hours) >= 12 ? "PM" : "AM";
		hours =
			Number(hours) % 12 === 0
				? "12"
				: String(Number(hours) % 12).padStart(2, "0");

		return `${hours}:${minutes}:${seconds}:${miliSeconds} ${meridian}`;
	};

	return (
		<div>
			<div>{customDigitalClock()}</div>
			<div>
				{/* <p style={{maxWidth: "300px"}}>{performance.now()}</p> */}
			</div>
		</div>
	);
}

// performance.now() is a high-precision timer in JavaScript.

// Here’s the full explanation in a clean, simple way:

// ✅ What is performance.now()?

// performance.now() returns the number of milliseconds (with decimals) since the page started loading.

// Example:

// console.log(performance.now()); // 123.456789

// This means 123.456789 ms have passed since the page loaded.

// ⭐ HOW IT IS DIFFERENT FROM Date.now() or new Date().getTime()
// Timer	Returns	Accuracy	Starts Counting From
// Date.now()	Unix timestamp (integer, no decimals)	~1ms resolution	Jan 1, 1970
// +new Date()	Same as Date.now()	~1ms	Jan 1, 1970
// new Date().getTime()	Same as above	~1ms	Jan 1, 1970
// performance.now()	High-precision time (with decimals)	Microsecond precision (0.001ms)	Page load

// 📌 Example: Measuring exact function time
// const start = performance.now();

// for (let i = 0; i < 1_000_000; i++) {}

// const end = performance.now();

// console.log(`Time taken: ${end - start}ms`);

// You get output like:

// Time taken: 3.121899999983236 ms

// Very precise!
