import type { ComponentType } from "react";
// These five shadcn components carry their own generative-UI entry point, so the
// registry points straight at them instead of at a wrapper in this folder.
import { AlertBlock } from "@/components/ui/alert";
import { AlertDialogBlock } from "@/components/ui/alert-dialog";
import { AspectRatioBlock } from "@/components/ui/aspect-ratio";
import { AttachmentBlock } from "@/components/ui/attachment";
import { AvatarBlock } from "@/components/ui/avatar";
import AccordionBlock from "./blocks/AccordionBlock";
import BadgesBlock from "./blocks/BadgesBlock";
import BarChartBlock from "./blocks/BarChartBlock";
import BreadcrumbBlock from "./blocks/BreadcrumbBlock";
import CalendarBlock from "./blocks/CalendarBlock";
import CardsBlock from "./blocks/CardsBlock";
import CarouselBlock from "./blocks/CarouselBlock";
import ChecklistBlock from "./blocks/ChecklistBlock";
import CollapsibleBlock from "./blocks/CollapsibleBlock";
import CommandListBlock from "./blocks/CommandListBlock";
import ConversationBlock from "./blocks/ConversationBlock";
import EmptyBlock from "./blocks/EmptyBlock";
import GlossaryBlock from "./blocks/GlossaryBlock";
import ItemListBlock from "./blocks/ItemListBlock";
import KeyValueBlock from "./blocks/KeyValueBlock";
import LineChartBlock from "./blocks/LineChartBlock";
import ProgressBlock from "./blocks/ProgressBlock";
import ProsConsBlock from "./blocks/ProsConsBlock";
import QuizBlock from "./blocks/QuizBlock";
import ShareBarBlock from "./blocks/ShareBarBlock";
import ShortcutsBlock from "./blocks/ShortcutsBlock";
import StatsBlock from "./blocks/StatsBlock";
import StepsBlock from "./blocks/StepsBlock";
import TableBlock from "./blocks/TableBlock";
import TabsBlock from "./blocks/TabsBlock";
import TimelineBlock from "./blocks/TimelineBlock";
import TreeBlock from "./blocks/TreeBlock";
import {
	SHOW_ACCORDION,
	SHOW_ALERT,
	SHOW_ASPECT_RATIO,
	SHOW_BADGES,
	SHOW_BAR_CHART,
	SHOW_BREADCRUMB,
	SHOW_CALENDAR,
	SHOW_CARDS,
	SHOW_CAROUSEL,
	SHOW_CHECKLIST,
	SHOW_COLLAPSIBLE,
	SHOW_COMMAND_LIST,
	SHOW_CONFIRM_DIALOG,
	SHOW_CONVERSATION,
	SHOW_EMPTY,
	SHOW_FILE_LIST,
	SHOW_GLOSSARY,
	SHOW_ITEM_LIST,
	SHOW_KEY_VALUE,
	SHOW_LINE_CHART,
	SHOW_PEOPLE,
	SHOW_PROGRESS,
	SHOW_PROS_CONS,
	SHOW_QUIZ,
	SHOW_SHARE_BAR,
	SHOW_SHORTCUTS,
	SHOW_STATS,
	SHOW_STEPS,
	SHOW_TABLE,
	SHOW_TABS,
	SHOW_TIMELINE,
	SHOW_TREE,
} from "./tools";

export interface UiBlock {
	id: string;
	name: string;
	props: unknown;
}

/**
 * Tool name -> component. Each block validates its own props at its boundary:
 * `strict: true` is Anthropic-only, Gemini has no equivalent, and the type
 * assertions inside the blocks are compile-time claims about data that arrived
 * at runtime over HTTP. A bad block drops out; it never blanks the page.
 */
const BLOCKS: Record<string, ComponentType<{ props: unknown }>> = {
	[SHOW_TABLE]: TableBlock,
	[SHOW_ACCORDION]: AccordionBlock,
	[SHOW_TABS]: TabsBlock,
	[SHOW_ALERT]: AlertBlock,
	[SHOW_CARDS]: CardsBlock,
	[SHOW_CAROUSEL]: CarouselBlock,
	[SHOW_BAR_CHART]: BarChartBlock,
	[SHOW_LINE_CHART]: LineChartBlock,
	[SHOW_SHARE_BAR]: ShareBarBlock,
	[SHOW_BREADCRUMB]: BreadcrumbBlock,
	[SHOW_PROGRESS]: ProgressBlock,
	[SHOW_SHORTCUTS]: ShortcutsBlock,
	[SHOW_CHECKLIST]: ChecklistBlock,
	[SHOW_QUIZ]: QuizBlock,
	[SHOW_CONVERSATION]: ConversationBlock,
	[SHOW_PEOPLE]: AvatarBlock,
	[SHOW_BADGES]: BadgesBlock,
	[SHOW_EMPTY]: EmptyBlock,
	[SHOW_ITEM_LIST]: ItemListBlock,
	[SHOW_TIMELINE]: TimelineBlock,
	[SHOW_STATS]: StatsBlock,
	[SHOW_CALENDAR]: CalendarBlock,
	[SHOW_COLLAPSIBLE]: CollapsibleBlock,
	[SHOW_GLOSSARY]: GlossaryBlock,
	[SHOW_STEPS]: StepsBlock,
	[SHOW_TREE]: TreeBlock,
	[SHOW_PROS_CONS]: ProsConsBlock,
	[SHOW_KEY_VALUE]: KeyValueBlock,
	[SHOW_FILE_LIST]: AttachmentBlock,
	[SHOW_COMMAND_LIST]: CommandListBlock,
	[SHOW_CONFIRM_DIALOG]: AlertDialogBlock,
	[SHOW_ASPECT_RATIO]: AspectRatioBlock,
};

export default function GenerativeUi({ blocks }: { blocks: UiBlock[] }) {
	return (
		<>
			{blocks.map((block) => {
				// An unknown component name is skipped rather than crashing the turn.
				const Block = BLOCKS[block.name];
				if (!Block) return null;

				return (
					<div key={block.id} className="genui-block">
						<Block props={block.props} />
					</div>
				);
			})}
		</>
	);
}
