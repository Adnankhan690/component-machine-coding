import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

interface PopoverProviderType {
    showPopover: boolean;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    onToggle: () => void;

}

const PopoverContext = createContext<PopoverProviderType | undefined>(undefined);

const useIsomorphicEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export default function ProviderPopover({ children }: { children: React.ReactNode }) {

    const [showPopover, setShowPopover] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const onToggle = () => {
        setShowPopover((prev) => !prev);
    }

    useIsomorphicEffect(() => {
        if (!showPopover || !buttonRef.current || !contentRef.current) return;

        const updatePopover = () => {
            if (!buttonRef.current || !contentRef.current) return;

            const btnRect = buttonRef.current.getBoundingClientRect() as DOMRect;
            const contentRect = contentRef.current.getBoundingClientRect() as DOMRect;

            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            const spaceAbove = btnRect.top;
            const spaceBelow = window.innerHeight - btnRect.bottom;

            const left = window.scrollX + btnRect.left;
            let top;

            if (spaceAbove > spaceBelow && contentRect.height > spaceBelow) {
                // top = window.scrollY + window.innerHeight - contentRect.height - 8;
                top = button.top + scrollY - content.height;

            } else {
                top = btnRect.bottom + window.scrollY + 8;
            }

            contentRef.current.style.position = "absolute";
            contentRef.current.style.top = `${top}px`;
            contentRef.current.style.left = `${left}px`;
        }

        updatePopover();

        window.addEventListener("scroll", updatePopover, true);
        window.addEventListener("resize", updatePopover);


        return () => {
            window.removeEventListener("scroll", updatePopover);
            window.removeEventListener("resize", updatePopover);
        }

    }, [showPopover])

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