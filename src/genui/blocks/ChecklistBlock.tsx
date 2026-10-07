import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { isStr, list, obj } from "@/lib/genui-guards";

interface Task {
	id: string;
	label: string;
	hint?: string;
}

export default function ChecklistBlock({ props }: { props: unknown }) {
	const { title, items } = obj(props);
	const tasks = list<Task>(items, { str: ["id", "label"], optStr: ["hint"] });

	// Which boxes are ticked is the reader's business, so it stays in the component.
	// Hooks run before the early return, or the hook order changes between renders.
	const [done, setDone] = useState<string[]>([]);

	if (!tasks) return null;

	const toggle = (id: string) =>
		setDone((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

	return (
		<section className="space-y-3">
			{isStr(title) && (
				<p className="text-sm font-medium">
					{title}{" "}
					<span className="text-muted-foreground tabular-nums">
						({done.length}/{tasks.length})
					</span>
				</p>
			)}
			<ul className="space-y-2">
				{tasks.map((task) => (
					<li key={task.id} className="flex items-start gap-2.5">
						<Checkbox
							id={task.id}
							checked={done.includes(task.id)}
							onCheckedChange={() => toggle(task.id)}
							className="mt-0.5"
						/>
						<div className="grid gap-0.5">
							<Label
								htmlFor={task.id}
								className={done.includes(task.id) ? "text-muted-foreground line-through" : ""}>
								{task.label}
							</Label>
							{isStr(task.hint) && task.hint !== "" && (
								<p className="text-xs text-muted-foreground">{task.hint}</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
