import "./nested-checkbox.css";
import Checkbox from "./components/Checkbox";
import { useState } from "react";

export interface Checkbox {
    id: string;
    title: string;
    description?: string;
    isChecked: boolean;
    child: Checkbox[] | [];
}

const nestedCheckbox: Checkbox[] = [
    {
        id: "1",
        title: "Hello world",
        description: "randowm des",
        isChecked: true,
        child: [
            {
                id: "2",
                title: "Jurasic world",
                description: "dinasour",
                isChecked: false,
                child: [],
            },
            {
                id: "4",
                title: "Dream world",
                description: "biscuit",
                isChecked: false,
                child: [
                    {
                        id: "5",
                        title: "Daemon Slayer",
                        description: "kimetsu",
                        isChecked: false,
                        child: [
                            {
                                id: "6",
                                title: "JJK",
                                description: "itadori",
                                isChecked: false,
                                child: [],
                            },
                            {
                                id: "7",
                                title: "Naruto",
                                description: "Naruto",
                                isChecked: false,
                                child: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "3",
        title: "baldwin king",
        description: "England",
        isChecked: false,
        child: [],
    },
];


// A node with children does not own its checked state: it is checked exactly
// when EVERY child is. Only leaves carry a value of their own.
//
// This runs bottom-up. `child` is computed before the parent object is built,
// so by the time we decide the parent, its children are already final.
const withParents = (data: Checkbox[]): Checkbox[] => {
    return data.map((box: Checkbox) => {
        const child = withParents(box.child);

        return {
            ...box,
            isChecked: child.length > 0 ? child.every((c) => c.isChecked) : box.isChecked,
            child,
        };
    });
};

export default function NestedCheckbox() {
    // The seed data has a checked parent with unchecked children, so derive it
    // once up front rather than rendering a contradiction until the first click.
    const [checkbox, setCheckbox] = useState<Checkbox[]>(() => withParents(nestedCheckbox));

    const handleToggle = (
        id: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const isChecked = e.target.checked;

        // `force` is how a matched node tells everything beneath it what to do:
        //   null       -> still searching for the clicked node
        //   true/false -> inside the clicked subtree, apply to every descendant
        //
        // It is a PARAMETER, not a variable in this closure, so it unwinds with
        // the call stack. A closure flag would stay set after the matched
        // subtree finished and leak into siblings and other roots.
        const toggle = (data: Checkbox[], force: boolean | null): Checkbox[] => {
            return data.map((box: Checkbox) => {
                // Already forced by an ancestor, or this is the clicked node.
                const next = force ?? (box.id === id ? isChecked : null);

                return {
                    ...box,
                    // Still null means untouched: outside the clicked subtree.
                    isChecked: next ?? box.isChecked,
                    child: toggle(box.child, next),
                };
            });
        };

        // Down first (the click wins over its subtree), then up (parents follow
        // their children). Two passes, each doing one thing.
        setCheckbox((prev) => withParents(toggle(prev, null)));
    };
    
    return (
        <section>
            <h1>Nested Checkbox</h1>
            {/* Implementation goes here. */}

            <div className="main-con">
                <Checkbox data={checkbox} onToggle={handleToggle} />
            </div>
        </section>
    );
}
