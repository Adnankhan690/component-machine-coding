import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { isStr, obj } from "./guards";

/**
 * A confirm dialog normally takes an `onConfirm` callback, and a function
 * cannot survive JSON. So this one confirms nothing: the model is drafting the
 * WORDS of a destructive-action dialog ("what should the delete-account
 * confirmation say"), and choosing an option just reports what would happen.
 * Open state and the chosen option are interaction state, owned internally.
 */
export default function AlertDialogBlock({ props }: { props: unknown }) {
	const { trigger, title, description, confirmLabel, cancelLabel } = obj(props);

	// Hooks run before the early return, or hook order changes between renders.
	const [outcome, setOutcome] = useState<"confirmed" | "cancelled" | null>(null);

	if (!isStr(trigger) || !isStr(title) || !isStr(description)) return null;
	if (!isStr(confirmLabel)) return null;

	const cancel = isStr(cancelLabel) && cancelLabel !== "" ? cancelLabel : "Cancel";

	return (
		<div className="space-y-2">
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="outline">{trigger}</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{title}</AlertDialogTitle>
						<AlertDialogDescription>{description}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setOutcome("cancelled")}>
							{cancel}
						</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={() => setOutcome("confirmed")}>
							{confirmLabel}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Spelled out in words, so the result is never carried by colour alone. */}
			{outcome && (
				<p className="text-xs text-muted-foreground">
					{outcome === "confirmed"
						? `"${confirmLabel}" chosen — nothing was actually run.`
						: `"${cancel}" chosen.`}
				</p>
			)}
		</div>
	);
}
