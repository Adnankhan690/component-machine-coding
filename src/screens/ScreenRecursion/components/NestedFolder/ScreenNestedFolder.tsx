import { useEffect, useState } from "react";
import { FolderConfig, folderConfig } from "./constants";
import NestedFolder from "./NestedFolder";

export default function ScreenNestedFolder() {
	const [nestedFolder, setNestedFolder] = useState(folderConfig);

	const handleCollapse = function collapse(id: string) {
		setNestedFolder((prev) => {
			function updateTreee(nodes: FolderConfig[]): FolderConfig[] {
				return nodes.map((node) => {
					if (node.id === id) {
						return {
							...node,
							isCollapsed: !node.isCollapsed,
						};
					}

					return {
						...node,
						children: node.children ? updateTreee(node.children) : [],
					};
				});
			}
			return updateTreee(prev);
		});
	};

	const handleAddNode = function add(id: string) {
		setNestedFolder((prev) => {
			function updateTree(nodes: FolderConfig[]): FolderConfig[] {
				return nodes.map((node) => {
					if (node.id === id) {
						const newNode: FolderConfig = {
							id: new Date().getTime().toString(),
							name: "component",
							isFolder: true,
							isCollapsed: true,
							children: [],
						};

						return {
							...node,
							children: [...node.children, { ...newNode }],
						};
					}

					return {
						...node,
						children: node.children ? updateTree(node.children) : [],
					};
				});
			}

			return updateTree(prev);
		});
	};

	const handleDeleteNode = function deleteNode(id: string) {
		setNestedFolder((prev) => {
			function updateTree(nodes: FolderConfig[]): FolderConfig[] {
				return nodes
					.map((node) => {
						let child =
							updateTree(node.children);

						return {
							...node,
							children: child,
						};
					})
					.filter((node) => node.id !== id);
			}

			return updateTree(prev);
		});
	};

	useEffect(() => {
		console.log(nestedFolder);
	}, []);

	return (
		<div>
			<NestedFolder
				onDelete={handleDeleteNode}
				onAdd={handleAddNode}
				onCollapse={handleCollapse}
				folderConfig={nestedFolder}
			/>
		</div>
	);
}
