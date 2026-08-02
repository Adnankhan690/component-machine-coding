import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

interface PopoverContextType {
    showPopover: boolean;
    togglePopover: () => void;
    actionButtonRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

// Safe SSR useLayoutEffect fallback
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ProviderPopover({ children }: { children: React.ReactNode }) {
    const [showPopover, setShowPopover] = useState(false);
    const actionButtonRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const togglePopover = () => {
        setShowPopover((prev) => !prev);
    };

    // Calculate positioning AFTER popover mounts/renders to the DOM
    useIsomorphicLayoutEffect(() => {
        if (!showPopover || !actionButtonRef.current || !contentRef.current) return;

        const updatePosition = () => {
            if (!actionButtonRef.current || !contentRef.current) return;

            const buttonRect = actionButtonRef.current.getBoundingClientRect();
            const contentRect = contentRef.current.getBoundingClientRect();

            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const scrollX = window.scrollX || document.documentElement.scrollLeft;
            const viewportHeight = window.innerHeight;

            const spaceBelow = viewportHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;

            let top: number;
            
            // If there's not enough room below AND more room above, flip popover upwards
            if (spaceBelow < contentRect.height && spaceAbove > spaceBelow) {
                top = buttonRect.top + scrollY - contentRect.height - 8;
            } else {
                top = buttonRect.bottom + scrollY + 8;
            }

            const left = buttonRect.left + scrollX;

            contentRef.current.style.position = "absolute";
            contentRef.current.style.top = `${top}px`;
            contentRef.current.style.left = `${left}px`;
        };

        // Position immediately
        updatePosition();

        // Reposition on window scroll or resize
        window.addEventListener("resize", updatePosition);
		//ask why true is added ?
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [showPopover]);

    return (
        <PopoverContext.Provider
            value={{ showPopover, togglePopover, actionButtonRef, contentRef }}>
            {children}
        </PopoverContext.Provider>
    );
}

export default function usePopoverContext() {
    const context = useContext(PopoverContext);
    if (!context) {
        throw new Error("usePopoverContext must be used within a ProviderPopover");
    }

    return context;
}