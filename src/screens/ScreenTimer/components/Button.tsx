interface ButtonProps {
    btnText?: string;
    onClick: () => void;
}

export default function Button({onClick,btnText}: ButtonProps) {
    const handleClick = () => {
        onClick();
    }
    
    return (
        <button onClick={handleClick}>{btnText}</button>
    )
}