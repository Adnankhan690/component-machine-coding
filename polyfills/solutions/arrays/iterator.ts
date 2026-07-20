// 1. Create a custom Iterable object
const wordIterable = {
	words: ["Hello", "World"],

	// The Iterable protocol requires this symbol method
	[Symbol.iterator]() {
		let index = 0;
		const items = this.words;

		// The Iterator protocol returns an object with a next() method
		return {
			next() {
				if (index < items.length) {
					return { value: items[index++], done: false };
				} else {
					return { value: undefined, done: true };
				}
			},
		};
	},
};

// 2. Obtain the iterator
const iterator = wordIterable[Symbol.iterator]();

// 3. Manually call next() step-by-step
console.log(iterator.next()); // { value: "Hello", done: false }
console.log(iterator.next()); // { value: "World", done: false }
console.log(iterator.next()); // { value: undefined, done: true }


// ---------------------------------SYMBOL--------------------------------------------

// 1
const sym1 = Symbol("myKey");
const sym2 = Symbol("myKey");

console.log(sym1 === sym2); // false



// 2
const id = Symbol("id");
const user = {
  name: "Adnan",
  [id]: 12345 // Symbol key
};

console.log(Object.keys(user)); // [ 'name' ] (ignores the symbol)
console.log(user[id]);         // 12345


// 3
const myObj = {
    name: "Antigravity",
    // Override toString behavior using a well-known symbol
    get [Symbol.toStringTag]() {
      return "AwesomeAgent";
    }
  };
  
  console.log(Object.prototype.toString.call(myObj)); // "[object AwesomeAgent]"
  