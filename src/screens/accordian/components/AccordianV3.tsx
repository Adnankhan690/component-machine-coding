import "../accordianV3.css";
import useAccordianV3 from "../hooks/useAccordianV3";

export interface Accordian {
    id: string;
    title: string;
    description: string;
}

interface AccordianV3Prop {
    data: Accordian[];
}

export default function AccordianV3({ data }: AccordianV3Prop) {
    const { accordianId, toggleAccordian } = useAccordianV3({ data });

    const isOpen = (id: string) => {
        return accordianId.includes(id);
    }

    return (
        <div className="accordian-con">
            {data.map(({ title, description, id }) => (
                <div key={id} className="accordian-box-wrapper">
                    {/* // title and btn  */}
                    <div className="title-btn-wrapper">
                        <p>{title}</p>
                        <button onClick={() => toggleAccordian(id)}>{accordianId === id ? '-' : '+'}</button>
                    </div>
                    {/* content  */}
                    <div className={`desc-con ${isOpen(id) ? 'open' : ''}`}>
                        <div className="desc-height">
                            <div>{description}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}