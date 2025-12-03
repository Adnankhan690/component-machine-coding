import { useState } from "react";

export default function useCycle<T>(...args: T[]) {
	console.log("render");
	const [index, setIndex] = useState(0);

	const cycle = () => {
		console.log("clicked");
		setIndex((prevIndex) => (prevIndex + 1) % args.length);
	};

	return {
		value: args[index],
		cycle,
	};
}
