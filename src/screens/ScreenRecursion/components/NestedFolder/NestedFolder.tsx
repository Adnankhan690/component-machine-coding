import "./nested-folder.css";
import { FolderConfig } from "./constants";
import Folder from "./Folder";

interface NestedFolderProps {
	folderConfig: FolderConfig[];
	onCollapse: (id: string) => void;
	onAdd: (id: string) => void;
	onDelete: (id: string) => void;
}

export default function NestedFolder({
	folderConfig,
	onCollapse,
	onAdd,
	onDelete,
}: NestedFolderProps) {
	return (
		<div className="nested-folder-con">
			{folderConfig.map((folder) => {
				return (
					<div className="nested-folderr">
						<Folder
							onAdd={onAdd}
							onDelete={onDelete}
							onCollapse={onCollapse}
							folder={folder}
						/>
						{folder.children && folder.isCollapsed && (
							<NestedFolder
								onDelete={onDelete}
								onAdd={onAdd}
								onCollapse={onCollapse}
								folderConfig={folder.children}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
