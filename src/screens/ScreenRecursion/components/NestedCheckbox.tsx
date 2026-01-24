import { useState } from "react";
import { Config, config as CheckboxConfig } from "../constants";
import CheboxContainer from "./CheboxContainer";

// https://chatgpt.com/c/696fba9a-116c-8320-920f-60e61dc86278
// give last-2 prompts a read

function cascade(nodes: Config[], value: boolean): Config[] | undefined {
	return nodes.map((item) => {
		return {
			...item,
			value,
			children: item.children ? cascade(item.children, value) : undefined,
		};
	});
}

export default function NestedCheckbox() {
	const [config, setConfig] = useState<Config[]>(CheckboxConfig);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		id: string,
	) => {
		console.log(id);
		const targetId = id;

		const value = e.target.checked;
		setConfig((prev) => {
			// function recurse(checkboxData: Config[]): Config[] {
			// 	return checkboxData.map((item) => {
			// 		if (item.id === id) {
			// 			return {
			// 				...item,
			// 				value,
			// 				children: item.children ? cascade(item.children, value) : [],
			// 			};
			// 		}
			// 		if (item.children) {
			// 			return {
			// 				...item,
			// 				children: item.children ? recurse(item.children) : [],
			// 			};
			// 		}
			// 		return item;
			// 	});
			// }


			function updateTree(
				nodes: Config[],
				targetId: string,
				value: boolean,
			): Config[] {
				return nodes.map((node) => {
					// First: update children
					let updatedChildren = node.children
						? updateTree(node.children, targetId, value)
						: undefined;

					// Second: update this node if it was clicked
					let updatedValue = node.id === targetId ? value : node.value;

					// Third: cascade down if clicked
					if (node.id === targetId && updatedChildren) {
						updatedChildren = cascade(updatedChildren, value);
					}

					// Fourth: auto-check parent if all children are checked
					if (updatedChildren && updatedChildren.length > 0) {
						updatedValue = updatedChildren.every((child) => child.value);
					}

					return {
						...node,
						value: updatedValue,
						children: updatedChildren,
					};
				});
			}

			return updateTree(prev, id, value);
		});
	};
	return (
		<div>
			NestedCheckbox
			<div>
				<CheboxContainer config={config} onChange={handleInputChange} />
			</div>
		</div>
	);
}

// function updateTree(
// 	nodes: Config[],
// 	targetId: string,
// 	value: boolean,
// ): Config[] {
// 	return nodes.map((node) => {
// 		// First: update children
// 		let updatedChildren = node.children
// 			? updateTree(node.children, targetId, value)
// 			: undefined;

// 		// Second: update this node if it was clicked
// 		let updatedValue = node.id === targetId ? value : node.value;

// 		// Third: cascade down if clicked
// 		if (node.id === targetId && updatedChildren) {
// 			updatedChildren = cascade(updatedChildren, value);
// 		}

// 		// Fourth: auto-check parent if all children are checked
// 		if (updatedChildren && updatedChildren.length > 0) {
// 			updatedValue = updatedChildren.every((child) => child.value);
// 		}

// 		return {
// 			...node,
// 			value: updatedValue,
// 			children: updatedChildren,
// 		};
// 	});
// }
