import "./nested-checkbox.css";
import Checkbox from "./components/Checkbox";

export interface Checkbox {
	id: string;
	title: string;
	description?: string;
	isChecked: boolean;
	child: Checkbox[] | [];
}

const nestedCheckbox: Checkbox[] = [
	{
		id: "1",
		title: "Hello world",
		description: "randowm des",
		isChecked: true,
		child: [
			{
				id: "2",
				title: "Jurasic world",
				description: "dinasour",
				isChecked: false,
				child: [],
			},
			{
				id: "4",
				title: "Dream world",
				description: "biscuit",
				isChecked: false,
				child: [
					{
						id: "5",
						title: "Daemon Slayer",
						description: "kimetsu",
						isChecked: false,
						child: [
							{
								id: "6",
								title: "JJK",
								description: "itadori",
								isChecked: false,
								child: [],
							},
							{
								id: "7",
								title: "Naruto",
								description: "Naruto",
								isChecked: false,
								child: [],
							},
						],
					},
				],
			},
		],
	},
	{
		id: "3",
		title: "baldwin king",
		description: "England",
		isChecked: false,
		child: [],
	},
];


export default function NestedCheckbox() {
	return (
		<section>
			<h1>Nested Checkbox</h1>
			{/* Implementation goes here. */}

			<div className="main-con">
				<Checkbox data={nestedCheckbox} />
			</div>
		</section>
	);
}
