## NaN (Not-a-Number)

`NaN` is a special value in JavaScript that represents an invalid or undefined numerical result. Despite its name, `typeof NaN` is actually `"number"` — it's a member of the Number type reserved for cases where a mathematical operation fails to produce a meaningful number.

### How you get NaN

```javascript
0 / 0                  // NaN
Math.sqrt(-1)          // NaN
Number("hello")        // NaN
parseInt("abc")        // NaN
undefined + 1          // NaN
"abc" * 2              // NaN
Infinity - Infinity    // NaN
```

### The weirdest property of NaN: it's not equal to itself

```javascript
NaN === NaN   // false
NaN == NaN    // false
```

This is actually part of the IEEE 754 floating-point spec (which JS uses for all numbers). `NaN` is defined so that any comparison involving it — even with itself — returns `false`. This makes `NaN` the only JavaScript value that isn't equal to itself.

Practical consequence: you can't check for `NaN` with `===`.

```javascript
let x = NaN;
x === NaN;   // false — doesn't work!
```

## isNaN()

Because `===` doesn't work, JavaScript gives you `isNaN()` to check for `NaN`. But there are two versions with different behavior.

### 1. Global `isNaN()` — coerces first

```javascript
isNaN(NaN)        // true
isNaN("hello")    // true  ← "hello" gets coerced to Number first → NaN
isNaN(undefined)  // true  ← Number(undefined) is NaN
isNaN("123")      // false ← "123" coerces to 123, a valid number
isNaN(123)        // false
```

The global `isNaN()` first tries to convert its argument to a number with `Number(x)`, *then* checks if that result is `NaN`. This is the trap: it says `true` for lots of things that aren't actually the `NaN` value — they just *become* `NaN` after coercion.

### 2. `Number.isNaN()` — strict, no coercion (ES6+)

```javascript
Number.isNaN(NaN)        // true
Number.isNaN("hello")    // false ← no coercion, "hello" is not literally NaN
Number.isNaN(undefined)  // false
Number.isNaN(123)        // false
```

`Number.isNaN()` only returns `true` if the value is *literally* the `NaN` value already of type number. This is almost always what you actually want, so **prefer `Number.isNaN()` over the global `isNaN()`** in modern code.

### Quick comparison table

| Input | `isNaN(x)` | `Number.isNaN(x)` |
|---|---|---|
| `NaN` | true | true |
| `"hello"` | true | false |
| `undefined` | true | false |
| `{}` | true | false |
| `"123"` | false | false |
| `123` | false | false |
| `""` | false | false |

## Checking for NaN without either function

A neat trick that works everywhere, exploiting the self-inequality property:

```javascript
function myIsNaN(value) {
  return value !== value;
}
```

This works because `NaN` is the *only* JS value where `x !== x` is true.

## Other useful bits

- `Object.is(NaN, NaN)` → `true` (this is one place `NaN` *does* compare equal to itself — `Object.is` uses a stricter "SameValue" algorithm, not `===`)
- Arrays: `[NaN].includes(NaN)` → `true` (uses `SameValueZero`, so it correctly finds `NaN`)
- But: `[NaN].indexOf(NaN)` → `-1` (uses `===` internally, so it fails to find it — classic gotcha)

## TL;DR

- `NaN` means "invalid number result," and is the only value not equal to itself.
- Use `Number.isNaN(x)` for a reliable, no-surprises check.
- Avoid global `isNaN(x)` unless you specifically want coercion behavior.