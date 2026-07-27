import "../accordianV2.css";
import useAccordian from "../hooks/useAccordian";
import { accordianData, type Accordian } from "../hooks/useAccordian";

export default function AccordianV2() {
    const { accordianIds, handleShowAccordian } = useAccordian();

    return (
        <div className="accordian-con-v2">
            <h2>Accordian V2 (With Slider Animation)</h2>
            <div className="accordian-list-v2">
                {accordianData.map((item: Accordian) => {
                    const isOpen = accordianIds.includes(item.id);
                    return (
                        <div key={item.id} className="card-con-v2">
                            <div className="title-btn-con-v2">
                                <h3>{item.title}</h3>
                                <button onClick={() => handleShowAccordian(item.id)}>
                                    {isOpen ? "-" : "+"}
                                </button>
                            </div>
                            <div className={`accordion-content-v2 ${isOpen ? "open" : ""}`}>
                                <div className="accordion-inner-v2">
                                    <p className="description-v2">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
