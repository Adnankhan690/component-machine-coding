import { createContext, useContext } from "react";
import useData from "../hook/useData";

interface CardContext {
    title: string;
    strength: string[];
    circles: number[];
    image: string;
}

const CardContext = createContext<CardContext | null>(null);

export default function CardProvider({ children }: { children: React.ReactNode }) {
    const { circles, image, strength, title} = useData();
    
    return (
        <CardContext.Provider value={{title, image, circles, strength}}>
            {children}
        </CardContext.Provider>
    )
}

export function useCard() {
    const context = useContext(CardContext);

    if (!context) {
        throw new Error("card context must be used within Card Provider")
    }

    return context;
}