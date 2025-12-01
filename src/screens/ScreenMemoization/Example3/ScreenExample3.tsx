import "./example-three.css";
import { memo, useCallback, useState } from "react";
import Cards from "./components/Cards";

const MemoizedCard = memo(Cards);

// in this example focus on expensive calculations inside useMemo and check for log console.log("Calculating expensive value... 🔥");

export default function ScreenExanmple3() {
	const [score, setScore] = useState(100);

	const handleClick = () => {
		setScore(score + 100);
	};

	// UnComment this and comment the useCallback version to see the difference in re-renders -> check logs
	const getCardDetails = () => {
		console.log("Card Details is logged 🔅");
	};
	// const getCardDetails = useCallback(() => {
	// 	console.log("Card Details is logged 🔅");
	// }, []);

	return (
		<div className="example-screen">
			<h2>ScreenMemoization Example 3</h2>
			<p>This is the ScreenMemoization component shows useMemo to memoize.</p>
			<button onClick={handleClick}>Increase Score {score}</button>
			<MemoizedCard getCardDetails={getCardDetails} />
		</div>
	);
}

/*
	🎯 Why does useMemo exist?

	In React, functions re-run on every render.
	But some values are expensive to compute, such as:

	filtering a large list

	sorting heavy arrays

	computing derived states

	running expensive loops/operations

	Without useMemo, these expensive computations run every time the component re-renders, even if not needed.

	➡️ useMemo prevents unnecessary recalculation.
*/

/*
	❌ When NOT to use useMemo?
	❌ When the computation is cheap

	Simple expressions do NOT need memoization:

	const doubled = count * 2; // No need for useMemo

	❌ If dependencies change every render

	If your deps change, useMemo re-runs anyway → zero performance benefit.

	❌ When premature optimization makes code harder to maintain

	Too much useMemo produces complex code for little gain.
*/

/*
	🟣 2. Stale values if you forget dependencies

	Incorrect:

	const bigList = useMemo(() => processList(list), []);


	list is missing in deps → processList() only runs once
	→ uses stale data

	Correct:

	useMemo(() => processList(list), [list]);
*/

/*
	🟣 5. useMemo should not be used for side effects

	This is WRONG:

	useMemo(() => {
	console.log("Running side effect");
	}, [x]);

	Side effects belong in useEffect, not useMemo.
*/
/*
 */
