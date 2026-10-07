import { useState } from "react";
import { ChevronRight, File, Folder } from "lucide-react";
import { isStr, list, obj } from "@/lib/genui-guards";

interface Node {
	id: string;
	parentId: string;
	label: string;
}

/**
 * The model supplies a FLAT list with a parent pointer, never a nested tree.
 * Nesting is rebuilt here. That keeps the schema one level deep — every extra
 * level is another level the model can get subtly wrong, and it costs tokens on
 * every request.
 */
const childrenOf = (nodes: Node[], parentId: string) =>
	nodes.filter((node) => (node.parentId || "") === parentId);

function Branch({ nodes, parentId, depth }: { nodes: Node[]; parentId: string; depth: number }) {
	const items = childrenOf(nodes, parentId);
	if (items.length === 0) return null;

	return (
		<ul className={depth === 0 ? "space-y-0.5" : "ml-4 space-y-0.5 border-l pl-2"}>
			{items.map((node) => (
				<Leaf key={node.id} nodes={nodes} node={node} depth={depth} />
			))}
		</ul>
	);
}

function Leaf({ nodes, node, depth }: { nodes: Node[]; node: Node; depth: number }) {
	const hasChildren = childrenOf(nodes, node.id).length > 0;
	const [open, setOpen] = useState(true);

	return (
		<li>
			<button
				type="button"
				disabled={!hasChildren}
				aria-expanded={hasChildren ? open : undefined}
				onClick={() => setOpen((prev) => !prev)}
				className="flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left text-sm hover:bg-muted disabled:hover:bg-transparent">
				{hasChildren ? (
					<ChevronRight className={`size-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
				) : (
					<span className="size-3.5" />
				)}
				{hasChildren ? (
					<Folder className="size-3.5 text-muted-foreground" />
				) : (
					<File className="size-3.5 text-muted-foreground" />
				)}
				{node.label}
			</button>
			{hasChildren && open && <Branch nodes={nodes} parentId={node.id} depth={depth + 1} />}
		</li>
	);
}

export default function TreeBlock({ props }: { props: unknown }) {
	const { caption, nodes } = obj(props);
	const parsed = list<Node>(nodes, { str: ["id", "label"], optStr: ["parentId"] });
	if (!parsed) return null;

	// A parentId pointing at a missing node would silently hide that subtree, and
	// a node parented to itself would recurse forever. Reroot both at the top.
	const ids = new Set(parsed.map((node) => node.id));
	const safe = parsed.map((node) => ({
		...node,
		parentId: node.parentId && node.parentId !== node.id && ids.has(node.parentId)
			? node.parentId
			: "",
	}));

	return (
		<section className="space-y-2">
			{isStr(caption) && <p className="text-sm font-medium">{caption}</p>}
			<div className="rounded-lg border p-2">
				<Branch nodes={safe} parentId="" depth={0} />
			</div>
		</section>
	);
}
