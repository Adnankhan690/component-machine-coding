import { useState } from "react";
import "./tab.css";

interface TabProps {
	label: string;
	id: string;
	index: number; 
	isActive?: boolean;
	handleTabChange: (tabIndex: number) => void; //make it curried function
}

function Tab({ label, id, index, isActive, handleTabChange }: TabProps) {
	return (
		<button
			role="tab"
			id={`tab-${id}`}
			aria-selected={isActive}
			aria-controls={`panel-${id}`}
			data-active-button={isActive}
			onClick={() => handleTabChange(index)}
			className="tab-button">
			{label}
		</button>
	);
}

export default Tab;
