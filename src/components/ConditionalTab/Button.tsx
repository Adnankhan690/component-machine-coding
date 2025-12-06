import "./button.css";

export interface ButtonProps {
	onClick: (index: number) => void;
	active: boolean;
	index: number;
	label: string;
}

export default function Button({ active, index, label, onClick }: ButtonProps) {
    
	return <button data-selected={active} role="Tab" aria-selected={active} aria-controls={`tabpanel-${index}`} id={`tab-${index}`} onClick={() => onClick(index)}>{label}</button>;
}
