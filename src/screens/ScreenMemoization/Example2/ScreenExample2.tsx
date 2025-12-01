import "./example-two.css";
import { memo, useCallback, useState } from "react";
import Cards from "./components/Cards";

const MemoizedCard = memo(Cards);

export default function ScreenExanmpleTwo() {
	const [score, setScore] = useState(100);

	const handleClick = () => {
		setScore(score + 100);
	};

	// UnComment this and comment the useCallback version to see the difference in re-renders -> check logs
	// const getCardDetails = () => {
	// 	console.log("Card Details is logged 🔅");
	// }
	const getCardDetails = useCallback(() => {
		console.log("Card Details is logged 🔅");
	}, []);

	/* 1  */
	const decrementScore = useCallback(() => {
		setScore((prevScore) => prevScore - 50);
	}, [score]);

	return (
		<div className="example-screen">
			<h2>ScreenMemoization Example 2</h2>
			<p>
				This is the ScreenMemoization component shows useCallback to memoize.
			</p>
			<button onClick={handleClick}>Increase Score {score}</button>
			{/* 1  */}
			{/* <MemoizedCard
				getCardDetails={getCardDetails}
				descrease={decrementScore}
			/> */}

			<MemoizedCard
				getCardDetails={getCardDetails}
			/>
		</div>
	);
}

/*
	🟣 4. Memoizing a function used inside events is unnecessary
*/

/*
	🟣 5. functions inside useEffect dependencies

	This is important:

	useEffect(() => {
	doSomething();
	}, [someFn]);

	If you don’t use useCallback, this effect runs on every render.
*/
