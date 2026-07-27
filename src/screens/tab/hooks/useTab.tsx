import { useState } from "react";
import ComponentA from "../components/componentA";
import ComponentB from "../components/componentB";
import ComponentC from "../components/componentC";

export interface Tab {
    id: string;
    title: string;
    content: React.ReactNode;
}

export const tabData: Tab[] = [
    {
        id: "tab-1",
        title: "tab-1",
        content: <ComponentA />

    },
    {
        id: "tab-2",
        title: "tab-2",
        content: (
            <div>
               <ComponentB />
            </div>
        )
    },
    {
        id: "tab-3",
        title: "tab-3",
        content: (
            <div>
               <ComponentC />
            </div>
        )
    }
]

export default function useTab() {
    const [activeTab, setActiveTab] = useState<string>(tabData[0].id);

    const handleTabClick = (id: string) => {
        setActiveTab(id);
    }

    const activeTabContent = tabData.find((tab) => tab.id === activeTab);

    return {
        activeTab,
        handleTabClick,
        activeTabContent,
    }
}