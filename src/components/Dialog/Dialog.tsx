import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./dialog.css";

interface DialogProps {
	showModal: boolean;
	onClose: () => void;
	onSubmit?: () => void;
	children: React.ReactNode;
}

export default function Dialog({
	showModal = true,
	onClose,
	onSubmit,
	children,
}: DialogProps) {
	const backdropRef = useRef<HTMLDivElement | null>(null);
	const dialogRef = useRef<HTMLDivElement | null>(null);
	const closeBtnRef = useRef<HTMLButtonElement | null>(null);

	const handleCloseDialog = () => {
		if (backdropRef.current && dialogRef.current) {
			backdropRef.current.classList.add("close-modal");
			dialogRef.current.classList.add("close-modal");

			dialogRef.current.addEventListener("animationend", handleAnimationEnd, {
				once: true,
			});
		}
	};

	const handleAnimationEnd = () => {
		onClose && onClose();
	};

	//This is the correct approach to close the dialog when clicking outside of it, but for now we are using the backdrop onClick handler.
	// useEffect(() => {
	// 	const handleClickeOutside = (event: MouseEvent) => {
	// 		if (dialogRef.current && !dialogRef.current.contains(event.target)) {
	// 			handleCloseDialog();
	// 		}
	//     };

	//     if (showModal) {
	//         document.addEventListener("mousedown", handleClickeOutside);
	//     }

	//     return () => {
	//         document.removeEventListener("mousedown", handleClickeOutside);
	//     }
	// }, [showModal, onClose]);

	useEffect(() => {
		const modalRoot = document.createElement("div");
		modalRoot.id = "modal-root";
		document.body.appendChild(modalRoot);

		return () => {
			if (modalRoot && modalRoot.parentNode) {
				modalRoot.parentNode.removeChild(modalRoot);
			}
		};
	}, []);

    useEffect(() => {
        const focusableSelectors =
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusableElements =
            dialogRef.current?.querySelectorAll(focusableSelectors);
        const firstElement = focusableElements && focusableElements[0] as HTMLElement;

        const lasteElement =
            focusableElements && focusableElements[focusableElements.length - 1] as HTMLElement;

		const onKeyDown = (e: KeyboardEvent) => {

            const activeElement = document.activeElement;
			if (e.key === "Escape" && showModal) {
				handleCloseDialog();
			}
			if (e.key === "Tab" && showModal) {
                if (e.shiftKey) {
                    if (activeElement === firstElement) {
                        e.preventDefault();
                        (lasteElement as HTMLElement).focus();
                    }
				} else {
					if (activeElement === lasteElement) {
						e.preventDefault();
						firstElement && firstElement.focus();
					}
				}
			}
		};
        document.addEventListener("keydown", onKeyDown);
        (firstElement as HTMLElement)?.focus();

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
    }, [showModal]);
    
    useEffect(() => {
			if (showModal) {
				const timer = setTimeout(() => {
					closeBtnRef.current?.focus();
				}, 20);
				return () => clearTimeout(timer);
			}
		}, [showModal]);
      

	if (!showModal) return null;

	return createPortal(
		<>
			<div ref={backdropRef} className="backdrop" onClick={onClose}>
				<div
					ref={dialogRef}
					className="dialog-container"
					onClick={(e) => {
						e.stopPropagation();
					}}>
					<button
						ref={closeBtnRef}
						onClick={handleCloseDialog}
						className="dialog-close">
						X
					</button>
					<div>
						<button>Hello there inside</button>
						{children}
					</div>
				</div>
			</div>
		</>,
		document.getElementById("modal-root") as HTMLElement
	);
}
