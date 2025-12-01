import "./chip.css";

export default function Chip({ label }: { label: string }) {
    console.log("Chip component is rendered ✨👀");
    return <div className="chip-con">{label}</div>;
}