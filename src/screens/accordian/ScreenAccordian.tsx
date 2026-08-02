// todo: use adapter pattern for decoupling data-type
// todo: use compound pattern so that style of the accordian can be customised.
import AccordianV2 from "./components/AccordianV2";
import AccordianV3 from "./components/AccordianV3";
import { accordianData } from "./hooks/useAccordian";

export default function ScreenAccordian() {

    return (
        <div>
            <h1>Accordian</h1>
            {/* <AccordianV2 /> */}
            <AccordianV3 data={accordianData} />

        </div>
    );
}
