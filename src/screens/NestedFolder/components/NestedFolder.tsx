import "./nested-folder.css";
import { useState } from "react";
import { folders as FolderData, FolderType } from "../constants";
import { ChevronDown, ChevronUp, File, FolderArchive } from "lucide-react";

export default function NestedFolder() {
	const [folders, setFolders] = useState(FolderData);
    const [newFolder, setNewFolder] = useState("")

	const handleAddFolder = (id: string) => {
		setFolders((prevFolders) => {
			const newFolders = [...prevFolders];

			const addFolderRecursively = (folders: FolderType[]): FolderType[] => {
				return folders.map((folder) => {
					if (folder.id === id && folder.children) {
						return {
							...folder,
							children: [
								...folder?.children,
								{
									id: new Date().getTime(),
									name: `A${new Date().getTime()}`,
									isFolder: true,
									children: [],
								},
							],
						} as FolderType;
					}

					return {
						...folder,
						children: folder.children && addFolderRecursively(folder.children),
					};
				});
			};

			return addFolderRecursively(newFolders);
		});
	};

	const handleDeleteFolder = (id: string) => {
		setFolders((prevFolder) => {
			const newFolder = [...prevFolder];

			const deleteFolderRecursively = (folders: FolderType[]): FolderType[] => {
				return folders
					.filter((folder) => folder.id !== id)
					.map((folder) => ({
						...folder,
						children:
							folder.children && deleteFolderRecursively(folder.children),
					}));
			};

			return deleteFolderRecursively(newFolder);
		});
	};

	const handleToggleFolder = (id: string) => {
		setFolders((prevFolders) => {
			const newFolder = [...prevFolders];

			const toggleFolderRecursively = (folders: FolderType[]): FolderType[] => {
				return folders.map((folder) => {
					if (folder.id === id) {
						return {
							...folder,
							isCollapsed: !folder.isCollapsed,
						} as FolderType;
					}

					return {
						...folder,
						children:
							folder.children && toggleFolderRecursively(folder.children),
					};
				});
			};

			return toggleFolderRecursively(newFolder);
		});
	};

	return (
		<div className="nested-folder">
			{folders?.map((folder) => {
				return (
					<Folder
						onAddFolder={handleAddFolder}
						onDeleteFolder={handleDeleteFolder}
						onToggleFolder={handleToggleFolder}
						folder={folder}
						key={folder.id}
					/>
				);
			})}
		</div>
	);
}

function Folder({
	folder,
	onAddFolder,
	onDeleteFolder,
	onToggleFolder,
}: {
	folder: FolderType;
	onAddFolder: (id: string) => void;
	onDeleteFolder: (id: string) => void;
	onToggleFolder: (id: string) => void;
}) {
	const { name, children, isFolder, isCollapsed } = folder;

	return (
		<div className="folder-con">
			<div className="control-icon-con">
				<div className="folder-controls">
					{isFolder && (
						<button
							className="add-folder"
							onClick={() => onAddFolder(folder.id)}>
							+
						</button>
					)}
					<button
						className="delete-folder "
						onClick={() => onDeleteFolder(folder.id)}>
						-
					</button>

					{folder.children?.length !== 0 && isFolder && (
						<button onClick={() => onToggleFolder(folder.id)}>
							{isCollapsed ? (
								<ChevronUp size={16} />
							) : (
								<ChevronDown size={16} />
							)}
						</button>
					)}
				</div>

				<div className="name-icon-con">
					{isFolder ? <FolderArchive size={22} /> : <File size={20} />}
					{name}
				</div>
			</div>

			{isFolder && !isCollapsed && folder.children && (
				<div>
					{children?.map((child) => (
						<Folder
							folder={child}
							onAddFolder={onAddFolder}
							onDeleteFolder={onDeleteFolder}
							onToggleFolder={onToggleFolder}
							key={child.id}
						/>
					))}
				</div>
			)}
		</div>
	);
}
