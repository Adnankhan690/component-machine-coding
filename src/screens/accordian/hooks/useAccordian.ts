import { useState } from "react";

export interface Accordian {
    id: string;
    title: string;
    description: string;
}

export const accordianData: Accordian[] = [
    {
        id: "1",
        title: "Do I have to allow the use of cookies?",
        description: "Unicorn vinyl poutine brooklyn, next level direct trade iceland. Shaman copper mug church-key coloring book, whatever poutine normcore fixie cred kickstarter post-ironic street art."
    },
    {
        id: "2",
        title: "How do I change my My Page password?",
        description: "Coloring book forage photo booth gentrify lumbersexual. Migas chillwave poutine synth shoreditch, enamel pin thundercats fashion axe roof party polaroid chartreuse."
    },
    {
        id: "3",
        title: "What is BankID?",
        description: "Enamel pin fam sustainable woke whatever venmo. Authentic asymmetrical put a bird on it, lumbersexual activated charcoal kinfolk banjo cred pickled sartorial."
    },
    {
        id: "4",
        title: "Whose birth number can I use?",
        description: "Edison bulb direct trade gentrify beard lo-fi seitan sustainable roof party franzen occupy squid. Knausgaard cronut succulents, scenester readymade shabby chic lyft. Copper mug meh vegan gentrify."
    },
    {
        id: "5",
        title: "Do I need a mobile app?",
        description: "Aesthetic synthbay carry on, tote bag vice taxidermy pabst blue ribbon microdosing normcore. Cardigan banh mi deep v ennui."
    },

]

export default function useAccordian() {
    const [accordianIds, setAccordianIds] = useState<string[]>([]);

    const handleShowAccordian = (id: string) => {
        setAccordianIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id)
            }
            return [...prev, id];
        })
    }

    return {
        accordianIds,
        handleShowAccordian,
    }

}