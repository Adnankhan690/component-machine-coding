import { useEffect, useRef, useState } from "react";
import "./accordian.css";
import { ChevronDown } from "lucide-react";

interface AccordianProps {
	title: string;
	children: React.ReactNode;
	icon: React.ReactNode;
}

export default function Accordian({ title, children, icon }: AccordianProps) {
	const [expand, setExpand] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = useState(0);

	const handleExpand = () => {
		setExpand(!expand);
	};

	useEffect(() => {
		//ref way
		// 	if (contentRef.current) {
		// 		setContentHeight(contentRef.current.scrollHeight);
		// 	}

		//js way
		const maxHeight =
			document.getElementById("accordian-content")?.scrollHeight || 0;
		setContentHeight(maxHeight);
	}, [children]);

	return (
		<div className="accordian">
			<button
				aria-expanded={expand}
				id="accordian-controls"
				aria-controls="accordian-content"
				onClick={handleExpand}
				className="controls">
				{title}
				{icon ? <div>{icon}</div> : <ChevronDown />}
            </button>
            
            <div className="separator"></div>

            <div
                tabIndex={0}
				aria-expanded={expand}
				aria-labelledby="accordian-controls"
				id="accordian-content"
				className="content"
				ref={contentRef}
				data-expanded={expand}
				style={{ maxHeight: expand ? `${contentHeight}px` : "0px" }}>
				<div className="content-inner">{children}</div>
			</div>
		</div>
	);
}
