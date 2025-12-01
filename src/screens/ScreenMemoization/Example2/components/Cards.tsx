import "./cards.css";

/* 1  */
// export default function Cards({
// 	getCardDetails,
// 	descrease,
// }: {
// 	getCardDetails: () => void;
// 	descrease: () => void;
//     }) {

export default function Cards({
	getCardDetails,
}: {
	getCardDetails: () => void;
}) {
	console.log("Cards component is rendered from Example2   ✨👀");

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

			{/* 1  */}
			{/* <div>
				<button onClick={descrease}>Decrease Score </button>
			</div> */}
		</div>
	);
}
