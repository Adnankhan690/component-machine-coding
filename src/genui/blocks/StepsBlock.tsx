import { isStr, list, obj } from "@/lib/genui-guards";

interface Step {
	id: string;
	title: string;
	detail: string;
}

export default function StepsBlock({ props }: { props: unknown }) {
	const { caption, steps } = obj(props);
	const entries = list<Step>(steps, { str: ["id", "title", "detail"] });
	if (!entries) return null;

	// Order is the whole point, so it is an <ol> and the number is rendered, not
	// implied by position on screen.
	return (
		<section className="space-y-3">
			{isStr(caption) && <p className="text-sm font-medium">{caption}</p>}
			<ol className="space-y-3">
				{entries.map((step, idx) => (
					<li key={step.id} className="flex gap-3">
						<span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums">
							{idx + 1}
						</span>
						<div className="space-y-0.5">
							<p className="text-sm font-medium">{step.title}</p>
							<p className="text-sm text-muted-foreground whitespace-pre-wrap">
								{step.detail}
							</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
