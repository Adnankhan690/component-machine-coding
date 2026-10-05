import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { list, obj } from "./guards";

interface TabItem {
	id: string;
	title: string;
	content: string;
}

export default function TabsBlock({ props }: { props: unknown }) {
	const tabs = list<TabItem>(obj(props).tabs, { str: ["id", "title", "content"] });
	if (!tabs) return null;

	// Which tab is open is interaction state, so it lives inside the component.
	// `defaultValue` keeps it uncontrolled — the model never names an active tab.
	return (
		<Tabs defaultValue={tabs[0].id}>
			<TabsList>
				{tabs.map((tab) => (
					<TabsTrigger key={tab.id} value={tab.id}>
						{tab.title}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent
					key={tab.id}
					value={tab.id}
					className="rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-wrap">
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}
