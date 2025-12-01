import "./cards.css";

export interface DataProps {
	name: string;
}

interface CardsProps {
	children?: React.ReactNode;
}

/* 1  */
// export default function Cards({ data }: { data: DataProps }) {

/* 2  */
// export default function Cards({ children }: CardsProps) {

export default function Cards() {
	console.log("Cards component is rendered from Example1  ✨👀");

	return (
		<div className="cards-container">
			<div>Image</div>
			<div className="card-info">
				<p>Card Title</p>
				<p>{/* {data.name} */}</p>
				<p>card description</p>
			</div>
            
			{/* 2  */}
			{/* {children} */}
		</div>
	);
}
