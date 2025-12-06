export interface ButtonProps {
    label: string;
    index: number;
    active: boolean;
    onClick: (index: number) => void;
}

export default function Button({active,index,label,onClick}:ButtonProps) {
    return (
        <button key={index} data-active={active} onClick={() => onClick(index)}>{ label}</button>
    )
}