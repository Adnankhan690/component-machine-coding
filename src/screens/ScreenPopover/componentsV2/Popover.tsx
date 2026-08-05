import ProviderPopover from "../context/ProviderContextv2";

export default function Popover({ children }: { children: React.ReactNode }) {


    return (
        <ProviderPopover>
            {children}
        </ProviderPopover>
    )
}