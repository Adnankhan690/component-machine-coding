import { createContext, useContext, useEffect, useRef, useState } from "react";

interface PopoverContextType {
	showPopover: boolean;
	togglePopover: () => void;
	actionButtonRef: React.RefObject<HTMLButtonElement | null>;
	contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export function ProviderPopover({ children }: { children: React.ReactNode }) {
	const [showPopover, setShowPopover] = useState(false);
	const [screenHeight, setScreenHeight] = useState(window.innerHeight);
	const actionButtonRef = useRef<HTMLButtonElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	function togglePopover() {
		const newValue = !showPopover;
		if (newValue && actionButtonRef.current && contentRef.current) {
			const scrollY = window.scrollY || document.documentElement.scrollTop;
			const screenHeight = window.innerHeight;

			const { top, left, height, bottom } =
				actionButtonRef.current?.getBoundingClientRect();

			const {
				top: bTop,
				left: bLeft,
				height: bHeight,
			} = contentRef.current?.getBoundingClientRect();

			// const topAvailableSpace = screenHeight
			if (top > screenHeight - bottom) {
				contentRef.current.style = `top: ${
					top - bHeight - 8
				}px; left: ${left}px;`;
				setShowPopover(newValue);
				return;
			} else {
				contentRef.current.style = `top: ${
					top + height + scrollY + 8
				}px; left: ${left}px;`;
			}
			console.log(bHeight,"hh");
		}

        console.log("sdfs");
        
		// const totalHeight
		setShowPopover(newValue);
	}

	useEffect(() => {
		const handleScreenResize = () => {
			setScreenHeight(window.innerHeight);
		};
		window.addEventListener("resize", handleScreenResize);

		return () => {
			window.removeEventListener("resize", handleScreenResize);
		};
	}, []);

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
