export interface Config {
    id: string;
    label: string;
    value: boolean;
    children?: Config[];
}

export const config: Config[] = [
    {
        id: "fruit",
        label: "Fruit",
        value: false,
        children: [
            {
                id: "apple",
                label: "Apple",
                value: false,
            },
            {
                id: "banana",
                label: "Banana",
                value: false,
            },
            {
                id: "citrus",
                label: "Citrus",
                value: false,
                children: [
                    {
                        id: "orange",
                        label: "Orange",
                        value: false,
                    },
                    {
                        id: "lemon",
                        label: "Lemon",
                        value: false,
                        children: [
                            {
                                id: "green-lemon",
                                label: "green lemon",
                                value: false,
                            },
                            {
                                id: "yellowLemon",
                                label: "yellow lemon",
                                value: false,
                            }
                        ]
                    },
                ]
            },
            {
                id: "vine",
                label: "Vine",
                value: false,
                children: [
                    {
                        id: "grape",
                        label: "Grape",
                        value: false,
                    },
                    {
                        id: "strawberry",
                        label: "Strawberry",
                        value: false,
                    },
                ]
            },
            
        ]
    },
    {
        id: "vegetable",
        label: "Vegetable",
        value: false,
        children: [
            {
                id: "carrot",
                label: "Carrot",
                value: false,
            },
            {
                id: "potato",
                label: "Potato",
                value: false,
            },
            {
                id: "spinach",
                label: "Spinach",
                value: false,
            },
        ]
    },
    {
        id: "grain",
        label: "Grain",
        value: false,
        children: [
            {
                id: "rice",
                label: "Rice",
                value: false,
            },
            {
                id: "wheat",
                label: "Wheat",
                value: false,
            },
            {
                id: "barley",
                label: "Barley",
                value: false,
            },
        ]
    },
    {
        id: "dairy",
        label: "Dairy",
        value: false,
        children: [
            {
                id: "milk",
                label: "Milk",
                value: false,
            },
            {
                id: "cheese",
                label: "Cheese",
                value: false,
            },
            {
                id: "eggs",
                label: "Eggs",
                value: false,
            },
        ]
    },
]