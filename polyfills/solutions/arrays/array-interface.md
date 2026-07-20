```typescript
interface Array<T> {
	myFor<TThis = undefined>(
		this: T[],
		callback: (vaule: T, index: number, array: T[]) => void,
		thisArg?: TThis,
	): void;
}

interface Array<T> {
	myFor<TThis = undefined>(
		callback: (vaule: T, index: number, array: T[]) => void,
		thisArg?: TThis,
	): void;
}
```

# which one is correct ?

The **second one** is correct:

```typescript
interface Array<T> {
	myFor<TThis = undefined>(
		callback: (vaule: T, index: number, array: T[]) => void,
		thisArg?: TThis,
	): void;
}
```

### Why the first one causes a compiler error

In TypeScript, when you are writing a method signature inside an `interface` declaration, **you cannot include `this: T[]` inside the arguments list.** The interface definition itself already implicitly understands that the method belongs to the object instance (the array). If you try to pass `this` inside an interface method declaration, TypeScript will throw a syntax error:

> `An arrow function or method first parameter cannot be named 'this'.`

### Where do you actually use `this: T[]`?

You only use `this: T[]` when you are writing the **actual implementation** function block for the prototype, like this:

```typescript
// Correct place to use 'this: T[]' (The implementation)
Array.prototype.myFor = function <T, TThis>(
	this: T[],
	callback: (value: T, index: number, array: T[]) => void,
	thisArg?: TThis,
): void {
	// Your logic here...
};
```

### One quick optimization tip

You can make your declaration even better by typing the callback function's `this` context using `TThis`. This tells TypeScript exactly what `this` will point to _inside_ the callback function if the user uses a standard `function()` block instead of an arrow function:

```typescript
interface Array<T> {
	myFor<TThis = undefined>(
		// Added 'this: TThis' inside the callback function signature
		callback: (this: TThis, value: T, index: number, array: T[]) => void,
		thisArg?: TThis,
	): void;
}
```
