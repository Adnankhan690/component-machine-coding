import { Separator } from "@/components/ui/separator";
import { Fragment } from "react";
import { isStr, list, obj } from "./guards";

interface Pair {
	id: string;
	key: string;
	value: string;
}

export default function KeyValueBlock({ props }: { props: unknown }) {
	const { title, pairs } = obj(props);
	const entries = list<Pair>(pairs, { str: ["id", "key", "value"] });
	if (!entries) return null;

	return (
		<section className="space-y-2">
			{isStr(title) && <p className="text-sm font-medium">{title}</p>}
			<dl className="rounded-lg border px-3">
				{entries.map((entry, idx) => (
					<Fragment key={entry.id}>
						{idx > 0 && <Separator />}
						<div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 py-2.5 text-sm">
							<dt className="text-muted-foreground">{entry.key}</dt>
							<dd>{entry.value}</dd>
						</div>
					</Fragment>
				))}
			</dl>
		</section>
	);
}
