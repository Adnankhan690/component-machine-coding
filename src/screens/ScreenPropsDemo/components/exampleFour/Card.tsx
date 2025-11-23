import "./card.css";

export default function Card({ mode }: { mode?: boolean }) {
    return (
        <div className="card">
            <h3>Child Component</h3>
            <p>This is a card component.</p>
            <p>Current Mode: {mode ? "ON" : "OFF"}</p>
        </div>
    )
}