import "./css/folder.css";
import Folder from "./Folder";
import { nestedFolderDataType } from "./Data/nestedFolderData";
import { useCallback, useEffect } from "react";

interface NestedFolderProps {
	nestedFolderData: nestedFolderDataType[];
	setNestedFolderdata: React.Dispatch<
		React.SetStateAction<nestedFolderDataType[]>
	>;
}

export default function NestedFolder({
	setNestedFolderdata,
	nestedFolderData,
}: NestedFolderProps) {
	const cloneFolder = useCallback(
		(id: string, children: nestedFolderDataType[]): nestedFolderDataType[] => {
			return children.map((child) => {
				if (child.id === id) {
					return {
						...child,
						isCollapsed: !child.isCollapsed,
					};
				}
				return {
					...child,
					children: cloneFolder(id, child.children || []),
				};
			});
		},
		[]
	);

	const handleCollapse = (id: string) => {
		setNestedFolderdata((prevFolderData) => {
			return prevFolderData.map((folder) => {
				if (folder.id === id) {
					return {
						...folder,
						isCollapsed: !folder.isCollapsed,
					};
				}
				return { ...folder, children: cloneFolder(id, folder.children || []) };
			});
		});
	};

	const handleCreateFolder = (id: string) => {
		const isFolder = true;
		const newFolder = {
			id: new Date().getTime().toString(),
			isFolder,
			name: "New Folder",
			children: [],
			isCollapsed: false,
		};

		const createNestedFolder = (
			id: string,
			children: nestedFolderDataType[]
		): nestedFolderDataType[] => {
			return children.map((folder) => {
				if (folder.id === id) {
					return {
						...folder,
						children: [...folder.children, newFolder],
					};
				}

				return {
					...folder,
					children: createNestedFolder(id, folder.children),
				};
			});
		};

		setNestedFolderdata((prevFolderData) => {
			return prevFolderData.map((folder) => {
				if (folder.id === id) {
					return {
						...folder,
						children: [...folder.children, newFolder],
					};
				}
				return {
					...folder,
					children: createNestedFolder(id, folder.children),
				};
			});
		});

	};

	const handleDeleteFolder = (id: string) => {
		const deleteRecursively = (
			id: string,
			child: nestedFolderDataType[]
		): nestedFolderDataType[] => {
			return child.filter((folder) => folder.id !== id)
				.map((folder) => {
					return {
						...folder,
						children: deleteRecursively(id, folder.children),
				}
			})
		};

		setNestedFolderdata((prevFolderData) => {
			return prevFolderData.filter((folder) => folder.id !== id)
				.map((folder) => {
					return {
						...folder,
						children: deleteRecursively(id, folder.children),
				}
			})
		});
	};


	return (
		<div className="folder-parent-con">
			{nestedFolderData.map((folder) => (
				<div key={folder.id}>
					<Folder
						{...folder}
						handleCollapse={handleCollapse}
						onCreateFolder={handleCreateFolder}
						onDeleteFolder={handleDeleteFolder}
					/>
					{folder.children && !folder.isCollapsed && (
						<div className="nested-folder">
							<NestedFolder
								nestedFolderData={folder.children}
								setNestedFolderdata={setNestedFolderdata}
							/>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
