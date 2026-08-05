import { createContext, useContext, useRef, useState } from "react";

interface PopoverProviderType {
    showPopover: boolean;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    onToggle: () => void;

}

const PopoverContext = createContext<PopoverProviderType | undefined>(undefined);

export default function ProviderPopover({ children }: { children: React.ReactNode }) {

    const [showPopover, setShowPopover] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const onToggle = () => {
        setShowPopover((prev) => !prev);
    }

    return (
        <PopoverContext.Provider value={{ onToggle, buttonRef, contentRef, showPopover }}>
            {children}
        </PopoverContext.Provider>
    )

}

export function usePopoverContext() {
    const context = useContext(PopoverContext);

    if (!context) {
        throw new TypeError('useProvider must be used with PopoverProvider');
    }

    return context;
}