import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { list, obj } from "./guards";

interface Crumb {
	id: string;
	label: string;
}

export default function BreadcrumbBlock({ props }: { props: unknown }) {
	const path = list<Crumb>(obj(props).path, { str: ["id", "label"] });
	if (!path) return null;

	// Rendered as text, never as links: the model has no way to know a real href,
	// so asking it for one would only invite a plausible-looking invention.
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{path.map((crumb, idx) => (
					<Fragment key={crumb.id}>
						<BreadcrumbItem>
							<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
						</BreadcrumbItem>
						{idx < path.length - 1 && <BreadcrumbSeparator />}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
