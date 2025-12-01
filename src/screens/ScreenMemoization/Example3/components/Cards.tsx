import { useMemo } from "react";
import "./cards.css";

const calCulateSomeExpensiveValue = () => {
	// simulate expensive calculation
	console.log("Calculating expensive value... 🔥");
};

export default function Cards({
	getCardDetails,
}: {
	getCardDetails: () => void;
}) {
	console.log("Cards component is rendered from Example3   ✨👀");


	//uncomment below line and comment useMemo to see the difference in re-renders -> check logs
	// const expensiveValue =  calCulateSomeExpensiveValue();
	const expensiveValue = useMemo(() => {
		return calCulateSomeExpensiveValue();
	}, []);

	return (
		<div className="cards-container">
			<div>Image</div>
			<div className="card-info">
				<p>Card Title</p>
				<p>epsom salt </p>
			</div>
			<div>
				<button onClick={getCardDetails}>Get Card Details</button>
			</div>
		</div>
	);
}
