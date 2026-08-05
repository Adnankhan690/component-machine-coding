import { createContext, useContext } from "react";

interface PopoverProviderType {
    onToggle: () => void;

}

const PopoverContext = createContext<PopoverProviderType | undefined>(undefined);

export default function ProviderPopover({ children }: { children: React.ReactNode }) {

    const onToggle = () => {

    }

    return (
        <PopoverContext.Provider value={{ onToggle }}>
            {children}
        </PopoverContext.Provider>
    )

}

export function useProvider() {
    const context = useContext(PopoverContext);

    if (!context) {
        throw new TypeError('useProvider must be used with PopoverProvider');
    }

    return context;
}