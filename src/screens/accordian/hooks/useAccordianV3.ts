
import { useState } from "react";
import { type Accordian } from "../components/AccordianV3";

interface UseAccordianProp {
    data: Accordian[]
}

export default function useAccordianV3({ data }: UseAccordianProp) {
    const [accordianId, setAccordianId] = useState<string>('');

    const toggleAccordian = (id: string) => {
        const val = accordianId.includes(id);
        setAccordianId((_prev) => {
            if (val) {
                return '';
            }
            return id
        })
    }

    return {
        accordianId,
        toggleAccordian,
    }
}