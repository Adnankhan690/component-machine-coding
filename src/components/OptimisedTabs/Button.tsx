import "./button.css";

export interface ButtonProps {
	label: string;
	index: number;
	active: boolean;
	onClick: (index: number) => void;
}

export default function Button({ active, index, label, onClick }: ButtonProps) {
	return (
		<button
			role="tab"
			aria-selected={active}
			aria-controls={`tabpanel-${index}`}
			id={`tab-${index}`}
			tabIndex={active ? 0 : -1}
			data-active={active}
			onClick={() => onClick(index)}>
			{label}
		</button>
	);
}

{/* <button 
  role="tab"                          // Identifies as a tab
  aria-selected={active}              // Indicates if tab is selected
  aria-controls={`tabpanel-${index}`} // Links to its panel
  id={`tab-${index}`}                 // Unique ID for association
  tabIndex={active ? 0 : -1}          // Only active tab is keyboard focusable */}