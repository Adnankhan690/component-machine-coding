import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

interface PopoverContextType {
    showPopover: boolean;
    togglePopover: () => void;
    triggerBtnRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverCtx = createContext<PopoverContextType | undefined>(undefined);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function ProviderPopover({ children }: { children: React.ReactNode }) {

    const [showPopover, setShowPopover] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const togglePopover = () => {
        setShowPopover((prev) => !prev);
    }

    useIsomorphicLayoutEffect(() => {

    }, [showPopover])

    return (
        <PopoverCtx.Provider value={{ showPopover, contentRef, togglePopover, triggerBtnRef: buttonRef }}>
            {children}
        </PopoverCtx.Provider >
    )
}

export function usePopoverContext() {
    const context = useContext(PopoverCtx);
    if (!context) {
        throw new TypeError('usePopoverContext must be used within ProviderPopover');
    }

    return context;
}