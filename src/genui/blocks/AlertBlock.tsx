import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isStr, obj } from "./guards";

// The model picks a token from a closed set; this map decides what it renders.
// That indirection is what keeps the model out of the styling.
const TONES = {
	note: { icon: Info, variant: "default" },
	success: { icon: CircleCheck, variant: "default" },
	warning: { icon: TriangleAlert, variant: "default" },
	danger: { icon: CircleAlert, variant: "destructive" },
} as const;

type Tone = keyof typeof TONES;

const isTone = (value: unknown): value is Tone => isStr(value) && value in TONES;

export default function AlertBlock({ props }: { props: unknown }) {
	const { tone, title, description } = obj(props);

	if (!isStr(title) || !isStr(description)) return null;

	// An unrecognised tone is a styling detail, not a reason to drop the content.
	const { icon: Icon, variant } = TONES[isTone(tone) ? tone : "note"];

	return (
		<Alert variant={variant}>
			<Icon />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
}
