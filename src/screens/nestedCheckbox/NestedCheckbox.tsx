import "./nested-checkbox.css";
import Checkbox from "./components/Checkbox";
import { useState } from "react";

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


// One traversal does both directions, because every recursive call has two
// moments: before it recurses, and after.
//
//   DESCENDING  `force` carries the clicked node's value down to its subtree.
//               null -> still searching. A parameter, not a closure variable,
//               so it unwinds with the stack and cannot leak into siblings.
//
//   ASCENDING   `child` is already final here, so a parent derives itself from
//               it. A node with children never owns its checked state: it is
//               checked exactly when every child is. Only leaves hold a value.
//
// `id` matching nothing is a valid call: no node is forced, every parent is
// re-derived from its children. That is how the seed data gets normalised.
const applyToggle = (
	data: Checkbox[],
	id: string,
	isChecked: boolean,
	force: boolean | null,
): Checkbox[] => {
	return data.map((box: Checkbox) => {
		const next = force ?? (box.id === id ? isChecked : null); // on the way down
		const child = applyToggle(box.child, id, isChecked, next);

		return {
			...box,
			isChecked:
				child.length > 0
					? child.every((c) => c.isChecked) // on the way up
					: (next ?? box.isChecked), // leaf: forced, or left alone
			child,
		};
	});
};

// No node carries an empty id, so this forces nothing and only derives parents.
const NO_CLICK = "";

const addNestedCheck = (
	data: Checkbox[],
	force: boolean | null,
	id: string,
	isChecked: boolean,
): Checkbox[] => {

	return data.map((box) => {
		const next = force ?? (box.id === id ? isChecked : null);
		const children = addNestedCheck(box.child, next, id, isChecked);

		return {
			...box,
			child: children,
			isChecked: children.length > 0 ? children.every((ele) => ele.isChecked) : (next ?? box.isChecked)
		}
	})
};

export default function NestedCheckbox() {
	// The seed data has a checked parent with unchecked children, so derive it
	// once up front rather than rendering a contradiction until the first click.
	const [checkbox, setCheckbox] = useState<Checkbox[]>(() =>
		applyToggle(nestedCheckbox, NO_CLICK, false, null),
	);

	// const handleToggle = (
	// 	id: string,
	// 	e: React.ChangeEvent<HTMLInputElement>,
	// ) => {
	// 	const isChecked = e.target.checked;

	// 	setCheckbox((prev) => applyToggle(prev, id, isChecked, null));
	// };





	const handleToggle = (id: string, e :React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;

		setCheckbox((prev) => addNestedCheck(prev, null, id, isChecked));
	}
	
	return (
		<section>
			<h1>Nested Checkbox</h1>
			{/* Implementation goes here. */}

			<div className="main-con">
				<Checkbox data={checkbox} onToggle={handleToggle} />
			</div>
		</section>
	);
}
