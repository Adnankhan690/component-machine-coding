import "./folder.css";
import {
	ChevronDown,
	ChevronRight,
	File,
	FolderClosed,
	FolderOpen,
	Plus,
	Trash2,
} from "lucide-react";
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
	const handleCollapse = (e: React.MouseEvent) => {
		e.stopPropagation();
		onCollapse(id);
	};

	const handleAdd = (e: React.MouseEvent) => {
		e.stopPropagation();
		onAdd(id);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete(id);
	};

	return (
		<div className="folder-row" onClick={() => isFolder && onCollapse(id)}>
			<div className="left-section">
				<span className="chevron-icon">
					{isFolder && children && children.length > 0 ? (
						isCollapsed ? (
							<div
								role="button"
								tabIndex={0}
								onClick={handleCollapse}
								onKeyDown={(e) =>
									e.key === "Enter" && handleCollapse(e as any)
								}>
								<ChevronDown size={16} />
							</div>
						) : (
							<div
								role="button"
								tabIndex={0}
								onClick={handleCollapse}
								onKeyDown={(e) =>
									e.key === "Enter" && handleCollapse(e as any)
								}>
								<ChevronRight size={16} />
							</div>
						)
					) : (
						<span className="spacer" />
					)}
				</span>
				<span className="type-icon">
					{isFolder ? (
						isCollapsed ? (
							<FolderOpen size={18} color="#60a5fa" />
						) : (
							<FolderClosed size={18} color="#60a5fa" />
						)
					) : (
						<File size={16} color="#9ca3af" />
					)}
				</span>
				<span className="folder-name">{name}</span>
			</div>

			<div className="folder-actions">
				{isFolder && (
					<button onClick={handleAdd} className="action-btn add-btn">
						<Plus size={14} />
					</button>
				)}
				<button onClick={handleDelete} className="action-btn delete-btn">
					<Trash2 size={14} />
				</button>
			</div>
		</div>
	);
}
