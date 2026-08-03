import ProviderPopoverV1 from "../context/ProviderPopoverV1";

export default function PopoverV1({ children }: { children: React.ReactNode }) {
    return (
        <ProviderPopoverV1>
            {children}
        </ProviderPopoverV1>
    )
}