import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { isStr, list, obj, strArr } from "./guards";

interface Question {
	id: string;
	question: string;
	options: string[];
	answer: string;
	explanation: string;
}

export default function QuizBlock({ props }: { props: unknown }) {
	const parsed = list<Question>(obj(props).questions, {
		str: ["id", "question", "answer", "explanation"],
		strs: ["options"],
	});

	// Answered-so-far is interaction state. The model supplies the quiz, not the attempt.
	const [picked, setPicked] = useState<Record<string, string>>({});

	if (!parsed) return null;

	// An answer that is not one of the options makes the question unmarkable.
	const questions = parsed.filter(
		(question) => strArr(question.options) && question.options.includes(question.answer),
	);
	if (questions.length === 0) return null;

	return (
		<div className="space-y-3">
			{questions.map((question) => {
				const choice = picked[question.id];
				const correct = choice === question.answer;

				return (
					<Card key={question.id}>
						<CardHeader>
							<CardTitle className="text-sm font-medium">{question.question}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<RadioGroup
								value={choice ?? ""}
								onValueChange={(value) =>
									setPicked((prev) => ({ ...prev, [question.id]: value }))
								}>
								{question.options.map((option, idx) => {
									const optionId = `${question.id}-${idx}`;
									return (
										<div key={optionId} className="flex items-center gap-2.5">
											<RadioGroupItem id={optionId} value={option} />
											<Label htmlFor={optionId} className="font-normal">
												{option}
											</Label>
										</div>
									);
								})}
							</RadioGroup>

							{isStr(choice) && (
								<div className="rounded-md border p-2.5 text-sm">
									{/* Not colour alone: the verdict is spelled out in words. */}
									<p className="font-medium">{correct ? "Correct" : "Not quite"}</p>
									{!correct && (
										<p className="text-muted-foreground">Answer: {question.answer}</p>
									)}
									<p className="text-muted-foreground">{question.explanation}</p>
								</div>
							)}
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
