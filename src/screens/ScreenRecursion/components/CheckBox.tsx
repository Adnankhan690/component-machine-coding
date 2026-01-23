interface CheckBoxProps {
    value: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: string
}

export default function CheckBox({ value, handleChange, id }: CheckBoxProps) {
    return (
        <input type="checkbox" checked={value} onChange={handleChange} id={id} />
    )
}