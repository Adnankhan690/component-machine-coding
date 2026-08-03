import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

interface PopoverContextTypeV1 {
    showPopover: boolean;
    togglePopover: () => void;
    triggerBtnRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverCtx = createContext<PopoverContextTypeV1 | undefined>(undefined);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function ProviderPopoverV1({ children }: { children: React.ReactNode }) {

    const [showPopover, setShowPopover] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const togglePopover = () => {
        setShowPopover((prev) => !prev);
    }

    useIsomorphicLayoutEffect(() => {
        if (!showPopover || !buttonRef || !contentRef) return;

        const updatePopover = () => {
            if (!contentRef.current && !buttonRef.current) return;
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            let button = buttonRef.current?.getBoundingClientRect() as DOMRect;
            let content = contentRef.current?.getBoundingClientRect() as DOMRect;

            const spaceAbove = button.top;
            const spaceBelow = window.innerHeight - button.bottom;

            let top;

            if (spaceAbove > spaceBelow && content.height > spaceBelow) {
                top = button.top + scrollY - content.height;
            } else {
                top = button.bottom + scrollY;
            }

            const left = scrollX + button.left;

            contentRef.current.style.position = 'absolute';
            contentRef.current.style.top = `${top}px`;
            contentRef.current.style.left = `${left}px`;
        }

        updatePopover();

        window.addEventListener("scroll", updatePopover, true);
        window.addEventListener("updatePopover", updatePopover);

        return () => {
            window.removeEventListener("scroll", updatePopover);
            window.addEventListener("resize", updatePopover);
        }

    }, [showPopover])

    return (
        <PopoverCtx.Provider value={{ showPopover, contentRef, togglePopover, triggerBtnRef: buttonRef }}>
            {children}
        </PopoverCtx.Provider >
    )
}

export function usePopoverContextV1() {
    const context = useContext(PopoverCtx);
    if (!context) {
        throw new TypeError('usePopoverContext must be used within ProviderPopover');
    }

    return context;
}