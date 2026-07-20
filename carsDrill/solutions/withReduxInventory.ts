//1013530313
// upi trNSE -
import { inventory } from "../data/inventory.js";

function solutionOne() {
    const car33 = inventory.reduce((acc, curr) => {
        if (curr.id === 33) {
            return curr;
        }
        return acc;
    }, null as typeof inventory[0] | null);

    console.log(
        `Car ${car33?.id} is a ${car33?.car_year} ${car33?.car_make} ${car33?.car_model}`,
    );
}

function solutionTwo() {
    const car33 = inventory.reduce((acc, curr, idx) => {
        if (idx === inventory.length - 1) {
            return curr;
        }
        return curr;
    }, null as typeof inventory[0] | null);

    console.log(
        `Car ${car33?.id} is a ${car33?.car_year} ${car33?.car_make} ${car33?.car_model}`,
    );
}

function solutionFour() {
    const carYears = inventory.reduce((acc, curr) => {
        if (!acc.includes(curr.car_year)) {
            return [...acc, curr.car_year];
        }

        return acc;
    }, [] as number[]);

    console.log(carYears);
}

function solutionFive() {
    const olderCars = inventory.reduce((acc, curr) => {
        if (curr.car_year < 2000) {
            return [...acc, curr];
        }
        
        return acc;
    }, [] as typeof inventory);

    console.log(olderCars.length);
}

function solutionSix() {
    const bmwAndAudi = inventory.reduce((acc, curr) => {
        if (curr.car_make === "BMW" || curr.car_make === "Audi") {
            return [...acc, curr];
        }
        return acc;
    }, [] as typeof inventory);

    console.log(bmwAndAudi.length);
}

// solutionOne();
// solutionTwo();
// solutionFour();
// solutionFive();
solutionSix();