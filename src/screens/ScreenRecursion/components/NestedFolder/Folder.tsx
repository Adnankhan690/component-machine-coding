import "./folder.css";
import { ChevronDown, ChevronRight, File, FolderClosed } from "lucide-react";
import { FolderConfig } from "./constants";

interface FolderProps {
	folder: FolderConfig;
	onCollapse: (id: string) => void;
	onAdd: (id: string) => void;
	onDelete: (id: string) => void;
}

export default function Folder({
	folder: { isFolder, children, id, name, isCollapsed },
	onCollapse,
	onAdd,
	onDelete,
}: FolderProps) {
	const handleClick = (id: string) => {
		onCollapse(id);
	};
	return (
		<div>
			<div className="name-icon-con">
				{children &&
					children.length > 0 &&
					(!isCollapsed ? (
						<button className="collapse-btn" onClick={() => handleClick(id)}>
							<ChevronRight size={18} />
						</button>
					) : (
						<button className="collapse-btn">
							<ChevronDown onClick={() => handleClick(id)} size={18} />
						</button>
					))}
				{isFolder ? <FolderClosed size={18} /> : <File size={16} />}
				<p>{name}</p>
				{children && children.length > 0 && (
					<button onClick={() => onAdd(id)} className="action-btn">
						+
					</button>
				)}
				<button onClick={() => onDelete(id)} className="action-btn">
					-
				</button>
			</div>
		</div>
	);
}
