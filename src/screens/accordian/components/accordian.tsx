// add animation slider
import "../accordianV1.css";
import useAccordian from "../hooks/useAccordian";
import { accordianData, type Accordian } from "../hooks/useAccordian"


export default function Accordian() {
    const { accordianIds, handleShowAccordian } = useAccordian();

    return (
        <div className="accordian-con">
            {accordianData.map((item: Accordian) => {
                return (
                    <div key={item.id} className="card-con">
                        <div className='title-btn-con'>
                            <h3>{item.title}</h3>
                            <button onClick={() => handleShowAccordian(item.id)}>+</button>
                        </div>
                        {accordianIds.includes(item.id) && (
                            <div>
                                <p>{item.description}</p>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}