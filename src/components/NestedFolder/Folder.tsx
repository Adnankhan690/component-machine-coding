import "./css/folder.css";
import { nestedFolderDataType } from "./Data/nestedFolderData";

interface FolderProps extends nestedFolderDataType {
	handleCollapse: (id: string) => void;
	onCreateFolder: (id: string) => void;
	onDeleteFolder:  (id: string) => void;
}

export default function Folder({
	id,
	isFolder,
	name,
	children,
	isCollapsed,
	handleCollapse,
    onCreateFolder,
    onDeleteFolder,
}: FolderProps) {
	return (
		<div className="folder-con">
			{/* {children && children?.length > 0 && (
				<button onClick={() => handleCollapse(id)}>
					{isCollapsed ? ">" : "V"}
				</button>
			)} */}
			{isFolder ? "📁" : "📄"} {name}
			<button onClick={() => onCreateFolder(id)}>+</button>
			<button onClick={() => onDeleteFolder(id)}>Delete</button>
		</div>
	);
}
