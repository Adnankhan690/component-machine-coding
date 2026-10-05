import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { list, obj } from "./guards";

interface Slide {
	id: string;
	title: string;
	content: string;
}

export default function CarouselBlock({ props }: { props: unknown }) {
	const slides = list<Slide>(obj(props).slides, { str: ["id", "title", "content"] });
	if (!slides) return null;

	return (
		<Carousel className="mx-10">
			<CarouselContent>
				{slides.map((slide, idx) => (
					<CarouselItem key={slide.id}>
						{/* Card draws its outline with an outside ring, which the carousel's
						    overflow-hidden would clip to just the corners. Give it room. */}
						<div className="p-1">
							<Card>
								<CardContent className="space-y-2">
									<p className="text-xs text-muted-foreground">
										{idx + 1} / {slides.length}
									</p>
									<p className="font-medium">{slide.title}</p>
									<p className="text-sm leading-relaxed whitespace-pre-wrap">
										{slide.content}
									</p>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
