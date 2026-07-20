import { inventory } from "../data/inventory.js";

function solutionOne() {
	const findCarById = (id: number) => {
		return inventory.find((car) => car.id === id);
	};

	const carInfo = findCarById(33);

	console.log(
		`Car ${carInfo?.id} is a ${carInfo?.car_year} ${carInfo?.car_make} ${carInfo?.car_model}`,
	);
}

function solutionTwo() {
    const lastCar = inventory[inventory.length - 1];

    console.log(
		`Last car is a ${lastCar?.car_make} ${lastCar?.car_model}`,
	);
}

function solutionThree() {
    const carModels = inventory.map(car => car.car_model).sort((a,b) => b.localeCompare(a));

    console.log(carModels);
}

function solutionFour() {
    const carYears: number[] = [];

    inventory.forEach(car => {
        if (carYears.includes(car.car_year)) {
            return;
        }

        carYears.push(car.car_year);
    })

    console.log(carYears);
}

function solutionFive() {
    const oldCars = inventory.map(car => car.car_year < 2000 ? car: null).filter(car => car)

    console.log(oldCars);
}

function solutionSix() {
    const carMaskes = inventory.filter(car => car.car_make === "BMW" || car.car_make === "Audi")
    console.log(carMaskes.length);
}

// solutionOne();
// solutionTwo();
// solutionThree();
// solutionFour();
// solutionFive();
// solutionSix();
