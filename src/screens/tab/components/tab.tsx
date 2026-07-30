import useTab, { tabData } from "../hooks/useTab";
import "../tabV1.css";

export default function Tab() {
    const { handleTabClick, activeTabContent } = useTab();

    return (
        <div>
            <div className="tab-btn-con">
                {tabData.map((tab) => {
                    return (
                        <div key={tab.id}>
                            <button onClick={() => handleTabClick(tab.id)}>{tab.title}</button>
                        </div>
                    )
                })}
            </div>

            <div>{activeTabContent?.content}</div>
        </div>
    )
}