import { createContext, useRef, useState } from "react";

interface PopoverContextType {
    showPopover: boolean;
    togglePopover: () => void;
    triggerBtnRef: React.RefObject<HTMLButtonElement>;
    contentRef: React.RefObject<HTMLDivElement>;
}

const PopoverCtx = createContext<PopoverContextType | undefined>(undefined);

export default function PopoverContext({ children }: { children: React.ReactNode }) {

    const [showPopover, setShowPopover] = useState();
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    return (
        <PopoverCtx.Provider value={ showPopover}>
            {children}
        </PopoverCtx.Provider>
    )
}