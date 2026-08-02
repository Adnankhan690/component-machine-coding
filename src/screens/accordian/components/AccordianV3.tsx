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

    return (
        <div>
            {data.map(({ title, description, id }, idx) => (
                <div key={id}>
                    {/* // title and btn  */}
                    <div>
                        <p>{title}</p>
                        <button onClick={() => toggleAccordian(id)}>{accordianId === id ? '-' : '+'}</button>
                    </div>
                    {/* content  */}
                    <div></div>
                </div>
            ))}
        </div>
    )
}